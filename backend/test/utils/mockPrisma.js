import { vi } from "vitest";

export function createPrismaMock(overrides = {}) {
  return {
    $queryRaw: vi.fn(),
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    gameStats: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    card: {
      findFirst: vi.fn(),
    },
    cardPrototype: {
      findUnique: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      findFirst: vi.fn(),
      deleteMany: vi.fn(),
    },
    achievement: {
      findMany: vi.fn(),
    },
    userAchievement: {
      create: vi.fn(),
    },
    ...overrides,
  };
}
