export async function listUserCardsController(req, res) {
  try {
    const userId = req.user?.id;
    const cards = await req.prisma.card.findMany({ where: { userId } });
    return res.json({ cards });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
