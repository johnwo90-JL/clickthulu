export async function listUserAchievementsHandler(req, res) {
  try {
    const { id } = req.params;
    const achievements = await req.prisma.achievement.findMany({
      where: { userId: id },
      include: { achievement: true },
      orderBy: { unlockedAt: "desc" },
    });
    return res.json(achievements);
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
