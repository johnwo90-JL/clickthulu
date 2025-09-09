import { z } from "zod";

const createUserSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.email(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
});

export async function createUserHandler(req, res) {
  try {
    try {
      createUserSchema.parse(req.body);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const { username, password, email } = req.body;

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
