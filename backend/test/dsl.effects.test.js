import { describe, it, expect } from "vitest";
import { applyEffects } from "../lib/dsl/effects.js";

const baseCtx = {
  stats: {
    clickPower: 2,
    xpPerClick: 1,
  },
};

describe("effects DSL", () => {
  it("applies add/mul/set operations for a level", () => {
    const values = {
      levels: [
        [
          {
            path: { source: "stat", field: "clickPower" },
            op: "add",
            value: 1,
          },
          {
            path: { source: "stat", field: "xpPerClick" },
            op: "mul",
            value: 2,
          },
        ],
        [
          {
            path: { source: "stat", field: "clickPower" },
            op: "set",
            value: 10,
          },
        ],
      ],
    };

    const lvl1 = applyEffects(values, baseCtx, 1);
    expect(lvl1.stats.clickPower).toBe(3);
    expect(lvl1.stats.xpPerClick).toBe(2);

    const lvl2 = applyEffects(values, baseCtx, 2);
    expect(lvl2.stats.clickPower).toBe(10);
    expect(lvl2.stats.xpPerClick).toBe(1); // unchanged at level 2
  });
});
