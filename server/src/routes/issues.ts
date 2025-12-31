import { Router } from "express";
import { z } from "zod";
import { Issue } from "../models/Issue";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router();

const createSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(3).max(5000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { title, description, priority } = parsed.data;

  const issue = await Issue.create({
    title,
    description,
    priority: priority ?? "MEDIUM",
    status: "OPEN",
    createdBy: req.userId,
  });

  return res.status(201).json({ ok: true, issue });
});

router.get("/", requireAuth, async (_req, res) => {
  const issues = await Issue.find().sort({ createdAt: -1 }).limit(50);
  return res.json({ ok: true, issues });
});

export default router;
