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
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of achievements
 */
router.get("/", async (req, res) => {
  try {
    const definitions = await req.prisma.achievementDefinition.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        target: true,
        rewards: true,
        isActive: true,
      },
    });
    res.json(definitions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
