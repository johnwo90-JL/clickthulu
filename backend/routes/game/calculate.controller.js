import { formatStatValue, perSecondForField } from "../../lib/numberScale.js";

export async function gameCalculateController(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const now = new Date();
    const stats = await req.prisma.gameStats.findFirst({ where: { userId } });
    if (!stats) {
      return res.status(404).json({ error: "GameStats not found for user" });
    }

    const last = stats.lastCalculatedAt
      ? new Date(stats.lastCalculatedAt)
      : now;

    const seconds = Math.max(
      0,
      Math.floor((now.getTime() - last.getTime()) / 1000)
    );

    if (seconds === 0) {
      const xpOut = formatStatValue({
        value: stats.xp,
        prSecond: perSecondForField(stats, "xp"),
        increment: false,
      });

      const devOut = formatStatValue({
        value: stats.totalDevotion,
        prSecond: perSecondForField(stats, "totalDevotion"),
        increment: false,
      });

      const clicksOut = formatStatValue({
        value: stats.totalClicks || 0,
        prSecond: perSecondForField(stats, "totalClicks"),
        increment: false,
      });

      return res.json({
        stats,
        seconds,
        perSecond: {
          xp: xpOut.prSecond,
          totalDevotion: devOut.prSecond,
          totalClicks: clicksOut.prSecond,
        },
        delta: { xp: xpOut, totalDevotion: devOut, totalClicks: clicksOut },
      });
    }

    const xpGain = (stats.xpPerSecond || 0) * seconds;
    const devotionGain = (stats.devotionPerSecond || 0) * seconds;

    const updated = await req.prisma.gameStats.update({
      where: { id: stats.id },
      data: {
        xp: { increment: xpGain },
        totalDevotion: { increment: devotionGain },
        lastCalculatedAt: now,
      },
    });

    const xpOut = formatStatValue({
      value: updated.xp,
      prSecond: perSecondForField(updated, "xp"),
      increment: true,
    });

    const devOut = formatStatValue({
      value: updated.totalDevotion,
      prSecond: perSecondForField(updated, "totalDevotion"),
      increment: true,
    });

    const clicksOut = formatStatValue({
      value: updated.totalClicks || stats.totalClicks || 0,
      prSecond: perSecondForField(updated, "totalClicks"),
      increment: false,
    });

    return res.json({
      stats: updated,
      seconds,
      perSecond: {
        xp: xpOut.prSecond,
        totalDevotion: devOut.prSecond,
        totalClicks: clicksOut.prSecond,
      },
      delta: { xp: xpOut, totalDevotion: devOut, totalClicks: clicksOut },
    });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
