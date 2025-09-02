export async function listUsersHandler(req, res) {
  try {
    const users = await req.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        totalClicks: true,
        totalCoins: true,
        currentLevel: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
