export async function getCardTypeController(req, res) {
  try {
    const { cardId } = req.params;
    const type = await req.prisma.cardType.findUnique({
      where: { id: cardId },
      include: { effects: true },
    });
    if (!type) return res.status(404).json({ error: "CardType not found" });
    return res.json({ card: type });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
