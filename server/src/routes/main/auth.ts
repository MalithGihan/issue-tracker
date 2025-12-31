import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../../models/User";
import { signAccessToken } from "../../utils/jwt";
import { requireAuth, AuthedRequest } from "../../middleware/auth";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { email, password } = parsed.data;
  const emailNorm = email.trim().toLowerCase();

  const exists = await User.findOne({ email: emailNorm });
  if (exists) return res.status(409).json({ error: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email: emailNorm, passwordHash });

  const token = signAccessToken({ userId: user._id.toString() });

  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: (process.env.COOKIE_SAMESITE as any) || "lax",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: 15 * 60 * 1000,
  });

  return res.status(201).json({ ok: true });
});

router.post("/login", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { email, password } = parsed.data;
  const emailNorm = email.trim().toLowerCase();

  const user = await User.findOne({ email: emailNorm });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signAccessToken({ userId: user._id.toString() });

  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: (process.env.COOKIE_SAMESITE as any) || "lax",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: 15 * 60 * 1000,
  });

  return res.json({ ok: true });
});

router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  return res.json({ ok: true, userId: req.userId });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("access_token");
  return res.json({ ok: true });
});

export default router;
