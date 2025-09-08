import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import router from "../routes/game/index.js";
import { createPrismaMock } from "./utils/mockPrisma.js";

let prismaMock;

describe("/game unit (router mounted with mocked auth)", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    prismaMock = createPrismaMock();
  });

  function makeApp() {
    const app = express();
    app.use(express.json());
    // inject prisma and fake auth
    app.use((req, _res, next) => {
      req.prisma = prismaMock;
      req.user = { id: "u1", username: "alice" };
      next();
    });
    app.use("/game", router);
    return app;
  }

  it("click returns scaled deltas and updates stats", async () => {
    const app = makeApp();

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

    const request = (await import("supertest")).default;
    const res = await request(app).post("/game/click").send({ clicks: 3 });
    expect(res.status).toBe(200);
    expect(res.body.delta.xp).toMatchObject({ increment: true });
    expect(res.body.delta.totalClicks).toMatchObject({ increment: true });
  });

  it("calculate returns perSecond and delta in scaled shape", async () => {
    const app = makeApp();
    const now = new Date();

    prismaMock.gameStats.findFirst.mockResolvedValueOnce({
      id: "gs1",
      userId: "u1",
      xp: 100,
      totalDevotion: 10,
      xpPerSecond: 2,
      devotionPerSecond: 1,
      lastCalculatedAt: new Date(now.getTime() - 2_000).toISOString(),
    });
    prismaMock.gameStats.update.mockResolvedValueOnce({
      id: "gs1",
      userId: "u1",
      xp: 104,
      totalDevotion: 12,
      xpPerSecond: 2,
      devotionPerSecond: 1,
      lastCalculatedAt: now.toISOString(),
    });

    const request = (await import("supertest")).default;
    const res = await request(app).get("/game/calculate").send();
    expect(res.status).toBe(200);
    expect(res.body.delta.xp).toMatchObject({ increment: true });
    expect(res.body.perSecond.xp).toBeDefined();
  });
});
