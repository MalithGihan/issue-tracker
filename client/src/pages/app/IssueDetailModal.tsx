import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  X,
  Trash2,
  Pencil,
  Tag,
  User2,
  Calendar,
  CheckCircle2,
} from "lucide-react";

import {
  useGetIssueQuery,
  useDeleteIssueMutation,
} from "../../features/issues/issuesApi";
import { useMeQuery } from "../../features/auth/authApi";
import { getRtkErrorMessage } from "../../lib/rtkError";
import Skeleton from "../../components/ContentLoaders/Skeleton";
import EmptyState from "../../components/ContentLoaders/EmptyState";

type Props = {
  id: string | null;
  onClose: () => void;
};

function fmtDate(v?: string) {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

export default function IssueDetailModal({ id, onClose }: Props) {
  const isOpen = Boolean(id);

  const { data, isLoading } = useGetIssueQuery(id || "", { skip: !id });
  const { data: me } = useMeQuery();
  const [del, { isLoading: deleting }] = useDeleteIssueMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock scroll
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const onDelete = async () => {
    if (!id) return;

    const r = await del(id);

    if ("error" in r) {
      toast.error(getRtkErrorMessage(r.error, "Delete failed"));
      return;
    }

    toast.success("Issue deleted");
    setShowDeleteConfirm(false);
    handleClose();
  };

  const modal = (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Issue details
            </h2>
            <p className="text-xs text-zinc-500">View issue information</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : !data?.ok ? (
            <EmptyState
              title="Issue not found"
              message="It may have been deleted or the link is wrong."
              actionLabel="Back to issues"
              actionTo="/app/issues"
            />
          ) : (
            (() => {
              const it = data.issue;

              const myId = me?.user?.id;
              const creatorId = it?.createdBy?._id || it?.createdBy?.id;
              const isOwner = Boolean(
                myId && creatorId && String(creatorId) === String(myId)
              );

              const creatorName = it?.createdBy?.name ?? "Unknown";
              const creatorEmail = it?.createdBy?.email ?? "";
              const org = it?.createdBy?.organization ?? "";

              const assigneeName = it?.assignFor?.name ?? null;
              const assigneeEmail = it?.assignFor?.email ?? null;

              return (
                <>
                  <h3 className="text-xl font-bold text-zinc-900">
                    {it.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                      Status: <span className="font-medium">{it.status}</span>
                    </span>

                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                      Priority:{" "}
                      <span className="font-medium">{it.priority}</span>
                    </span>

                    {it.label ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                        <Tag size={14} />
                        <span className="font-medium">{it.label}</span>
                      </span>
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-zinc-200 p-4">
                      <div className="text-xs font-semibold text-zinc-500 mb-2">
                        Created by
                      </div>
                      <div className="flex items-start gap-2 text-sm text-zinc-800">
                        <User2 size={16} className="mt-0.5 text-zinc-500" />
                        <div>
                          <div className="font-semibold text-zinc-900">
                            {creatorName}
                          </div>
                          {creatorEmail ? (
                            <div className="text-xs text-zinc-600">
                              {creatorEmail}
                            </div>
                          ) : null}
                          {org ? (
                            <div className="text-xs text-zinc-500">{org}</div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-zinc-200 p-4">
                      <div className="text-xs font-semibold text-zinc-500 mb-2">
                        Assigned to
                      </div>
                      {assigneeName ? (
                        <div className="flex items-start gap-2 text-sm text-zinc-800">
                          <CheckCircle2
                            size={16}
                            className="mt-0.5 text-zinc-500"
                          />
                          <div>
                            <div className="font-semibold text-zinc-900">
                              {assigneeName}
                            </div>
                            {assigneeEmail ? (
                              <div className="text-xs text-zinc-600">
                                {assigneeEmail}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-zinc-600">Unassigned</div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-200 p-4">
                    <div className="text-xs font-semibold text-zinc-500 mb-2">
                      Timeline
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 text-sm text-zinc-700">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-zinc-500" />
                        <span>Created: {fmtDate(it.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-zinc-500" />
                        <span>Updated: {fmtDate(it.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-200 p-4 whitespace-pre-wrap text-sm text-zinc-800">
                    <div className="text-xs font-semibold text-zinc-500 mb-2">
                      Description
                    </div>
                    {it.description}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                    >
                      Close
                    </button>

                    {isOwner && (
                      <div className="flex gap-2">
                        <Link
                          to={`/app/issues/${it._id}/edit`}
                          onClick={handleClose}
                          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition"
                        >
                          <Pencil size={16} />
                          Edit
                        </Link>

                        <button
                          type="button"
                          disabled={deleting}
                          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          <Trash2 size={16} />
                          {deleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              );
            })()
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  Delete
                </h3>
                <p className="text-sm text-zinc-600">
                  Are you sure you want to delete?
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(modal, document.body);
}
