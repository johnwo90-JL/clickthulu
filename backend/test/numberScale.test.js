import { describe, it, expect } from "vitest";
import {
  formatNumberForScale,
  formatStatValue,
  NUMBER_SCALES,
  perSecondForField,
} from "../lib/numberScale.js";

describe("numberScale helper", () => {
  it("formats small numbers with <k", () => {
    const r = formatNumberForScale(999);
    expect(r.scale).toBe("<k");
    expect(r.value).toBe(999);
  });

  it("formats thousands with k", () => {
    const r = formatNumberForScale(10_000);
    expect(NUMBER_SCALES.includes(r.scale)).toBe(true);
  });

  it("formatStatValue returns shape", () => {
    const r = formatStatValue({ value: 123, prSecond: 2, increment: true });
    expect(r).toHaveProperty("value");
    expect(r).toHaveProperty("scale");
    expect(r.prSecond).toBe(2);
    expect(r.increment).toBe(true);
  });

  it("perSecondForField maps xp and totalDevotion", () => {
    const s = { xpPerSecond: 3, devotionPerSecond: 4 };
    expect(perSecondForField(s, "xp")).toBe(3);
    expect(perSecondForField(s, "totalDevotion")).toBe(4);
  });
});
