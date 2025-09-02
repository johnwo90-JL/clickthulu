import {
  generateAccessToken,
  generateRefreshTokenPlain,
  hashRefreshToken,
  getRefreshTokenExpiryDate,
} from "../../lib/auth.js";

export async function refreshTokenHandler(req, res) {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
      return res.status(400).json({
        meta: {
          ok: false,
          status: 400,
          message: "Bad Request",
          timestamp: Date.now(),
        },
        data: { error: "refreshToken is required" },
      });
    }

    const tokenHash = hashRefreshToken(refreshToken);
    const record = await req.prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    if (!record) {
      return res.status(401).json({
        meta: {
          ok: false,
          status: 401,
          message: "Unauthorized",
          timestamp: Date.now(),
        },
        data: { error: "Invalid or expired refresh token" },
      });
    }

    await req.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    const newPlain = generateRefreshTokenPlain();
    const newHash = hashRefreshToken(newPlain);
    const expiresAt = getRefreshTokenExpiryDate();

    await req.prisma.refreshToken.create({
      data: { userId: record.userId, tokenHash: newHash, expiresAt },
    });

    const accessToken = generateAccessToken({
      sub: record.user.id,
      username: record.user.username,
    });

    await req.prisma.refreshToken.deleteMany({
      where: {
        userId: record.userId,
        tokenHash: { not: newHash },
        expiresAt: { lt: new Date() },
      },
    });

    return res.json({
      meta: { ok: true, status: 200, message: "OK", timestamp: Date.now() },
      data: { accessToken, refreshToken: newPlain },
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
