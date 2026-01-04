import { Router } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { Issue } from "../../models/Issue";
import { User } from "../../models/User";
import { requireAuth, AuthedRequest } from "../../middleware/auth";

const router = Router();

/** Helpers */
async function getMeOrThrow(userId?: string) {
  if (!userId) throw new Error("Unauthorized");
  const me = await User.findById(userId).select("_id name email organization").lean();
  if (!me) throw new Error("Unauthorized");
  return me;
}

async function getOrgUserIds(organization: string) {
  const users = await User.find({ organization }).select("_id").lean();
  return users.map((u) => u._id);
}

function toObjectIdOrNull(v: unknown) {
  if (v === null) return null;
  if (typeof v !== "string") return undefined;
  if (!mongoose.isValidObjectId(v)) return undefined;
  return new mongoose.Types.ObjectId(v);
}

/** Schemas */
const createSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(3).max(5000),
  label: z.string().trim().min(1).max(50).nullable().optional(),
  assignFor: z.string().nullable().optional(), // user id or null
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

const updateSchema = z
  .object({
    title: z.string().min(3).max(120).optional(),
    description: z.string().min(3).max(5000).optional(),
    label: z.string().trim().min(1).max(50).nullable().optional(),
    assignFor: z.string().nullable().optional(), // user id or null
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

const listSchema = z.object({
  q: z.string().trim().min(1).optional(),
  label: z.string().trim().min(1).optional(), // exact label filter (case-insensitive)
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(10),
  sort: z.enum(["newest", "oldest"]).default("newest"),
});

/**
 * GET /api/v1/issues/assignees
 * Users in my organization (for assign dropdown)
 */
router.get("/assignees", requireAuth, async (req: AuthedRequest, res) => {
  const me = await getMeOrThrow(req.userId);

  const users = await User.find({ organization: me.organization })
    .select("_id name email organization createdAt")
    .sort({ name: 1 })
    .lean();

  return res.json({
    ok: true,
    users: users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      organization: u.organization,
      createdAt: u.createdAt,
    })),
  });
});

/**
 * POST /api/v1/issues
 * Create issue scoped to org, assignment only inside org
 */
router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const me = await getMeOrThrow(req.userId);

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { title, description, priority } = parsed.data;
  const label = parsed.data.label ?? null;

  // validate assignFor (must be user in same org)
  const assignForId = toObjectIdOrNull(parsed.data.assignFor);
  if (assignForId === undefined) {
    return res.status(400).json({ error: "Invalid assignFor" });
  }

  if (assignForId) {
    const assignee = await User.findOne({ _id: assignForId, organization: me.organization }).select("_id").lean();
    if (!assignee) return res.status(400).json({ error: "Assignee not in your organization" });
  }

  const issue = await Issue.create({
    title,
    description,
    label,
    assignFor: assignForId ?? null,
    priority: priority ?? "MEDIUM",
    status: "OPEN",
    createdBy: me._id,
  });

  const populated = await Issue.findById(issue._id)
    .populate("createdBy", "name email organization")
    .populate("assignFor", "name email organization")
    .lean();

  return res.status(201).json({ ok: true, issue: populated });
});

/**
 * GET /api/v1/issues/stats
 * Stats only for my organization issues
 */
router.get("/stats", requireAuth, async (req: AuthedRequest, res) => {
  const me = await getMeOrThrow(req.userId);
  const orgUserIds = await getOrgUserIds(me.organization);

  const byStatusAgg = await Issue.aggregate([
    { $match: { createdBy: { $in: orgUserIds } } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const byPriorityAgg = await Issue.aggregate([
    { $match: { createdBy: { $in: orgUserIds } } },
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);

  const byStatus: Record<string, number> = {};
  for (const row of byStatusAgg) byStatus[row._id] = row.count;

  const byPriority: Record<string, number> = {};
  for (const row of byPriorityAgg) byPriority[row._id] = row.count;

  const recent = await Issue.find({ createdBy: { $in: orgUserIds } })
    .sort({ updatedAt: -1 })
    .limit(5)
    .select("_id title status priority label updatedAt createdBy assignFor")
    .populate("createdBy", "name email organization")
    .populate("assignFor", "name email organization")
    .lean();

  return res.json({ ok: true, byStatus, byPriority, recent });
});

/**
 * GET /api/v1/issues/:id
 * Must belong to my organization, return creator + assignee details
 */
router.get("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const me = await getMeOrThrow(req.userId);

  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

  const issue = await Issue.findById(id)
    .populate("createdBy", "name email organization")
    .populate("assignFor", "name email organization")
    .lean();

  if (!issue) return res.status(404).json({ error: "Issue not found" });

  // org guard: creator must be in my org
  const creatorOrg = (issue as any)?.createdBy?.organization;
  if (creatorOrg !== me.organization) return res.status(404).json({ error: "Issue not found" });

  return res.json({ ok: true, issue });
});

/**
 * PATCH /api/v1/issues/:id
 * Only creator can edit, assignment only inside org
 */
router.patch("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const me = await getMeOrThrow(req.userId);

  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const issue = await Issue.findById(id);
  if (!issue) return res.status(404).json({ error: "Issue not found" });

  // owner-only
  if (issue.createdBy.toString() !== me._id.toString()) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // if assignFor is present, validate it is in org
  if ("assignFor" in parsed.data) {
    const assignForId = toObjectIdOrNull(parsed.data.assignFor);
    if (assignForId === undefined) return res.status(400).json({ error: "Invalid assignFor" });

    if (assignForId) {
      const assignee = await User.findOne({ _id: assignForId, organization: me.organization })
        .select("_id")
        .lean();
      if (!assignee) return res.status(400).json({ error: "Assignee not in your organization" });
    }

    (issue as any).assignFor = assignForId ?? null;
    delete (parsed.data as any).assignFor;
  }

  // label can be set to null to clear
  if ("label" in parsed.data) {
    (issue as any).label = parsed.data.label ?? null;
    delete (parsed.data as any).label;
  }

  Object.assign(issue, parsed.data);
  await issue.save();

  const populated = await Issue.findById(issue._id)
    .populate("createdBy", "name email organization")
    .populate("assignFor", "name email organization")
    .lean();

  return res.json({ ok: true, issue: populated });
});

/**
 * DELETE /api/v1/issues/:id
 * Only creator can delete
 */
router.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const me = await getMeOrThrow(req.userId);

  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

  const issue = await Issue.findById(id);
  if (!issue) return res.status(404).json({ error: "Issue not found" });

  if (issue.createdBy.toString() !== me._id.toString()) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await Issue.deleteOne({ _id: id });
  return res.json({ ok: true });
});

/**
 * GET /api/v1/issues
 * Only issues created by users in my organization
 * Supports: q (text), label, status, priority, pagination, sort
 * Populates createdBy + assignFor
 */
router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const me = await getMeOrThrow(req.userId);

  const parsed = listSchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "Invalid query" });

  const { q, label, status, priority, page, limit, sort } = parsed.data;

  const orgUserIds = await getOrgUserIds(me.organization);

  const filter: any = {
    createdBy: { $in: orgUserIds },
  };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  // label exact match (case-insensitive)
  if (label) filter.label = { $regex: `^${escapeRegex(label)}$`, $options: "i" };

  // q full-text search (title/description/label are indexed)
  if (q) filter.$text = { $search: q };

  const skip = (page - 1) * limit;

  const total = await Issue.countDocuments(filter);

  let query = Issue.find(filter)
    .populate("createdBy", "name email organization")
    .populate("assignFor", "name email organization");

  // If using text search, sort by relevance first
  if (q) {
    query = Issue.find(filter, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .populate("createdBy", "name email organization")
      .populate("assignFor", "name email organization");
  } else {
    query = query.sort({ createdAt: sort === "oldest" ? 1 : -1 });
  }

  const issues = await query.skip(skip).limit(limit).lean();

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

/** regex helper for label filter */
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default router;
