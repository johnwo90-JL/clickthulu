export async function listUserUpgradesHandler(req, res) {
  try {
    const { id } = req.params;
    const upgrades = await req.prisma.upgrade.findMany({
      where: { userId: id },
    });
    res.json(upgrades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
