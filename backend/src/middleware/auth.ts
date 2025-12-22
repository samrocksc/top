import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import logger from "../lib/logger";

// Helper function to decode JWT without verification (for debugging)
function decodeJwt(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    const decoded = Buffer.from(payload, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch (error) {
    logger.error({
      msg: "Failed to decode JWT",
      error: (error as Error).message,
    });
    return null;
  }
}

// Determine the expected audience
const expectedAudience =
  process.env.AUTH0_API_AUDIENCE ||
  process.env.AUTH0_AUDIENCE ||
  process.env.AUDIENCE ||
  `https://${process.env.AUTH0_DOMAIN}/api/v2/`;

const issuerBaseURL =
  process.env.AUTH0_ISSUER_BASE_URL || `https://${process.env.AUTH0_DOMAIN}`;

// Log the authentication configuration at startup
logger.info({
  msg: "Auth middleware configured",
  expectedAudience: expectedAudience,
  issuerBaseURL: issuerBaseURL,
  hasAUTH0_API_AUDIENCE: !!process.env.AUTH0_API_AUDIENCE,
  hasAUTH0_AUDIENCE: !!process.env.AUTH0_AUDIENCE,
  hasAUDIENCE: !!process.env.AUDIENCE,
  hasAUTH0_DOMAIN: !!process.env.AUTH0_DOMAIN,
  hasAUTH0_ISSUER_BASE_URL: !!process.env.AUTH0_ISSUER_BASE_URL,
});

// Create the base authentication middleware
const authenticateJwt = auth({
  audience: expectedAudience,
  issuerBaseURL: issuerBaseURL,
});

// Create a wrapper middleware that ensures consistent 401 responses
const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  // Log the incoming request details
  logger.info({
    msg: "Auth middleware processing request",
    url: req.url,
    method: req.method,
    hasAuthorizationHeader: !!req.headers.authorization,
    authorizationHeader: req.headers.authorization
      ? `${req.headers.authorization.substring(0, 20)}...`
      : undefined,
  });

  // Check if authorization header exists
  const authHeader = req.headers.authorization;

  // If no authorization header, return 401 immediately
  if (!authHeader) {
    logger.warn("No Authorization header found in request");
    res.status(401).json({ error: "Unauthorized - No Authorization header" });
    return;
  }

  // Extract and decode the token for debugging
  const tokenMatch = authHeader.match(/^Bearer (.+)$/);
  if (tokenMatch && tokenMatch[1]) {
    const token = tokenMatch[1];
    const decoded = decodeJwt(token);

    if (decoded) {
      logger.info({
        msg: "JWT token decoded",
        tokenAudience: decoded.aud,
        tokenIssuer: decoded.iss,
        tokenSubject: decoded.sub,
        tokenExpiry: decoded.exp,
        expectedAudience: expectedAudience,
        audienceMatch:
          decoded.aud === expectedAudience ||
          (Array.isArray(decoded.aud) &&
            decoded.aud.includes(expectedAudience)),
      });

      // Check if audiences match
      if (
        decoded.aud !== expectedAudience &&
        !(Array.isArray(decoded.aud) && decoded.aud.includes(expectedAudience))
      ) {
        logger.warn({
          msg: "Audience mismatch detected",
          tokenAudience: decoded.aud,
          expectedAudience: expectedAudience,
          suggestion:
            "Update AUTH0_API_AUDIENCE environment variable to match the token audience",
        });
      }
    }
  }

  // If authorization header exists, proceed with JWT authentication
  authenticateJwt(req, res, (err: any) => {
    if (err) {
      logger.error({
        msg: "Authentication error",
        error: err.message,
        stack: err.stack,
        errorCode: err.code,
        statusCode: err.statusCode,
      });

      // Provide helpful error message
      res.status(401).json({
        error: "Unauthorized - Invalid token",
        details: err.message,
        hint: "Check that AUTH0_API_AUDIENCE matches the audience claim in your JWT token",
      });
      return;
    }

    // Log successful authentication
    logger.info({
      msg: "Authentication successful",
      userId: req.auth?.payload?.sub,
      tokenExpiry: req.auth?.payload?.exp,
    });

    // Authentication successful, continue
    next();
  });
};

export { requireAuth };
