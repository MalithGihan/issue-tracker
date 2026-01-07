/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  useStatsQuery,
  useListIssuesQuery,
} from "../../features/issues/issuesApi";
import { useMeQuery } from "../../features/auth/authApi";
import Skeleton from "../../components/ContentLoaders/Skeleton";
import IssueDetailModal from "./IssueDetailModal";
import {
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  BarChart3,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  color = "black",
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color?: "black";
}) {
  const colorClasses = {
    black: "bg-gray-200 text-black-600",
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-zinc-600">{label}</div>
          <div className="mt-2 text-3xl font-bold text-zinc-900">{value}</div>
        </div>
        <div className={`rounded-lg p-2 ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  // ✅ current user (supports old {userId} or new {user:{id}})
  const { data: me } = useMeQuery();
  const myId = (me as any)?.user?.id ?? (me as any)?.userId ?? "";

  // ✅ auto refresh when page mounts + on focus/reconnect
  const {
    data,
    isLoading,
    isError,
    refetch: refetchStats,
  } = useStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // ✅ fetch assigned issues (latest 5)
  const assignedArgs = useMemo(
    () => ({
      assignFor: myId || undefined,
      page: 1,
      limit: 5,
      sort: "newest" as const,
    }),
    [myId]
  );

  const {
    data: assigned,
    isLoading: assignedLoading,
    isError: assignedError,
    refetch: refetchAssigned,
  } = useListIssuesQuery(assignedArgs as any, {
    skip: !myId,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // optional: extra refetch on mount
  useEffect(() => {
    refetchStats();
    if (myId) refetchAssigned();
  }, [refetchStats, refetchAssigned, myId]);

  // modal for quick view
  const [openDetails, setOpenDetails] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  const ok = data ? data.ok ?? true : false;
  const stats = (data?.stats ?? data?.byStatus ?? {}) as Record<string, number>;
  const open = Number(stats?.OPEN ?? 0);
  const inProgress = Number(stats?.IN_PROGRESS ?? 0);
  const resolved = Number(stats?.RESOLVED ?? 0);
  const closed = Number(stats?.CLOSED ?? 0);
  const total = open + inProgress + resolved + closed;

  const assignedList = (assigned as any)?.issues ?? [];
  const assignedTotal = Number(
    (assigned as any)?.meta?.total ?? assignedList.length ?? 0
  );

  return (
    <div className="space-y-8 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-black">Overview</h1>
          <p className="mt-1 text-xs text-zinc-600">
            Track and manage your issues at a glance
          </p>
        </div>
        <Link
          to="/app/issues"
          className="inline-flex items-center gap-2 md:rounded-lg rounded-full bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <Eye size={16} />
          <span className="hidden md:inline">View All Issues</span>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 bg-white p-6"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-9 w-16" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {(isError || (data && !data.ok)) && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">
                Failed to load statistics
              </h3>
              <p className="mt-1 text-xs text-red-700">
                There was an error loading your dashboard data. Please try
                again.
              </p>
              <button
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                onClick={() => refetchStats()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {!isLoading && ok && (
        <>
          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Issues" value={total} icon={TrendingUp} />
            <StatCard label="Open" value={open} icon={AlertCircle} />
            <StatCard label="In Progress" value={inProgress} icon={Clock} />
            <StatCard label="Resolved" value={resolved} icon={CheckCircle} />
          </div>

          {/* Assigned to you */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-zinc-900">Assigned to you</h3>
                <p className="mt-1 text-xs text-zinc-600">
                  Latest tasks assigned to your account ({assignedTotal})
                </p>
              </div>

              <Link
                to={
                  myId
                    ? `/app/issues?assignFor=${encodeURIComponent(
                        myId
                      )}&page=1&limit=10`
                    : "/app/issues"
                }
                className="text-xs font-semibold text-black underline"
              >
                View all
              </Link>
            </div>

            {assignedLoading ? (
              <div className="mt-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-zinc-200 p-4"
                  >
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="mt-2 h-3 w-1/3" />
                  </div>
                ))}
              </div>
            ) : assignedError ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Failed to load assigned issues.
                <button
                  className="ml-2 underline font-semibold"
                  onClick={() => refetchAssigned()}
                >
                  Retry
                </button>
              </div>
            ) : assignedList.length === 0 ? (
              <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
                No issues assigned to you yet.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {assignedList.map((it: any) => (
                  <button
                    key={it._id}
                    type="button"
                    onClick={() => {
                      setDetailId(it._id);
                      setOpenDetails(true);
                    }}
                    className="w-full text-left rounded-lg border border-zinc-200 p-4 hover:bg-zinc-50 transition"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-zinc-900 text-sm">
                        {it.title}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {new Date(it.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 border border-zinc-200">
                        {it.status}
                      </span>
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 border border-zinc-200">
                        {it.priority}
                      </span>
                      {it.label ? (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 border border-zinc-200">
                          {it.label}
                        </span>
                      ) : null}
                      {it.createdBy?.name ? (
                        <span className="text-zinc-500">
                          • Created by {it.createdBy.name}
                        </span>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="w-[50%] rounded-xl border border-zinc-200 bg-linear-to-br from-zinc-50 to-white p-6">
            <h3 className="font-semibold text-zinc-900 mb-4">Quick Actions</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                className="flex items-center gap-3 rounded-lg border border-black/10 bg-gray-100 hover:bg-cyan-100 px-4 py-2 text-xs font-semibold text-zinc-900 transition-all"
                to="/app/issues/new"
              >
                <div className="rounded-lg bg-white p-2">
                  <Plus size={15} className="text-black" />
                </div>
                <span>Create Issue</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg border border-black/10 bg-gray-100 hover:bg-cyan-100 px-4 py-2 text-xs font-semibold text-zinc-900 transition-all"
                to="/app/issues?status=OPEN&page=1&limit=10"
              >
                <div className="rounded-lg bg-white p-2">
                  <AlertCircle size={15} className="text-black" />
                </div>
                <span>View Open</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg border border-black/10 bg-gray-100 hover:bg-cyan-100 px-4 py-2 text-xs font-semibold text-zinc-900 transition-all"
                to="/app/analytics"
              >
                <div className="rounded-lg bg-white p-2">
                  <BarChart3 size={15} className="text-black" />
                </div>
                <span>Analytics</span>
              </Link>
            </div>
          </div>
        </>
      )}

      {openDetails && detailId && (
        <IssueDetailModal id={detailId} onClose={() => setOpenDetails(false)} />
      )}
    </div>
  );
}
