import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useListIssuesQuery } from "../../features/issues/issuesApi";
import { useDebouncedValue } from "../../lib/useDebouncedValue";
import Skeleton from "../../components/ContentLoaders/Skeleton";
import EmptyState from "../../components/ContentLoaders/EmptyState";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import IssueDetailModal from "./IssueDetailModal";

export default function IssuesListPage() {
  const [sp, setSp] = useSearchParams();

  const qFromUrl = sp.get("q") || "";
  const [qInput, setQInput] = useState(qFromUrl);
  const [openDetails, setOpenDetails] = useState(false);
  const [id, setId] = useState("");

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
    if (key !== "page") next.set("page", "1");
    setSp(next);
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      OPEN: "bg-orange-100 text-orange-700",
      IN_PROGRESS: "bg-blue-100 text-blue-700",
      RESOLVED: "bg-green-100 text-green-700",
    };
    return styles[status as keyof typeof styles] || "bg-zinc-100 text-zinc-700";
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      LOW: "bg-zinc-100 text-zinc-600",
      MEDIUM: "bg-yellow-100 text-yellow-700",
      HIGH: "bg-red-100 text-red-700",
    };
    return (
      styles[priority as keyof typeof styles] || "bg-zinc-100 text-zinc-700"
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-full">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-11 flex-1" />
          <Skeleton className="h-11 w-full sm:w-40" />
          <Skeleton className="h-11 w-full sm:w-40" />
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-4 border-b border-zinc-100 last:border-b-0"
            >
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.ok) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-center">
        <div className="mx-auto w-fit rounded-full bg-red-100 p-3 mb-3">
          <AlertCircle size={24} className="text-red-600" />
        </div>
        <h3 className="font-semibold text-red-900">Failed to load issues</h3>
        <p className="mt-1 text-sm text-red-700">Please try again later.</p>
      </div>
    );
  }

  const meta = data.meta;

  if (data.issues.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="No issues found"
        message="Try changing filters or create a new issue to get started."
        actionLabel="Create Issue"
        actionTo="/app/issues/new"
      />
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Issues</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {meta?.total || 0} total issue{meta?.total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/app/issues/new"
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Issue
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            className="w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
            placeholder="Search issues..."
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all w-full sm:w-40"
          value={status}
          onChange={(e) => setParam("status", e.target.value)}
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <select
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all w-full sm:w-40"
          value={priority}
          onChange={(e) => setParam("priority", e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-zinc-50 border-b border-zinc-200">
          <div className="col-span-5 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
            Title
          </div>
          <div className="col-span-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
            Status
          </div>
          <div className="col-span-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
            Priority
          </div>
          <div className="col-span-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
            Updated
          </div>
        </div>

        {data.issues.map((it) => (
          <button
            key={it._id}
            type="button"
            onClick={() => {
              setOpenDetails(true);
              setId(it._id);
            }}
            className="w-full text-left border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition-colors"
          >
            {/* Desktop Layout */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 items-center">
              <div className="col-span-5 text-xs font-medium text-zinc-900">
                {it.title}
              </div>
              <div className="col-span-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    it.status
                  )}`}
                >
                  {it.status === "OPEN" && <AlertCircle size={14} />}
                  {it.status === "IN_PROGRESS" && <Clock size={14} />}
                  {it.status === "RESOLVED" && <CheckCircle size={14} />}
                  {it.status.replace("_", " ")}
                </span>
              </div>
              <div className="col-span-2">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityBadge(
                    it.priority
                  )}`}
                >
                  {it.priority}
                </span>
              </div>
              <div className="col-span-2 text-sm text-zinc-600">
                {new Date(it.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden px-4 py-4 space-y-2">
              <div className="font-medium text-zinc-900">{it.title}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    it.status
                  )}`}
                >
                  {it.status === "OPEN" && <AlertCircle size={14} />}
                  {it.status === "IN_PROGRESS" && <Clock size={14} />}
                  {it.status === "RESOLVED" && <CheckCircle size={14} />}
                  {it.status.replace("_", " ")}
                </span>
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityBadge(
                    it.priority
                  )}`}
                >
                  {it.priority}
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(it.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {openDetails && (
        <IssueDetailModal id={id} onClose={() => setOpenDetails(false)} />
      )}

      {meta && meta.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-600">
            Showing page {meta.page} of {meta.pages}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={meta.page <= 1}
              onClick={() => setParam("page", String(meta.page - 1))}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={meta.page >= meta.pages}
              onClick={() => setParam("page", String(meta.page + 1))}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
