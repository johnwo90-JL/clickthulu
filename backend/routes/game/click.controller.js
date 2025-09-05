import { formatStatValue, perSecondForField } from "../../lib/numberScale.js";
import { evaluateAndAwardAchievements } from "../../lib/achievements.js";

export async function gameClickController(req, res) {
  try {
    const userId = req.user?.id;
    const { clicks = 1 } = req.body || {};
    if (!userId || typeof clicks !== "number" || clicks <= 0) {
      return res
        .status(400)
        .json({ error: "userId and positive clicks are required" });
    }

    let stats = await req.prisma.gameStats.findUnique({ where: { userId } });
    if (!stats) {
      stats = await req.prisma.gameStats.create({
        data: { userId, lastClickAt: new Date() },
      });
    }

    const xpEarned = (stats.xpPerClick || 0) * clicks;
    const updated = await req.prisma.gameStats.update({
      where: { id: stats.id },
      data: {
        totalClicks: { increment: clicks },
        xp: { increment: xpEarned },
        lastClickAt: new Date(),
      },
    });

    const award = await evaluateAndAwardAchievements(req.prisma, userId);

    const xpOut = formatStatValue({
      value: updated.xp,
      prSecond: perSecondForField(updated, "xp"),
      increment: true,
    });
    const clicksOut = formatStatValue({
      value: updated.totalClicks,
      prSecond: 0,
      increment: true,
    });
    return res.json({
      stats: updated,
      delta: { xp: xpOut, totalClicks: clicksOut },
      achievements: award.awarded,
      xpRewarded: award.xpRewarded,
    });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
