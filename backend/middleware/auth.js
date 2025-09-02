import { verifyAccessToken } from "../lib/auth.js";

/**
 * Middleware to require authentication
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next function
 * @returns {Promise<void>}
 */
export default function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing bearer token" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.sub, username: decoded.username };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
