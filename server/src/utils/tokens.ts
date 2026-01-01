import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env";

export function signAccessToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_ACCESS_SECRET, { expiresIn: `${env.ACCESS_MINUTES}m` });
}

export function signRefreshToken(userId: string) {
  // jti helps rotation; each refresh creates a new token
  const jti = crypto.randomUUID();
  return jwt.sign({ userId, jti }, env.JWT_REFRESH_SECRET, { expiresIn: `${env.REFRESH_DAYS}d` });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; jti: string; iat: number; exp: number };
}

// store hash only (never store raw refresh token in DB)
export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string; iat: number; exp: number };
}
