export async function listUserWorshippersController(req, res) {
  try {
    const userId = req.user?.id;
    const items = await req.prisma.worshipper.findMany({ where: { userId } });
    return res.json({ worshippers: items });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
}
