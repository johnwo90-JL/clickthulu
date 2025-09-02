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
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of upgrades
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const upgrades = await req.prisma.upgradeBase.findMany({
      where: { isActive: true },
      orderBy: { cost: "asc" },
    });
    res.json(upgrades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
