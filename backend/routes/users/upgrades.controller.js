export async function listUserUpgradesHandler(req, res) {
  try {
    const { id } = req.params;

    const [worshippers, cards] = await Promise.all([
      req.prisma.worshipper.findMany({
        where: { userId: id },
        include: { worshipper: { include: { upgrade: true } } },
      }),
      req.prisma.card.findMany({
        where: { userId: id },
        include: { card: { include: { upgrade: true } } },
      }),
    ]);

    const byId = new Map();

    for (const w of worshippers) {
      const up = w?.worshipper?.upgrade;
      if (!up) continue;
      const existing = byId.get(up.id) || {
        id: up.id,
        name: up.name,
        shortName: up.shortName,
        description: up.description,
        imgUrl: up.imgUrl,
        level: up.level,
        maxLevel: up.maxLevel,
        isActive: up.isActive,
        sources: [],
      };
      existing.sources.push({
        type: "worshipper",
        worshipperId: w.worshipperId,
        count: w.count,
        level: w.level,
      });
      byId.set(up.id, existing);
    }

    for (const c of cards) {
      const up = c?.card?.upgrade;
      if (!up) continue;
      const existing = byId.get(up.id) || {
        id: up.id,
        name: up.name,
        shortName: up.shortName,
        description: up.description,
        imgUrl: up.imgUrl,
        level: up.level,
        maxLevel: up.maxLevel,
        isActive: up.isActive,
        sources: [],
      };
      existing.sources.push({
        type: "card",
        cardId: c.cardId,
        count: c.count,
        level: c.level,
      });
      byId.set(up.id, existing);
    }

    const upgrades = Array.from(byId.values());
    res.json(upgrades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
