import mongoose from "mongoose";

export type IssueStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type IssueDoc = {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const issueSchema = new mongoose.Schema<IssueDoc>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, required: true, enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"], default: "OPEN" },
    priority: { type: String, required: true, enum: ["LOW", "MEDIUM", "HIGH", "URGENT"], default: "MEDIUM" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// helpful indexes (search + filter + sort)
issueSchema.index({ title: "text", description: "text" });
issueSchema.index({ status: 1, priority: 1, createdAt: -1 });

export const Issue = mongoose.model<IssueDoc>("Issue", issueSchema);
