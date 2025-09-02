import { formatStatValue, perSecondForField } from "../../lib/numberScale.js";

export async function gameClickController(req, res) {
  try {
    const userId = req.user?.id;
    const { clicks = 1 } = req.body || {};
    if (!userId || typeof clicks !== "number" || clicks <= 0) {
      return res
        .status(400)
        .json({ error: "userId and positive clicks are required" });
    }

    const stats = await req.prisma.gameStats.findFirst({ where: { userId } });
    if (!stats)
      return res.status(404).json({ error: "GameStats not found for user" });

    const xpEarned = (stats.xpPerClick || 0) * clicks;
    const updated = await req.prisma.gameStats.update({
      where: { id: stats.id },
      data: {
        totalClicks: { increment: clicks },
        xp: { increment: xpEarned },
        lastClickAt: new Date(),
      },
    });

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
    });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
