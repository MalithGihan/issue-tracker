import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { X, Trash2, Pencil } from "lucide-react";

import {
  useGetIssueQuery,
  useDeleteIssueMutation,
} from "../../features/issues/issuesApi";
import { useMeQuery } from "../../features/auth/authApi";
import { getRtkErrorMessage } from "../../lib/rtkError";
import Skeleton from "../../components/ContentLoaders/Skeleton";
import EmptyState from "../../components/ContentLoaders/EmptyState";

type Props = {
  id: string | null;      // null = closed
  onClose: () => void;    // parent closes popup
};

export default function IssueDetailModal({ id, onClose }: Props) {
  const isOpen = Boolean(id);

  const { data, isLoading } = useGetIssueQuery(id || "", { skip: !id });
  const { data: me } = useMeQuery();
  const [del, { isLoading: deleting }] = useDeleteIssueMutation();

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Optional: lock background scroll when open
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

  const modal = (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Issue details
            </h2>
            <p className="text-xs text-zinc-500">View issue information</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
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
              const isOwner = me?.userId && it.createdBy === me.userId;

              return (
                <>
                  <h3 className="text-xl font-bold text-zinc-900">{it.title}</h3>

                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                      Status: <span className="font-medium">{it.status}</span>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                      Priority: <span className="font-medium">{it.priority}</span>
                    </span>
                  </div>

                  <div className="rounded-xl border border-zinc-200 p-4 whitespace-pre-wrap text-sm text-zinc-800">
                    {it.description}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
                    >
                      Close
                    </button>

                    {isOwner && (
                      <div className="flex gap-2">
                        <Link
                          to={`/app/issues/${it._id}/edit`}
                          onClick={onClose} // optional: close when navigating
                          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition"
                        >
                          <Pencil size={16} />
                          Edit
                        </Link>

                        <button
                          type="button"
                          disabled={deleting}
                          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          onClick={async () => {
                            if (!confirm("Delete this issue?")) return;
                            const r = await del(it._id);
                            if ("error" in r) {
                              return toast.error(
                                getRtkErrorMessage(r.error, "Delete failed")
                              );
                            }
                            toast.success("Issue deleted");
                            onClose();
                          }}
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
    </div>
  );

  return createPortal(modal, document.body);
}
