import { Router } from "express";
import { z } from "zod";
import { Issue } from "../../models/Issue";
import { requireAuth, AuthedRequest } from "../../middleware/auth";
import mongoose from "mongoose";

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

router.get("/stats", requireAuth, async (_req, res) => {
  const rows = await Issue.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const byStatus = rows.reduce((acc: any, r: any) => {
    acc[r._id] = r.count;
    return acc;
  }, {});

  return res.json({ ok: true, byStatus });
});

router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

  const issue = await Issue.findById(id);
  if (!issue) return res.status(404).json({ error: "Issue not found" });

  return res.json({ ok: true, issue });
});

const updateSchema = z
  .object({
    title: z.string().min(3).max(120).optional(),
    description: z.string().min(3).max(5000).optional(),
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

router.patch("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const issue = await Issue.findById(id);
  if (!issue) return res.status(404).json({ error: "Issue not found" });

  if (issue.createdBy.toString() !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  Object.assign(issue, parsed.data);
  await issue.save();

  return res.json({ ok: true, issue });
});

router.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

  const issue = await Issue.findById(id);
  if (!issue) return res.status(404).json({ error: "Issue not found" });

  if (issue.createdBy.toString() !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await Issue.deleteOne({ _id: id });
  return res.json({ ok: true });
});

const listSchema = z.object({
  q: z.string().trim().min(1).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.enum(["newest", "oldest"]).default("newest"),
});

router.get("/", requireAuth, async (req, res) => {
  const parsed = listSchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "Invalid query" });

  const { q, status, priority, page, limit, sort } = parsed.data;

  const filter: any = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (q) filter.$text = { $search: q };

  const skip = (page - 1) * limit;

  const total = await Issue.countDocuments(filter);

  let query = Issue.find(filter);

  // If using text search, sort by relevance first
  if (q) query = Issue.find(filter, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" }, createdAt: -1 });
  else query = query.sort({ createdAt: sort === "oldest" ? 1 : -1 });

  const issues = await query.skip(skip).limit(limit);

  return res.json({
    ok: true,
    issues,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
    },
  });
});




export default router;
