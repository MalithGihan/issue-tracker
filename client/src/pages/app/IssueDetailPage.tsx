import { Link, useParams } from "react-router-dom";
import { useGetIssueQuery } from "../../features/issues/issuesApi";
import { useMeQuery } from "../../features/auth/authApi";
import { useDeleteIssueMutation } from "../../features/issues/issuesApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getRtkErrorMessage } from "../../lib/rtkError";
import Skeleton from "../../components/loading/Skeleton";
import EmptyState from "../../components/loading/EmptyState";

export default function IssueDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetIssueQuery(id || "", { skip: !id });
  const nav = useNavigate();
  const { data: me } = useMeQuery();
  const [del, { isLoading: deleting }] = useDeleteIssueMutation();

  if (isLoading) {
    return (
      <div className="space-y-3 max-w-2xl">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!data?.ok) {
    return (
      <EmptyState
        title="Issue not found"
        message="It may have been deleted or the link is wrong."
        actionLabel="Back to issues"
        actionTo="/app/issues"
      />
    );
  }

  const it = data.issue;
  const isOwner = me?.userId && it.createdBy === me.userId;

  return (
    <div className="space-y-3 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{it.title}</h2>
        <Link to="/app/issues" className="text-sm underline">
          Back
        </Link>
      </div>

      <div className="text-sm">Status: {it.status}</div>
      <div className="text-sm">Priority: {it.priority}</div>
      <div className="rounded-lg border p-3 whitespace-pre-wrap">
        {it.description}
      </div>

      {isOwner && (
        <div className="flex gap-2">
          <Link
            to={`/app/issues/${it._id}/edit`}
            className="text-sm rounded-lg border px-3 py-1"
          >
            Edit
          </Link>
          <button
            disabled={deleting}
            className="text-sm rounded-lg border px-3 py-1"
            onClick={async () => {
              if (!confirm("Delete this issue?")) return;
              const r = await del(it._id);
              if ("error" in r)
                return toast.error(
                  getRtkErrorMessage(r.error, "Delete failed")
                );
              toast.success("Issue deleted");
              nav("/app/issues", { replace: true });
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
