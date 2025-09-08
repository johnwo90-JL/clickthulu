import { z } from "zod";
import { comparatorSchema, versionSchema, compareValues } from "./common.js";

// Targets are simpler than requirements: evaluate a single numeric stat against a threshold.
// Still support logical composition for flexibility.

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

const leafSchema = z.object({
  field: statFieldSchema,
  op: comparatorSchema,
  value: z.union([z.number(), z.object({ min: z.number(), max: z.number() })]),
});

export const targetSchema = z.union([
  z.object({
    all: z.array(z.lazy(() => targetSchema)),
    version: versionSchema.optional(),
  }),
  z.object({
    any: z.array(z.lazy(() => targetSchema)),
    version: versionSchema.optional(),
  }),
  z.object({ leaf: leafSchema, version: versionSchema.optional() }),
]);

export function validateTarget(input) {
  return targetSchema.safeParse(input);
}

export function evaluateTarget(input, ctx) {
  const parsed = targetSchema.parse(input);
  return evalNode(parsed, ctx);
}

function evalNode(node, ctx) {
  if ("all" in node) return node.all.every((n) => evalNode(n, ctx));
  if ("any" in node) return node.any.some((n) => evalNode(n, ctx));
  if ("leaf" in node) {
    const v = ctx?.stats?.[node.leaf.field] ?? 0;
    return compareValues(v, node.leaf.op, node.leaf.value);
  }
  return false;
}
