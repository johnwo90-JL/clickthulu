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

describe("GET /server/health", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    prismaMock = createPrismaMock();
  });

  it("returns 200 and healthy when DB query succeeds", async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce(undefined);
    const { default: app } = await import("../app.js");
    const res = await request(app).get("/server/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("healthy");
    expect(prismaMock.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when DB query fails", async () => {
    prismaMock.$queryRaw.mockRejectedValueOnce(new Error("db down"));
    const { default: app } = await import("../app.js");
    const res = await request(app).get("/server/health");
    expect(res.status).toBe(500);
    expect(res.body.status).toBe("error");
  });
});
