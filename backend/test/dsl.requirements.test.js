import { describe, it, expect } from "vitest";
import { evaluateRequirement } from "../lib/dsl/requirements.js";

const baseCtx = {
  stats: {
    clickPower: 3,
    totalClicks: 120,
    devotionPerSecond: 1,
    totalDevotion: 250,
    currentLevel: 2,
    xp: 120,
    nextLevelXp: 200,
    xpPerSecond: 0,
    xpPerClick: 1,
    prestige: 0,
    prestigeLevel: 1,
  },
  session: { timeActiveSession: 600, timeActiveTotal: 7200 },
  upgrades: [{ key: "wsp_acolyte", level: 2 }],
  worshippers: [{ typeKey: "wsp_acolyte" }, { typeKey: "wsp_acolyte" }],
  cards: [
    { cardKey: "crd_azathoth" },
    { cardKey: "crd_azathoth" },
    { cardKey: "crd_cthulhu" },
  ],
};

describe("requirements DSL", () => {
  it("evaluates simple stat comparison", () => {
    const req = {
      expr: {
        left: { source: "stat", field: "clickPower" },
        op: "gte",
        right: 3,
      },
    };
    expect(evaluateRequirement(req, baseCtx)).toBe(true);
  });

  it("evaluates session requirement", () => {
    const req = {
      expr: {
        left: { source: "session", field: "timeActiveTotal" },
        op: "gt",
        right: 3600,
      },
    };
    expect(evaluateRequirement(req, baseCtx)).toBe(true);
  });

  it("evaluates upgrade unlocked/level", () => {
    const unlocked = {
      expr: {
        left: { source: "upgrade", key: "wsp_acolyte", field: "unlocked" },
        op: "eq",
        right: true,
      },
    };
    const level = {
      expr: {
        left: { source: "upgrade", key: "wsp_acolyte", field: "level" },
        op: "gte",
        right: 2,
      },
    };
    expect(evaluateRequirement(unlocked, baseCtx)).toBe(true);
    expect(evaluateRequirement(level, baseCtx)).toBe(true);
  });

  it("evaluates worshipper/card counts with filters", () => {
    const worshippers = {
      expr: {
        left: {
          source: "worshippers",
          aggregate: "count",
          filter: { typeKey: "wsp_acolyte" },
        },
        op: "gte",
        right: 2,
      },
    };
    const cards = {
      expr: {
        left: {
          source: "cards",
          aggregate: "count",
          filter: { cardKey: "crd_azathoth" },
        },
        op: "eq",
        right: 2,
      },
    };
    expect(evaluateRequirement(worshippers, baseCtx)).toBe(true);
    expect(evaluateRequirement(cards, baseCtx)).toBe(true);
  });

  it("supports logical all/any/not nesting", () => {
    const req = {
      all: [
        {
          expr: {
            left: { source: "stat", field: "clickPower" },
            op: "gte",
            right: 3,
          },
        },
        {
          any: [
            {
              expr: {
                left: { source: "upgrade", key: "wsp_acolyte", field: "level" },
                op: "gte",
                right: 3,
              },
            },
            {
              expr: {
                left: {
                  source: "cards",
                  aggregate: "count",
                  filter: { cardKey: "crd_azathoth" },
                },
                op: "gte",
                right: 2,
              },
            },
          ],
        },
        {
          not: {
            expr: {
              left: { source: "stat", field: "prestige" },
              op: "gt",
              right: 0,
            },
          },
        },
      ],
    };
    expect(evaluateRequirement(req, baseCtx)).toBe(true);
  });
});
