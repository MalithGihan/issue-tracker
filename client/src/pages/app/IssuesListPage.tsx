import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useListIssuesQuery } from "../../features/issues/issuesApi";
import { useDebouncedValue } from "../../lib/useDebouncedValue";
import Skeleton from "../../components/loading/Skeleton";
import EmptyState from "../../components/loading/EmptyState";

export default function IssuesListPage() {
  const [sp, setSp] = useSearchParams();

  const qFromUrl = sp.get("q") || "";
  const [qInput, setQInput] = useState(qFromUrl);

  // keep input updated if user navigates back/forward
  useEffect(() => {
    setQInput(qFromUrl);
  }, [qFromUrl]);

  const qDebounced = useDebouncedValue(qInput, 400);

  const status = sp.get("status") || "";
  const priority = sp.get("priority") || "";
  const page = Number(sp.get("page") || "1");
  const limit = Number(sp.get("limit") || "10");

  const params = useMemo(
    () => ({
      q: qDebounced.trim() ? qDebounced.trim() : undefined,
      status: status || undefined,
      priority: priority || undefined,
      page,
      limit,
    }),
    [qDebounced, status, priority, page, limit]
  );

  useEffect(() => {
    const next = new URLSearchParams(sp);

    const cleaned = qDebounced.trim();
    if (!cleaned) next.delete("q");
    else next.set("q", cleaned);

    next.set("page", "1");
    setSp(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qDebounced]);

  const { data, isLoading, isError } = useListIssuesQuery(params);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp);
    if (!value) next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.set("page", "1"); // reset page when filters change
    setSp(next);
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-9 w-24" />
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <Skeleton className="h-10 w-full md:w-72" />
          <Skeleton className="h-10 w-full md:w-48" />
          <Skeleton className="h-10 w-full md:w-48" />
        </div>

        <div className="rounded-xl border overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-3 border-b">
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.ok) return <div>Failed to load issues.</div>;

  const meta = data.meta;

  if (data.issues.length === 0) {
    return (
      <EmptyState
        title="No issues found"
        message="Try changing filters or create a new issue."
        actionLabel="Create issue"
        actionTo="/app/issues/new"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Issues</h2>
        <Link
          to="/app/issues/new"
          className="rounded-lg border px-3 py-2 text-sm"
        >
          New Issue
        </Link>
      </div>

      <div className="flex flex-col gap-2 md:flex-row">
        <input
          className="rounded-lg border p-2 text-sm bg-transparent"
          placeholder="Search..."
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
        />
        <select
          className="rounded-lg border p-2 text-sm bg-transparent"
          value={status}
          onChange={(e) => setParam("status", e.target.value)}
        >
          <option value="">All status</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
        <select
          className="rounded-lg border p-2 text-sm bg-transparent"
          value={priority}
          onChange={(e) => setParam("priority", e.target.value)}
        >
          <option value="">All priority</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-3 text-xs font-semibold border-b">
          <div className="col-span-5">Title</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Updated</div>
        </div>

        {data.issues.map((it) => (
          <Link
            key={it._id}
            to={`/app/issues/${it._id}`}
            className="grid grid-cols-12 gap-2 p-3 text-sm border-b hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <div className="col-span-5">{it.title}</div>
            <div className="col-span-3">{it.status}</div>
            <div className="col-span-2">{it.priority}</div>
            <div className="col-span-2">
              {new Date(it.updatedAt).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>

      {meta && (
        <div className="flex items-center gap-2 text-sm">
          <button
            className="rounded-lg border px-3 py-1 disabled:opacity-50"
            disabled={meta.page <= 1}
            onClick={() => setParam("page", String(meta.page - 1))}
          >
            Prev
          </button>
          <div>
            Page {meta.page} / {meta.pages}
          </div>
          <button
            className="rounded-lg border px-3 py-1 disabled:opacity-50"
            disabled={meta.page >= meta.pages}
            onClick={() => setParam("page", String(meta.page + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
