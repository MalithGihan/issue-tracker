import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { User } from "../../models/User";
import { env } from "../../config/env";
import { requireAuth, AuthedRequest } from "../../middleware/auth";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} from "../../utils/tokens";
import rateLimit from "express-rate-limit";

const router = Router();
const loginLimiter = rateLimit({ windowMs: 2 * 60 * 1000, max: 5 });
const refreshLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

function setAuthCookies(res: any, accessToken: string, refreshToken: string) {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    sameSite: env.COOKIE_SAMESITE,
    secure: env.COOKIE_SECURE,
    maxAge: env.ACCESS_MINUTES * 60 * 1000,
    path: "/",
  });

  // more secure: only sent to refresh endpoint
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: env.COOKIE_SAMESITE,
    secure: env.COOKIE_SECURE,
    maxAge: env.REFRESH_DAYS * 24 * 60 * 60 * 1000,
    path: "/api/v1/auth/refresh",
  });
}

function clearAuthCookies(res: any) {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/api/v1/auth/refresh" });
}

function toPublicUser(u: any) {
  return {
    id: u._id.toString(),
    name: u.name,
    organization: u.organization,
    email: u.email,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

const credentialsSchema = z.object({
  name: z.string(),
  organization: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  name: z.string().min(2),
  organization: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// POST /api/v1/auth/register
router.post("/register", loginLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { name, organization, password } = parsed.data;
  const emailNorm = parsed.data.email.trim().toLowerCase();

  const exists = await User.findOne({ email: emailNorm });
  if (exists) return res.status(409).json({ error: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    organization,
    email: emailNorm,
    passwordHash,
  });

  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
  return res.status(201).json({ ok: true, user: toPublicUser(user) });
});

// POST /api/v1/auth/login
router.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const emailNorm = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;

  const user = await User.findOne({ email: emailNorm });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());

  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
  return res.json({ ok: true, user: toPublicUser(user) });
});

// GET /api/v1/auth/me
router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await User.findById(req.userId)
    .select("name organization email createdAt updatedAt")
    .lean();

  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json({ ok: true, user: { id: user._id.toString(), ...user } });
});

// POST /api/v1/auth/logout
router.post("/logout", requireAuth, async (req: AuthedRequest, res) => {
  await User.updateOne(
    { _id: req.userId },
    { $set: { refreshTokenHash: null } }
  );
  clearAuthCookies(res);
  return res.json({ ok: true });
});

// POST /api/v1/auth/refresh
router.post("/refresh", refreshLimiter, async (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (user.refreshTokenHash !== hashToken(token)) {
      user.refreshTokenHash = null;
      await user.save();
      return res.status(401).json({ error: "Unauthorized" });
    }

    // rotate
    const newAccess = signAccessToken(user._id.toString());
    const newRefresh = signRefreshToken(user._id.toString());

    user.refreshTokenHash = hashToken(newRefresh);
    await user.save();

    setAuthCookies(res, newAccess, newRefresh);
    return res.json({ ok: true });
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;
