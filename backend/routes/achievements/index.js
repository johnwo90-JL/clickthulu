import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/achievements:
 *   get:
 *     summary: Get all achievements
 *     description: Retrieve all available achievements in the game
 *     tags: [Achievements]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of achievements
 */
router.get("/", async (req, res) => {
  try {
    const achievements = await req.prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { target: 'asc' },
    });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


