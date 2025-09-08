import { describe, it, expect } from "vitest";
import { evaluateTarget } from "../lib/dsl/targets.js";

const ctx = {
  stats: {
    totalClicks: 1000,
    xp: 500,
  },
};

describe("targets DSL", () => {
  it("evaluates a single leaf", () => {
    const t = { leaf: { field: "totalClicks", op: "gte", value: 1000 } };
    expect(evaluateTarget(t, ctx)).toBe(true);
  });

  it("supports all/any composition", () => {
    const t = {
      all: [
        { leaf: { field: "totalClicks", op: "gte", value: 1000 } },
        {
          any: [
            { leaf: { field: "xp", op: "gt", value: 400 } },
            {
              leaf: {
                field: "xp",
                op: "between",
                value: { min: 300, max: 450 },
              },
            },
          ],
        },
      ],
    };
    expect(evaluateTarget(t, ctx)).toBe(true);
  });
});
