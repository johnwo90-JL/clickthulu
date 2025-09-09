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

let authFns;
vi.mock("../lib/auth.js", () => ({
  get verifyPassword() {
    return authFns.verifyPassword;
  },
  get generateAccessToken() {
    return authFns.generateAccessToken;
  },
  get generateRefreshTokenPlain() {
    return authFns.generateRefreshTokenPlain;
  },
  get hashRefreshToken() {
    return authFns.hashRefreshToken;
  },
  get getRefreshTokenExpiryDate() {
    return authFns.getRefreshTokenExpiryDate;
  },
}));

describe("Auth flows", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    prismaMock = createPrismaMock();
    authFns = {
      verifyPassword: vi.fn(),
      generateAccessToken: vi.fn(),
      generateRefreshTokenPlain: vi.fn(),
      hashRefreshToken: vi.fn(),
      getRefreshTokenExpiryDate: vi.fn(),
    };
  });

  it("login success returns tokens", async () => {
    const user = {
      id: "u1",
      username: "alice",
      email: "a@example.com",
      passwordHash: "hash",
    };
    prismaMock.user.findUnique.mockResolvedValueOnce(user);
    prismaMock.refreshToken.create.mockResolvedValueOnce({ id: "rt1" });

    authFns.verifyPassword.mockResolvedValue(true);
    authFns.generateAccessToken.mockReturnValue("access-token");
    authFns.generateRefreshTokenPlain.mockReturnValue("plain-refresh");
    authFns.hashRefreshToken.mockReturnValue("hash-refresh");
    authFns.getRefreshTokenExpiryDate.mockReturnValue(
      new Date(Date.now() + 1000)
    );

    const { default: app } = await import("../app.js");
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "alice", password: "pw" });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(res.body.data.refreshToken).toBe("plain-refresh");
  });

  it("refreshToken rotates token and returns new access", async () => {
    prismaMock.refreshToken.findFirst.mockResolvedValueOnce({
      id: "rt1",
      userId: "u1",
      user: { id: "u1", username: "alice" },
    });
    prismaMock.refreshToken.update.mockResolvedValueOnce({});
    prismaMock.refreshToken.create.mockResolvedValueOnce({ id: "rt2" });
    prismaMock.refreshToken.deleteMany.mockResolvedValueOnce({ count: 0 });

    authFns.hashRefreshToken.mockReturnValue("hash-refresh");
    authFns.generateRefreshTokenPlain.mockReturnValue("new-plain");
    authFns.getRefreshTokenExpiryDate.mockReturnValue(
      new Date(Date.now() + 1000)
    );
    authFns.generateAccessToken.mockReturnValue("access");

    const { default: app } = await import("../app.js");
    const res = await request(app)
      .post("/auth/refreshToken")
      .send({ refreshToken: "plain" });
    expect(res.status).toBe(200);
    expect(res.body.data.refreshToken).toBe("new-plain");
  });

  it("logout revokes refresh token", async () => {
    prismaMock.refreshToken.updateMany.mockResolvedValueOnce({ count: 1 });
    authFns.hashRefreshToken.mockReturnValue("hash-refresh");

    const { default: app } = await import("../app.js");
    const res = await request(app)
      .post("/auth/logout")
      .send({ refreshToken: "plain" });
    expect(res.status).toBe(200);
    expect(res.body.data.ok).toBe(true);
  });
});
