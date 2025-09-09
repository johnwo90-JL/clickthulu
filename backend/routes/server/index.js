import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/server/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Checks if the API and database are working
 *     tags: [Server]
 *     responses:
 *       200:
 *         description: API and database are healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 database:
 *                   type: string
 *                   example: "connected"
 *                 timestamp:
 *                   type: number
 *                   format: UNIX-Epoch
 *       500:
 *         description: Server or database error
 */
router.get("/health", async (req, res) => {
  try {
    await req.prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().getTime(),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        database: "disconnected",
        error: error.message,
        timestamp: new Date().getTime(),
      });
  }
});

export default router;
