/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { AlertCircle, ArrowRight } from "lucide-react";
import type { ZodError } from "zod";

import {
  useCreateIssueMutation,
  useGetAssigneesQuery,
  type IssuePriority,
} from "../../features/issues/issuesApi";
import { getRtkErrorMessage } from "../../lib/rtkError";
import { issueCreateSchema } from "../../lib/schemas";
import IssueDetailModal from "./IssueDetailModal";
import { useState } from "react";

type FormValues = {
  title: string;
  description: string;
  label: string;
  assignFor: string; 
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

export default function IssueCreatePage() {
  const nav = useNavigate();
  const [createIssue, { isLoading }] = useCreateIssueMutation();

  const { data: assigneesData, isLoading: assigneesLoading } =
    useGetAssigneesQuery();

  const users = assigneesData?.users ?? [];

  const [issueDetails, setIssueDetails] = useState(false);
  const [id, setID] = useState("");

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      description: "",
      label: "",
      assignFor: "",
      priority: "MEDIUM",
    },

    validate: (values) => {
      const parsed = issueCreateSchema.safeParse(values);
      if (parsed.success) return {};
      return zodToFormikErrors(parsed.error) as Partial<
        Record<keyof FormValues, string>
      >;
    },

    onSubmit: async (values) => {
      const parsed = issueCreateSchema.safeParse(values);
      if (!parsed.success) {
        toast.error(parsed.error.issues?.[0]?.message || "Invalid input");
        return;
      }

      const body = {
        ...parsed.data,
        label: values.label.trim() ? values.label.trim() : null,
        assignFor: values.assignFor ? values.assignFor : null,
      };

      const r = await createIssue(body as any);

      if ("error" in r) {
        toast.error(getRtkErrorMessage(r.error, "Create failed"));
        return;
      }

      toast.success("Issue created");

      const newId =
        (r.data as any)?.issue?._id ??
        (r.data as any)?.data?.issue?._id ??
        (r.data as any)?.issueId ??
        (r.data as any)?._id;

      if (!newId) return nav("/app/issues", { replace: true });

      setIssueDetails(true);
      setID(newId);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-3 max-w-xl flex flex-col justify-start"
    >
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Create Issue</h1>
        <p className="mt-1 text-xs text-zinc-600">Create issue with details</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-zinc-700">
            Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            className={`w-full px-4 py-3 rounded-xl border ${
              formik.touched.title && formik.errors.title
                ? "border-red-500 focus:ring-red-500"
                : "border-zinc-200 focus:ring-zinc-900"
            } bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            placeholder="E.g. Login page crashes on submit"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.title && formik.errors.title && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={14} />
              <span>{formik.errors.title}</span>
            </div>
          )}
        </div>

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
            className={`w-full px-4 py-3 rounded-xl border ${
              formik.touched.description && formik.errors.description
                ? "border-red-500 focus:ring-red-500"
                : "border-zinc-200 focus:ring-zinc-900"
            } bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            placeholder="Steps to reproduce, expected vs actual, screenshots, etc."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.description && formik.errors.description && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={14} />
              <span>{formik.errors.description}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="label" className="text-sm font-medium text-zinc-700">
            Label <span className="text-xs text-zinc-500">(optional)</span>
          </label>

          <input
            id="label"
            name="label"
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-zinc-900 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            placeholder="E.g. bug, ui, auth"
            value={formik.values.label}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="assignFor"
            className="text-sm font-medium text-zinc-700"
          >
            Assign to <span className="text-xs text-zinc-500">(optional)</span>
          </label>

          <select
            id="assignFor"
            name="assignFor"
            className="w-full text-sm px-4 py-3 rounded-xl border border-zinc-200 focus:ring-zinc-900 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            value={formik.values.assignFor}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={assigneesLoading}
          >
            <option value="">
              {assigneesLoading ? "Loading users..." : "Unassigned"}
            </option>

            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

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
            className={`w-full text-sm px-4 py-3 rounded-xl border ${
              formik.touched.priority && formik.errors.priority
                ? "border-red-500 focus:ring-red-500"
                : "border-zinc-200 focus:ring-zinc-900"
            } bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            value={formik.values.priority}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="LOW" className="text-xs">
              LOW
            </option>
            <option value="MEDIUM" className="text-xs">
              MEDIUM
            </option>
            <option value="HIGH" className="text-xs">
              HIGH
            </option>
            <option value="URGENT" className="text-xs">
              URGENT
            </option>
          </select>

          {formik.touched.priority && formik.errors.priority && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle size={14} />
              <span>{formik.errors.priority}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || formik.isSubmitting}
          className="w-full flex items-center justify-center gap-2 mt-10 py-3 px-4 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
        >
          {isLoading || formik.isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Create</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>
      </div>

      {issueDetails && (
        <IssueDetailModal id={id} onClose={() => setIssueDetails(false)} />
      )}
    </form>
  );
}
