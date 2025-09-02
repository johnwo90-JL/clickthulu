export async function getUserByIdHandler(req, res) {
  try {
    const { id } = req.params;

    const user = await req.prisma.user.findUnique({
      where: { id },
      include: {
        gameStats: { orderBy: { sessionStart: "desc" }, take: 10 },
        achievements: { include: { achievement: true } },
        upgrades: { include: { upgradeBase: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
