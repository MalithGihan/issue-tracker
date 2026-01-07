/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

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
  XCircle,
  Tag,
  User2,
  Download,
} from "lucide-react";
import IssueDetailModal from "./IssueDetailModal";
import {
  useListIssuesQuery,
  type IssuePriority,
  type IssueStatus,
} from "../../features/issues/issuesApi";
import { downloadCsv } from "../../lib/csv";

export default function IssuesListPage() {
  const [sp, setSp] = useSearchParams();

  const qFromUrl = sp.get("q") || "";
  const labelFromUrl = sp.get("label") || "";

  const [qInput, setQInput] = useState(qFromUrl);
  const [labelInput, setLabelInput] = useState(labelFromUrl);

  const [openDetails, setOpenDetails] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => setQInput(qFromUrl), [qFromUrl]);
  useEffect(() => setLabelInput(labelFromUrl), [labelFromUrl]);

  const qDebounced = useDebouncedValue(qInput, 400);
  const labelDebounced = useDebouncedValue(labelInput, 300);

  const page = Number(sp.get("page") || "1");
  const limit = Number(sp.get("limit") || "10");

  const statusParam = sp.get("status");
  const priorityParam = sp.get("priority");

  const status =
    statusParam && statusParam !== ""
      ? (statusParam as IssueStatus)
      : undefined;

  const priority =
    priorityParam && priorityParam !== ""
      ? (priorityParam as IssuePriority)
      : undefined;

  const params = useMemo(
    () => ({
      q: qDebounced.trim() ? qDebounced.trim() : undefined,
      label: labelDebounced.trim() ? labelDebounced.trim() : undefined,
      status,
      priority,
      page,
      limit,
    }),
    [qDebounced, labelDebounced, status, priority, page, limit]
  );

  // keep URL in sync (debounced)
  useEffect(() => {
    const next = new URLSearchParams(sp);

    const qClean = qDebounced.trim();
    if (!qClean) next.delete("q");
    else next.set("q", qClean);

    const lClean = labelDebounced.trim();
    if (!lClean) next.delete("label");
    else next.set("label", lClean);

    next.set("page", "1");
    setSp(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qDebounced, labelDebounced]);

  const { data, isLoading, isError } = useListIssuesQuery(params);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp);
    if (!value) next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.set("page", "1");
    setSp(next);
  }

  const getStatusBadge = (s: string) => {
    const styles = {
      OPEN: "bg-orange-100 text-orange-700",
      IN_PROGRESS: "bg-blue-100 text-blue-700",
      RESOLVED: "bg-green-100 text-green-700",
      CLOSED: "bg-zinc-100 text-zinc-700",
    };
    return styles[s as keyof typeof styles] || "bg-zinc-100 text-zinc-700";
  };

  const getPriorityBadge = (p: string) => {
    const styles = {
      LOW: "bg-zinc-100 text-zinc-600",
      MEDIUM: "bg-yellow-100 text-yellow-700",
      HIGH: "bg-red-100 text-red-700",
      URGENT: "bg-purple-100 text-purple-700",
    };
    return styles[p as keyof typeof styles] || "bg-zinc-100 text-zinc-700";
  };

  const statusIcon = (s: string) => {
    if (s === "OPEN") return <AlertCircle size={14} />;
    if (s === "IN_PROGRESS") return <Clock size={14} />;
    if (s === "RESOLVED") return <CheckCircle size={14} />;
    if (s === "CLOSED") return <XCircle size={14} />;
    return null;
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
          <Skeleton className="h-11 w-full sm:w-44" />
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

  const hasFilters =
    Boolean(qInput.trim()) ||
    Boolean(labelInput.trim()) ||
    Boolean(status) ||
    Boolean(priority);

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
        <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            const issues = data?.issues ?? [];

            const rows = issues.map((it: any) => ({
              id: it._id,
              title: it.title,
              status: it.status,
              priority: it.priority,
              label: it.label ?? "",
              assignedTo: it.assignFor?.name ?? "",
              createdBy: it.createdBy?.name ?? "",
              createdAt: it.createdAt,
              updatedAt: it.updatedAt,
            }));

            const stamp = new Date().toISOString().slice(0, 10);
            downloadCsv(`issues-${stamp}.csv`, rows);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition"
        >
          <Download size={15}/>
          Export CSV
        </button>

        <Link
          to="/app/issues/new"
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Issue
        </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {/* q search */}
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

        {/* label filter */}
        <div className="relative w-full sm:w-44">
          <Tag
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            className="w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
            placeholder="Label..."
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
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
          <option value="CLOSED">Closed</option>
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
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {data.issues.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon="search"
            title="No matching issues"
            message="Try a different keyword, or clear filters to see all issues."
            actionLabel="Clear filters"
            actionTo="/app/issues"
          />
        ) : (
          <EmptyState
            icon="plus"
            title="No issues yet"
            message="Create your first issue to start tracking bugs and tasks."
            actionLabel="Create Issue"
            actionTo="/app/issues/new"
          />
        )
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-zinc-50 border-b border-zinc-200">
            <div className="col-span-6 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Title
            </div>
            <div className="col-span-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Status
            </div>
            <div className="col-span-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Priority
            </div>
            <div className="col-span-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Updated
            </div>
          </div>

          {data.issues.map((it: any) => {
            const creatorName = it?.createdBy?.name ?? "Unknown";
            const creatorEmail = it?.createdBy?.email ?? "";
            const assigneeName = it?.assignFor?.name ?? null;
            const label = it?.label ?? null;

            return (
              <button
                key={it._id}
                type="button"
                onClick={() => {
                  setOpenDetails(true);
                  setId(it._id);
                }}
                className="w-full text-left border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition-colors"
              >
                {/* Desktop */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-6">
                    <div className="text-xs font-medium text-zinc-900">
                      {it.title}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <User2 size={12} />
                        {creatorName}
                        {creatorEmail ? (
                          <span className="text-zinc-400">
                            ({creatorEmail})
                          </span>
                        ) : null}
                      </span>

                      {label ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
                          <Tag size={12} />
                          {label}
                        </span>
                      ) : null}

                      {assigneeName ? (
                        <span className="text-zinc-500">
                          • Assigned: {assigneeName}
                        </span>
                      ) : (
                        <span className="text-zinc-400">• Unassigned</span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        it.status
                      )}`}
                    >
                      {statusIcon(it.status)}
                      {String(it.status).replace("_", " ")}
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

                {/* Mobile */}
                <div className="md:hidden px-4 py-4 space-y-2">
                  <div className="font-medium text-zinc-900">{it.title}</div>

                  <div className="text-xs text-zinc-500 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <User2 size={12} />
                      {creatorName}
                    </span>

                    {label ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
                        <Tag size={12} />
                        {label}
                      </span>
                    ) : null}

                    <span className="text-zinc-400">
                      •{" "}
                      {assigneeName
                        ? `Assigned: ${assigneeName}`
                        : "Unassigned"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        it.status
                      )}`}
                    >
                      {statusIcon(it.status)}
                      {String(it.status).replace("_", " ")}
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
            );
          })}
        </div>
      )}

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
