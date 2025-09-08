import { verifyAccessToken } from "../lib/auth.js";

/**
 * Middleware to require authentication
 * @param {express.Request} req - The request object
 * @param {express.Response} res - The response object
 * @param {express.NextFunction} next - The next function
 * @returns {Promise<void>}
 */
export default async function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    console.log("Missing bearer token");
    console.log(`req.headers: ${JSON.stringify(req.headers)}`);
    console.log(`req.body: ${JSON.stringify(req.body)}`);
    console.log(`req.query: ${JSON.stringify(req.query)}`);
    console.log(`req.params: ${JSON.stringify(req.params)}`);
    console.log(`req.path: ${JSON.stringify(req.path)}`);
    console.log(`req.method: ${JSON.stringify(req.method)}`);
    console.log(`req.originalUrl: ${JSON.stringify(req.originalUrl)}`);
    console.log(`req.protocol: ${JSON.stringify(req.protocol)}`);
    console.log(`req.hostname: ${JSON.stringify(req.hostname)}`);
    return res.status(401).json({ error: "Missing bearer token" });
  }

  try {
    const decoded = verifyAccessToken(token);

    // Ensure the user still exists (handles deleted/disabled accounts)
    const user = await req.prisma.user.findUnique({
      where: { id: decoded.sub },
    });
    if (!user) {
      throw new Error("User not found", { status: 404 });
    }

    req.user = { id: user.id, username: user.username, email: user.email };
    return next();
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
