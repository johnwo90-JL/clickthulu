export async function evaluateAndAwardAchievements(prisma, userId) {
  if (!prisma || !userId) return { awarded: [], xpRewarded: 0 };

  const stats = await prisma.gameStats.findFirst({ where: { userId } });
  if (!stats) return { awarded: [], xpRewarded: 0 };

  const [definitions, unlocked, worshippers] = await Promise.all([
    prisma.achievementDefinition.findMany({ where: { isActive: true } }),
    prisma.achievement.findMany({
      where: { userId },
      select: { achievementId: true },
    }),
    prisma.worshipper.findMany({ where: { userId }, select: { count: true } }),
  ]);

  const unlockedSet = new Set(unlocked.map((a) => a.achievementId));
  const worshippersCount = worshippers.reduce(
    (sum, w) => sum + (w.count || 0),
    0
  );

  // Helper: does a definition's target match the user's current state?
  function meetsTarget(target = {}) {
    for (const [key, value] of Object.entries(target || {})) {
      const required = Number(value || 0);
      if (required <= 0) continue;

      switch (key) {
        case "clicks":
          if (Number(stats.totalClicks || 0) < required) return false;
          break;
        case "devotion":
          if (Number(stats.totalDevotion || 0) < required) return false;
          break;
        case "worshippers":
          if (Number(worshippersCount) < required) return false;
          break;
        case "prestigeLevel":
          if (Number(stats.prestigeLevel || 0) < required) return false;
          break;
        default:
          // Unknown keys are considered not satisfied
          return false;
      }
    }
    return true;
  }

  const toAward = [];
  let xpRewarded = 0;

  for (const def of definitions) {
    if (unlockedSet.has(def.id)) continue;
    if (!meetsTarget(def.target)) continue;
    toAward.push(def);
    const xp = Number(def?.rewards?.xp || 0);
    xpRewarded += xp > 0 ? xp : 0;
  }

  if (toAward.length === 0) return { awarded: [], xpRewarded: 0 };

  // Create achievement rows
  await prisma.$transaction([
    ...toAward.map((def) =>
      prisma.achievement.create({
        data: { userId, achievementId: def.id },
      })
    ),
    ...(xpRewarded > 0
      ? [
          prisma.gameStats.update({
            where: { id: stats.id },
            data: { xp: { increment: xpRewarded } },
          }),
        ]
      : []),
  ]);

  return { awarded: toAward.map((d) => d.id), xpRewarded };
}
