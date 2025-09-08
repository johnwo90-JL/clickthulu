import request from "supertest";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPrismaMock } from "./utils/mockPrisma.js";

let prismaMock;
vi.mock("../lib/prisma.js", () => ({
  get default() {
    return prismaMock;
  },
  disconnectPrisma: vi.fn(),
}));

describe("POST /users", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    prismaMock = createPrismaMock();
  });

  it("creates a user and returns 201", async () => {
    const fakeUser = { id: "u1", username: "alice", email: "a@example.com" };
    prismaMock.user.create.mockResolvedValueOnce(fakeUser);

    // mock hashing to deterministic string
    vi.mock("../lib/auth.js", async (orig) => {
      const m = await orig();
      return { ...m, hashPassword: vi.fn(async () => "hash:pw") };
    });

    const { default: app } = await import("../app.js");

    const res = await request(app)
      .post("/users")
      .send({ username: "alice", email: "a@example.com", password: "pw" });

    expect(res.status).toBe(201);
    expect(res.body.username).toBe("alice");
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        username: "alice",
        email: "a@example.com",
        passwordHash: "hash:pw",
      },
    });
  });

  it("returns 400 when fields missing", async () => {
    const { default: app } = await import("../app.js");

    const res = await request(app).post("/users").send({ username: "x" });
    expect(res.status).toBe(400);
  });

  it("returns 409 on unique constraint error", async () => {
    prismaMock.user.create.mockRejectedValueOnce({ code: "P2002" });
    const { default: app } = await import("../app.js");
    const res = await request(app)
      .post("/users")
      .send({ username: "alice", email: "a@example.com", password: "pw" });
    expect(res.status).toBe(409);
  });
});
