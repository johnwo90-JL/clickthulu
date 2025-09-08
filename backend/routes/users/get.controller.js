export async function getUserByIdHandler(req, res) {
  try {
    const { id } = req.params;

    const user = await req.prisma.user.findUnique({
      where: { id },
      include: {
        gameStats: {
          orderBy: { updatedAt: "desc" },
          take: 10,
        },
        achievements: {
          include: { achievement: true },
        },
        userWorshippers: {
          include: { worshipper: true },
        },
        userCards: {
          include: { card: true },
        },
        refreshTokens: true,
        activationLogs: true,
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
