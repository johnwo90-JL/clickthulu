// Common helpers for DSL validation and evaluation
import { z } from "zod";

export const comparatorSchema = z.enum([
  "eq",
  "ne",
  "gt",
  "gte",
  "lt",
  "lte",
  "between",
]);

export const booleanOrNumber = z.union([z.boolean(), z.number()]);

export function compareValues(left, op, right) {
  switch (op) {
    case "eq":
      return left === right;
    case "ne":
      return left !== right;
    case "gt":
      return Number(left) > Number(right);
    case "gte":
      return Number(left) >= Number(right);
    case "lt":
      return Number(left) < Number(right);
    case "lte":
      return Number(left) <= Number(right);
    case "between": {
      if (!right || typeof right !== "object") return false;
      const { min, max } = right;
      if (typeof min !== "number" || typeof max !== "number") return false;
      const value = Number(left);
      return value >= min && value <= max;
    }
    default:
      return false;
  }
}

export const logicalKeys = ["all", "any", "not"];

export function isLogical(node) {
  if (!node || typeof node !== "object") return false;
  return logicalKeys.some((k) => k in node);
}

export function normalizeArray(maybeArr) {
  if (!maybeArr) return [];
  return Array.isArray(maybeArr) ? maybeArr : [maybeArr];
}

export function ensureArray(value) {
  return Array.isArray(value) ? value : [value];
}

export function getByPath(obj, path) {
  if (!obj) return null;
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : null), obj);
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export const versionSchema = z.number().int().positive().default(1);
