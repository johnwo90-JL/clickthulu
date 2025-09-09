import {
  verifyPassword,
  generateAccessToken,
  generateRefreshTokenPlain,
  hashRefreshToken,
  getRefreshTokenExpiryDate,
} from "../../lib/auth.js";

export async function loginHandler(req, res) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({
        meta: {
          ok: false,
          status: 400,
          message: "Bad Request",
          timestamp: Date.now(),
        },
        data: { error: "username and password are required" },
      });
    }

    const user = await req.prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({
        meta: {
          ok: false,
          status: 401,
          message: "Unauthorized",
          timestamp: Date.now(),
        },
        data: { error: "Invalid credentials" },
      });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({
        meta: {
          ok: false,
          status: 401,
          message: "Unauthorized",
          timestamp: Date.now(),
        },
        data: { error: "Invalid credentials" },
      });
    }

    const accessToken = generateAccessToken({
      sub: user.id,
      username: user.username,
    });
    const refreshTokenPlain = generateRefreshTokenPlain();
    const tokenHash = hashRefreshToken(refreshTokenPlain);
    const expiresAt = getRefreshTokenExpiryDate();

    await req.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return res.json({
      meta: { ok: true, status: 200, message: "OK", timestamp: Date.now() },
      data: {
        accessToken,
        refreshToken: refreshTokenPlain,
        user: { id: user.id, username: user.username, email: user.email },
      },
    });
  } catch (err) {
    return res.status(500).json({
      meta: {
        ok: false,
        status: 500,
        message: "Server Error",
        timestamp: Date.now(),
      },
      data: { error: err.message },
    });
  }
}
