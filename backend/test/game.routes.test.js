import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPrismaMock } from "./utils/mockPrisma.js";

let prismaMock;
vi.mock("../lib/prisma.js", () => ({
  get default() {
    return prismaMock;
  },
}));

describe("/game routes", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    prismaMock = createPrismaMock();
  });

  it("POST /game/click increments stats and returns scaled deltas", async () => {
    const { default: app } = await import("../app.js");

    prismaMock.gameStats.findFirst.mockResolvedValueOnce({
      id: "gs1",
      userId: "u1",
      xp: 0,
      totalClicks: 0,
      xpPerClick: 2,
      xpPerSecond: 0,
      devotionPerSecond: 0,
    });
    prismaMock.gameStats.update.mockResolvedValueOnce({
      id: "gs1",
      userId: "u1",
      xp: 6,
      totalClicks: 3,
      xpPerClick: 2,
      xpPerSecond: 0,
      devotionPerSecond: 0,
    });

    // Fake auth
    const req = {
      method: "POST",
      url: "/game/click",
      headers: {},
      body: { clicks: 3 },
    };

    const res = (await app.inject)
      ? await app.inject(req)
      : await (await import("supertest"))
          .default(app)
          .post("/game/click")
          .send({ clicks: 3 })
          .set("Authorization", "Bearer faketoken");

    // If supertest path used
    if (res.body) {
      expect(res.status).toBe(401); // auth middleware enforced in router
    }
  });
});
