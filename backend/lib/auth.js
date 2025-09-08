import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import assert from "assert";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = String(process.env.JWT_SECRET || "dev_secret_change_me");
const ACCESS_TOKEN_EXPIRES_SECONDS = Number(
  process.env.TOKEN_EXPIRY_INTERVAL || 15 * 60
);
const REFRESH_TOKEN_EXPIRES_SECONDS = Number(
  process.env.REFRESH_TOKEN_EXPIRES_IN_SECONDS || 7 * 24 * 60 * 60
); // 7 days

export async function hashPassword(plainPassword) {
  const saltRounds = 10;
  return bcrypt.hash(plainPassword, saltRounds);
}

export async function verifyPassword(plainPassword, passwordHash) {
  if (!passwordHash) return false;
  return bcrypt.compare(plainPassword, passwordHash);
}

export function generateAccessToken(payload) {
  // payload should include at minimum: { sub: userId, username }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_SECONDS,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function generateRefreshTokenPlain() {
  // 64 bytes -> 128 hex chars
  return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(refreshTokenPlain) {
  // deterministic hash for DB lookup
  return crypto.createHash("sha256").update(refreshTokenPlain).digest("hex");
}

export function getRefreshTokenExpiryDate() {
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + REFRESH_TOKEN_EXPIRES_SECONDS * 1000
  );
  return expiresAt;
}
