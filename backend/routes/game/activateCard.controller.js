import { applyEffects } from "../../lib/dsl/effects.js";
import { formatStatValue, perSecondForField } from "../../lib/numberScale.js";

export async function gameActivateCardController(req, res) {
  try {
    const userId = req.user?.id;
    const { cardId } = req.params || {};
    if (!userId || !cardId) {
      return res.status(400).json({ error: "userId and cardId are required" });
    }

    const owned = await req.prisma.card.findFirst({
      where: { userId, cardId },
    });

    if (!owned)
      return res.status(403).json({ error: "User does not own the card" });

    const proto = await req.prisma.cardType.findUnique({
      where: { id: cardId },
      include: { effects: true },
    });
    if (!proto) return res.status(404).json({ error: "CardType not found" });

    const stats = await req.prisma.gameStats.findFirst({ where: { userId } });
    if (!stats)
      return res.status(404).json({ error: "GameStats not found for user" });

    // Derive level server-side. Use owned.count as a proxy for level (>=1)
    const level = Math.max(1, Number(owned?.count || 1));

    let ctx = { stats };
    const applied = [];
    for (const eff of proto.effects || []) {
      if (!eff?.values) continue;
      ctx = applyEffects(eff.values, ctx, level);
      applied.push({ effectId: eff.id, level });
    }

    const updated = await req.prisma.gameStats.update({
      where: { id: stats.id },
      data: ctx.stats,
    });
    const xpOut = formatStatValue({
      value: updated.xp,
      prSecond: perSecondForField(updated, "xp"),
      increment: true,
    });
    const devOut = formatStatValue({
      value: updated.totalDevotion,
      prSecond: perSecondForField(updated, "totalDevotion"),
      increment: true,
    });
    return res.json({
      stats: updated,
      applied,
      values: { xp: xpOut, totalDevotion: devOut },
    });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
