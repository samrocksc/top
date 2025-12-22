import { auth } from "express-oauth2-jwt-bearer";

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
  // Check if authorization header exists
  const authHeader = req.headers.authorization;
  
  // If no authorization header, return 401 immediately
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  // If authorization header exists, proceed with JWT authentication
  authenticateJwt(req, res, (err) => {
    if (err) {
      // Convert any authentication errors to 401
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Authentication successful, continue
    next();
  });
};

export { requireAuth };