import { hashRefreshToken } from "../../lib/auth.js";

export async function logoutHandler(req, res) {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
      return res
        .status(400)
        .json({
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
    await req.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return res.json({
      meta: {
        ok: true,
        status: 200,
        message: "OK",
        timestamp: Date.now(),
      },
      data: { ok: true },
    });
  } catch (err) {
    return res
      .status(500)
      .json({
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
