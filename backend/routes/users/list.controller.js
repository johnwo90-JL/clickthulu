export async function listUsersHandler(req, res) {
  try {
    const users = await req.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        gameStats: {
          select: {
            totalClicks: true,
            totalDevotion: true,
            currentLevel: true,
          },
        },
      },
    });

    const shaped = users.map((u) => {
      const stats =
        Array.isArray(u.gameStats) && u.gameStats.length > 0
          ? u.gameStats[0]
          : null;
      return {
        id: u.id,
        username: u.username,
        email: u.email,
        createdAt: u.createdAt,
        totalClicks: stats?.totalClicks ?? 0,
        totalDevotion: stats?.totalDevotion ?? 0,
        currentLevel: stats?.currentLevel ?? 1,
      };
    });

    res.json(shaped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
