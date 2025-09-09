export async function getMeHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await req.prisma.user.findUnique({
      where: { id: userId },
      include: {
        gameStats: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}

export async function listMyAchievementsHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

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
    return res.json(definitions);
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
