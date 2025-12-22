import { auth } from "express-oauth2-jwt-bearer";
import logger from "../lib/logger";

// Create the base authentication middleware
const authenticateJwt = auth({
  audience:
    process.env.AUTH0_API_AUDIENCE ||
    process.env.AUTH0_AUDIENCE ||
    process.env.AUDIENCE ||
    `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
  issuerBaseURL:
    process.env.AUTH0_ISSUER_BASE_URL || `https://${process.env.AUTH0_DOMAIN}`,
});

// Create a wrapper middleware that ensures consistent 401 responses
const requireAuth = (req: any, res: any, next: any) => {
  // Log the incoming request details
  logger.info({
    msg: 'Auth middleware processing request',
    url: req.url,
    method: req.method,
    hasAuthorizationHeader: !!req.headers.authorization,
    authorizationHeader: req.headers.authorization ? `${req.headers.authorization.substring(0, 20)}...` : undefined
  });
  
  // Check if authorization header exists
  const authHeader = req.headers.authorization;
  
  // If no authorization header, return 401 immediately
  if (!authHeader) {
    logger.warn('No Authorization header found in request');
    return res.status(401).json({ error: "Unauthorized - No Authorization header" });
  }
  
  // Log the token format
  logger.debug('Authorization header format: ' + authHeader.substring(0, 20) + '...');
  
  // If authorization header exists, proceed with JWT authentication
  authenticateJwt(req, res, (err) => {
    if (err) {
      logger.error({
        msg: 'Authentication error',
        error: err.message,
        stack: err.stack
      });
      // Convert any authentication errors to 401
      return res.status(401).json({ 
        error: "Unauthorized - Invalid token",
        details: err.message 
      });
    }
    
    // Log successful authentication
    logger.info({
      msg: 'Authentication successful',
      userId: req.auth?.payload?.sub,
      tokenExpiry: req.auth?.payload?.exp
    });
    
    // Authentication successful, continue
    next();
  });
};

export { requireAuth };

