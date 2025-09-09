import { z } from "zod";
import {
  comparatorSchema,
  versionSchema,
  compareValues,
  isLogical,
  ensureArray,
} from "./common.js";

// Value sources supported by the requirements DSL
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

const sessionFieldSchema = z.enum(["timeActiveSession", "timeActiveTotal"]);

const leftSourceSchema = z.union([
  z.object({ source: z.literal("stat"), field: statFieldSchema }),
  z.object({ source: z.literal("session"), field: sessionFieldSchema }),
  z.object({
    source: z.literal("upgrade"),
    key: z.string(),
    field: z.enum(["unlocked", "level"]),
  }),
  z.object({
    source: z.literal("worshippers"),
    aggregate: z.literal("count"),
    filter: z
      .object({ typeKey: z.string().optional(), typeId: z.string().optional() })
      .optional(),
  }),
  z.object({
    source: z.literal("cards"),
    aggregate: z.literal("count"),
    filter: z
      .object({ cardKey: z.string().optional(), cardId: z.string().optional() })
      .optional(),
  }),
]);

const betweenSchema = z.object({ min: z.number(), max: z.number() });

const exprSchema = z.union([
  z.object({
    left: leftSourceSchema,
    op: comparatorSchema.exclude(["between"]),
    right: z.union([z.number(), z.boolean()]),
  }),
  z.object({
    left: leftSourceSchema,
    op: z.literal("between"),
    right: betweenSchema,
  }),
]);

export const requirementSchema = z.union([
  z.object({
    all: z.lazy(() => z.array(requirementSchema)),
    version: versionSchema.optional(),
  }),
  z.object({
    any: z.lazy(() => z.array(requirementSchema)),
    version: versionSchema.optional(),
  }),
  z.object({
    not: z.lazy(() => requirementSchema),
    version: versionSchema.optional(),
  }),
  z.object({ expr: exprSchema, version: versionSchema.optional() }),
]);

// Evaluator context shape (duck-typed):
// {
//   stats: GameStats,
//   session: GameSession,
//   upgrades: Array<{ key: string, level: number }>,
//   worshippers: Array<{ typeKey?: string, typeId?: string }>,
//   cards: Array<{ cardKey?: string, cardId?: string }>
// }

export function evaluateRequirement(input, ctx) {
  const parsed = requirementSchema.parse(input);
  return evaluate(parsed, ctx);
}

function evaluate(node, ctx) {
  if ("all" in node) {
    return ensureArray(node.all).every((n) => evaluate(n, ctx));
  }
  if ("any" in node) {
    return ensureArray(node.any).some((n) => evaluate(n, ctx));
  }
  if ("not" in node) {
    return !evaluate(node.not, ctx);
  }
  if ("expr" in node) {
    const { left, op, right } = node.expr;
    const value = resolveLeft(left, ctx);
    return compareValues(value, op, right);
  }
  return false;
}

function resolveLeft(left, ctx) {
  switch (left.source) {
    case "stat":
      return ctx?.stats?.[left.field] ?? 0;
    case "session":
      return ctx?.session?.[left.field] ?? 0;
    case "upgrade": {
      const u = (ctx?.upgrades || []).find((x) => x.key === left.key);
      if (!u) return left.field === "unlocked" ? false : 0;
      return left.field === "unlocked" ? true : Number(u.level ?? 0);
    }
    case "worshippers": {
      const arr = ctx?.worshippers || [];
      const filtered = left.filter
        ? arr.filter(
            (w) =>
              (left.filter.typeKey
                ? w.typeKey === left.filter.typeKey
                : true) &&
              (left.filter.typeId ? w.typeId === left.filter.typeId : true)
          )
        : arr;
      return filtered.length;
    }
    case "cards": {
      const arr = ctx?.cards || [];
      const filtered = left.filter
        ? arr.filter(
            (c) =>
              (left.filter.cardKey
                ? c.cardKey === left.filter.cardKey
                : true) &&
              (left.filter.cardId ? c.cardId === left.filter.cardId : true)
          )
        : arr;
      return filtered.length;
    }
    default:
      return 0;
  }
}

export function validateRequirement(input) {
  return requirementSchema.safeParse(input);
}
