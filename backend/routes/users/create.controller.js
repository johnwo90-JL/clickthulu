export async function createUserHandler(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    const { hashPassword } = await import("../../lib/auth.js");
    const passwordHash = await hashPassword(password);

    const user = await req.prisma.user.create({
      data: { username, email, passwordHash },
    });

    res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }
    res.status(500).json({ error: error.message });
  }
}
