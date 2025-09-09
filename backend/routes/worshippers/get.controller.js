export async function getWorshipperTypeController(req, res) {
  try {
    const { id } = req.params;
    let type = await req.prisma.worshipperType.findUnique({
      where: { id },
      include: { effects: true },
    });
    if (!type) {
      type = await req.prisma.worshipperType.findUnique({
        where: { typeId: id },
        include: { effects: true },
      });
    }
    if (!type)
      return res.status(404).json({ error: "WorshipperType not found" });
    return res.json({ worshipper: type });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
