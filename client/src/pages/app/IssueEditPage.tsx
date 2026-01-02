/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertCircle, ArrowRight } from "lucide-react";
import type { ZodError } from "zod";
import { useFormik } from "formik";

import {
  useGetIssueQuery,
  useUpdateIssueMutation,
  type IssuePriority,
  type IssueStatus,
} from "../../features/issues/issuesApi";
import { getRtkErrorMessage } from "../../lib/rtkError";
import { issueUpdateSchema } from "../../lib/schemas";
import { firstZodError } from "../../lib/zodError";
import IssueDetailModal from "./IssueDetailModal";
import { useState } from "react";

type FormValues = {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
};

function zodToFormikErrors<T extends Record<string, any>>(error: ZodError<T>) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path?.[0];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out;
}

export default function IssueEditPage() {
  const nav = useNavigate();
  const { id } = useParams();
  const issueId = id || "";
  const [issueDetails, setIssueDetails] = useState(false);

  const { data, isLoading } = useGetIssueQuery(issueId, { skip: !issueId });
  const [updateIssue, { isLoading: saving }] = useUpdateIssueMutation();

  if (!issueId) {
    return <div className="text-sm text-zinc-600">Missing issue id</div>;
  }

  if (isLoading) {
    return (
      <div className="space-y-3 max-w-xl">
        <div className="h-6 w-40 bg-zinc-100 rounded-lg animate-pulse" />
        <div className="h-10 w-full bg-zinc-100 rounded-xl animate-pulse" />
        <div className="h-32 w-full bg-zinc-100 rounded-xl animate-pulse" />
        <div className="h-10 w-full bg-zinc-100 rounded-xl animate-pulse" />
        <div className="h-10 w-full bg-zinc-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data?.ok) {
    return (
      <div className="max-w-xl space-y-2">
        <h2 className="text-lg font-semibold text-zinc-900">Not found</h2>
        <Link to="/app/issues" className="text-sm underline text-zinc-700">
          Back to issues
        </Link>
      </div>
    );
  }

  return (
    <>
      <IssueEditForm
        issueId={issueId}
        issue={data.issue}
        saving={saving}
        onSave={async (values) => {
          const parsed = issueUpdateSchema.safeParse(values);
          if (!parsed.success) {
            toast.error(firstZodError(parsed.error));
            return;
          }

          const r = await updateIssue({ id: issueId, patch: parsed.data });
          if ("error" in r) {
            toast.error(getRtkErrorMessage(r.error, "Update failed"));
            return;
          }

          toast.success("Issue updated");
          nav("/app/issues", { replace: true })
        }}
      />
      {issueDetails && id && (
        <IssueDetailModal id={id} onClose={() => setIssueDetails(false)} />
      )}
    </>
  );
}

function IssueEditForm({
  issue,
  saving,
  onSave,
}: {
  issueId: string;
  issue: {
    title: string;
    description: string;
    status: IssueStatus;
    priority: IssuePriority;
  };
  saving: boolean;
  onSave: (values: FormValues) => Promise<void>;
}) {
  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      title: issue.title || "",
      description: issue.description || "",
      status: issue.status,
      priority: issue.priority,
    },
    validate: (values) => {
      const parsed = issueUpdateSchema.safeParse(values);
      if (parsed.success) return {};
      return zodToFormikErrors(parsed.error) as Partial<
        Record<keyof FormValues, string>
      >;
    },
    onSubmit: onSave,
  });

  const fieldClass = (hasError?: boolean) =>
    `w-full px-4 py-3 rounded-xl border ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : "border-zinc-200 focus:ring-zinc-900"
    } bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-3 max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Edit Issue</h1>
        <p className="mt-1 text-xs text-zinc-600">Update issue details</p>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-zinc-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={fieldClass(
              formik.touched.title && !!formik.errors.title
            )}
            placeholder="E.g. Login page crashes on submit"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={14} />
              <span>{String(formik.errors.title)}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-zinc-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            className={fieldClass(
              formik.touched.description && !!formik.errors.description
            )}
            placeholder="Steps to reproduce, expected vs actual..."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={14} />
              <span>{String(formik.errors.description)}</span>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-zinc-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            className={fieldClass(
              formik.touched.status && !!formik.errors.status
            )}
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
          {formik.touched.status && formik.errors.status && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={14} />
              <span>{String(formik.errors.status)}</span>
            </div>
          )}
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label
            htmlFor="priority"
            className="text-sm font-medium text-zinc-700"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className={fieldClass(
              formik.touched.priority && !!formik.errors.priority
            )}
            value={formik.values.priority}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
          {formik.touched.priority && formik.errors.priority && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={14} />
              <span>{String(formik.errors.priority)}</span>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving || formik.isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
        >
          {saving || formik.isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Save changes</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
