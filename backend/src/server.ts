import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { findUserByAuth0Id } from "./db/userService";
import prisma from "./db/index";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./config/openapi";
import { requireAuth } from "./middleware/auth";
import logger from "./lib/logger";

// Only load dotenv if .env file exists
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const result = dotenv.config();
  if (result.error) {
    logger.warn({ msg: 'Failed to load .env file', error: result.error.message });
  } else {
    logger.info('Loaded environment variables from .env file');
  }
} else {
  logger.info('No .env file found, using environment variables');
}

const app = express();
const PORT = process.env.PORT || 8000;
const specs = swaggerJsdoc(swaggerOptions);

// Add logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info({
    msg: 'Incoming request',
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  next();
});

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Serve the OpenAPI specification as JSON
app.get("/openapi.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

// App Configuration
app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns a simple message to confirm the server is running
 *     security: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello World!
 */
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check endpoint with database connection
 *     description: Checks if the server is running and can connect to the database
 *     responses:
 *       200:
 *         description: Server and database are healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       500:
 *         description: Database connection failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthErrorResponse'
 */
app.get("/health", async (req: Request, res: Response) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "OK",
      message: "Server is running and database is connected",
    });
  } catch (error: unknown) {
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
      error: (error as Error).message,
    });
  }
});

/**
 * @openapi
 * /user/{auth0Id}:
 *   get:
 *     summary: Get user by Auth0 ID
 *     description: Retrieve a user's information using their Auth0 ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: auth0Id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Auth0 ID of the user
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
app.get("/user/:auth0Id", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await findUserByAuth0Id(req.params.auth0Id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @openapi
 * /checkJwt:
 *   get:
 *     summary: Verify JWT token
 *     description: Endpoint to verify that the JWT token is valid
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is valid
 *                 userId:
 *                   type: string
 *                   description: The user ID from the token
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 */
app.get("/checkJwt", requireAuth, (req: Request, res: Response) => {
  logger.info({
    msg: 'Check JWT endpoint called',
    url: req.url,
    headers: req.headers
  });
  
  // @ts-ignore
  const userId = req.auth?.payload?.sub;

  if (userId) {
    logger.info({
      msg: 'JWT validation successful',
      userId: userId
    });
    
    res.json({
      message: "Token is valid",
      userId: userId,
    });
  } else {
    logger.warn('No user ID found in token');
    res.status(401).json({ error: "Unauthorized" });
  }
});

/**
 * @openapi
 * /unauthenticated:
 *   get:
 *     summary: Unauthenticated test endpoint
 *     description: Public endpoint that doesn't require authentication
 *     security: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This is an unauthenticated endpoint
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 */
app.get("/unauthenticated", (req: Request, res: Response) => {
  res.json({
    message: "This is an unauthenticated endpoint",
    timestamp: new Date().toISOString(),
  });
});

/**
 * @openapi
 * /authenticated:
 *   get:
 *     summary: Authenticated test endpoint
 *     description: Protected endpoint that requires authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This is an authenticated endpoint
 *                 userId:
 *                   type: string
 *                   example: auth0|123456789
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-01-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 */
app.get("/authenticated", requireAuth, (req: Request, res: Response) => {
  logger.info({
    msg: 'Authenticated endpoint called',
    url: req.url,
    headers: req.headers
  });
  
  // @ts-ignore
  const userId = req.auth?.payload?.sub;

  if (userId) {
    logger.info({
      msg: 'Authenticated request successful',
      userId: userId
    });
    
    res.json({
      message: "This is an authenticated endpoint",
      userId: userId,
      timestamp: new Date().toISOString(),
    });
  } else {
    logger.warn('No user ID found in authenticated request');
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Error handling middleware for authentication errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Check if this is a JWT authentication error from express-oauth2-jwt-bearer
  if (
    err.name === "UnauthorizedError" ||
    err.code === "invalid_token" ||
    err.code === "credentials_required" ||
    (err.statusCode && err.statusCode >= 400 && err.statusCode < 500)
  ) {
    logger.warn({
      msg: 'Authentication error caught by error handler',
      error: err.message,
      url: req.url
    });
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  logger.error({
    msg: 'Unexpected error',
    error: err.message,
    stack: err.stack,
    url: req.url
  });
  // Always call next or send response
  return next(err);
});

// Server setup
app.listen(PORT, () => {
  logger.info({
    msg: `Server is running on port ${PORT}`,
    port: PORT
  });
});