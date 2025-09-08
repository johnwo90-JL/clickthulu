import express from "express";
import requireAuth from "../../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/upgrades:
 *   get:
 *     summary: Get all upgrades
 *     description: Retrieve all available upgrades in the game
 *     tags: [Upgrades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of upgrades
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const upgrades = await req.prisma.upgrade.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        shortName: true,
        description: true,
        imgUrl: true,
        level: true,
        maxLevel: true,
        isActive: true,
      },
    });
    res.json(upgrades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
