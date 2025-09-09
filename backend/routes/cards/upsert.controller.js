export async function upsertUserCardController(req, res) {
  try {
    const userId = req.user?.id;
    const { cardId } = req.params || {};
    const amount = Number(req.body?.amount ?? 1);
    if (!userId || !cardId || !Number.isFinite(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ error: "userId, cardId and positive amount are required" });
    }

    const existing = await req.prisma.card.findFirst({
      where: { userId, cardId },
    });
    if (existing) {
      const updated = await req.prisma.card.update({
        where: { id: existing.id },
        data: { count: { increment: amount } },
      });
      return res.json({ card: updated, created: false });
    }

    const created = await req.prisma.card.create({
      data: { userId, cardId, count: amount },
    });
    return res.status(201).json({ card: created, created: true });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
