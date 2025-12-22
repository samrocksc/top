import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { findUserByAuth0Id } from "./db/userService";
import prisma from "./db/index";
import { auth } from "express-oauth2-jwt-bearer";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./config/openapi";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const specs = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Serve the OpenAPI specification as JSON
app.get("/openapi.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

// App Configuration
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  auth({
    audience:
      process.env.AUTH0_API_AUDIENCE ||
      process.env.AUTH0_AUDIENCE ||
      process.env.AUDIENCE ||
      `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    issuerBaseURL:
      process.env.AUTH0_ISSUER_BASE_URL || `https://${process.env.AUTH0_DOMAIN}`,
  }),
);

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
app.get("/", (req, res) => {
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
app.get("/health", async (req, res) => {
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
app.get("/user/:auth0Id", async (req, res) => {
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

// Server setup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
