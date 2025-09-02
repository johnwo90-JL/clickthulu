export async function clickHandler(req, res) {
  try {
    const { id } = req.params;
    const { clicks = 1 } = req.body;

    const user = await req.prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const devotionEarned = clicks * user.clicksPerSecond;

    const updatedUser = await req.prisma.user.update({
      where: { id },
      data: {
        totalClicks: { increment: clicks },
        totalDevotion: { increment: devotionEarned },
      },
    });

    const achievements = await req.prisma.achievement.findMany({
      where: {
        OR: [
          { type: "clicks", target: { lte: updatedUser.totalClicks } },
          { type: "coins", target: { lte: updatedUser.totalCoins } },
        ],
      },
    });

    const newAchievements = [];
    for (const achievement of achievements) {
      try {
        await req.prisma.userAchievement.create({
          data: { userId: id, achievementId: achievement.id },
        });
        newAchievements.push(achievement);
      } catch {}
    }

    res.json({
      user: updatedUser,
      coinsEarned: devotionEarned,
      newAchievements,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
