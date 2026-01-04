import mongoose from "mongoose";

export type IssueStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type IssueDoc = {
  title: string;
  description: string;
  label?: string | null;
  status: IssueStatus;
  assignFor?: mongoose.Types.ObjectId | null;
  priority: IssuePriority;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const issueSchema = new mongoose.Schema<IssueDoc>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },

    label: { type: String, trim: true, maxlength: 50, default: null },

    status: {
      type: String,
      required: true,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN",
    },

    assignFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    priority: {
      type: String,
      required: true,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// helpful indexes (search + filter + sort)
issueSchema.index({ title: "text", description: "text", label: "text" });
issueSchema.index({ status: 1, priority: 1, updatedAt: -1 });
issueSchema.index({ createdBy: 1, createdAt: -1 });
issueSchema.index({ assignFor: 1, updatedAt: -1 });

export const Issue = mongoose.model<IssueDoc>("Issue", issueSchema);
