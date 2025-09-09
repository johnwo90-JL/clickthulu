import { z } from "zod";
import { versionSchema } from "./common.js";

// Effect operations apply to a value source and produce a transformed output.
// We currently support mutating GameStats-like numeric fields.

const statFieldSchema = z.enum([
  "clickPower",
  "totalClicks",
  "devotionPerSecond",
  "totalDevotion",
  "currentLevel",
  "xp",
  "nextLevelXp",
  "xpPerSecond",
  "xpPerClick",
  "prestige",
  "prestigeLevel",
]);

const pathSchema = z.object({
  source: z.literal("stat"),
  field: statFieldSchema,
});

const opSchema = z.enum(["add", "mul", "set"]);

const effectOpSchema = z.object({
  path: pathSchema,
  op: opSchema,
  value: z.number(),
});

// Values can be level-indexed arrays. Each level contains a list of operations.
export const effectsSchema = z.object({
  levels: z.array(z.array(effectOpSchema)),
  version: versionSchema.optional(),
});

export function validateEffects(input) {
  return effectsSchema.safeParse(input);
}

// Evaluate effects for a given level against a base context { stats }
export function applyEffects(input, ctx, level) {
  const parsed = effectsSchema.parse(input);
  const lvlIndex = Math.max(
    0,
    Math.min(parsed.levels.length - 1, (level || 1) - 1)
  );
  const ops = parsed.levels[lvlIndex] || [];

  const out = { ...(ctx?.stats || {}) };

  for (const eff of ops) {
    const field = eff.path.field;
    const base = Number(out[field] ?? 0);
    switch (eff.op) {
      case "add":
        out[field] = base + eff.value;
        break;
      case "mul":
        out[field] = base * eff.value;
        break;
      case "set":
        out[field] = eff.value;
        break;
      default:
        break;
    }
  }

  return { ...ctx, stats: out };
}
