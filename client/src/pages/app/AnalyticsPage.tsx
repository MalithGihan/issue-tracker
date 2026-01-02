import { Link } from "react-router-dom";
import { useStatsQuery } from "../../features/issues/issuesApi";
import EmptyState from "../../components/ContentLoaders/EmptyState";
import Skeleton from "../../components/ContentLoaders/Skeleton";
import {
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { DonutChartCard } from "../../components/Charts/DonutChartCard";
import { PieChartCard } from "../../components/Charts/PieChartCard";

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useStatsQuery();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 bg-white p-6"
            >
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-200 bg-white p-6"
            >
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-zinc-200 rounded-lg p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-center max-w-2xl mx-auto">
        <div className="mx-auto w-fit rounded-full bg-red-100 p-3 mb-3">
          <AlertCircle size={24} className="text-red-600" />
        </div>
        <h3 className="font-semibold text-red-900">Failed to load analytics</h3>
        <p className="mt-1 text-sm text-red-700 mb-4">
          There was an error loading your analytics data.
        </p>
        <button
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  const ok = data.ok ?? true;
  const byStatus = (data.byStatus ?? data.stats ?? {}) as Record<
    string,
    number
  >;
  const byPriority = (data.byPriority ?? {}) as Record<string, number>;
  const recent = data.recent ?? [];

  const openCount = Number(byStatus.OPEN ?? 0);
  const inProgressCount = Number(byStatus.IN_PROGRESS ?? 0);
  const resolvedCount = Number(byStatus.RESOLVED ?? 0);
  const totalIssues = openCount + inProgressCount + resolvedCount;

  const statusData = [
    { name: "OPEN", value: openCount },
    { name: "IN_PROGRESS", value: inProgressCount },
    { name: "RESOLVED", value: resolvedCount },
  ];

  const priorityData = [
    { name: "LOW", value: Number(byPriority.LOW ?? 0) },
    { name: "MEDIUM", value: Number(byPriority.MEDIUM ?? 0) },
    { name: "HIGH", value: Number(byPriority.HIGH ?? 0) },
  ];

  if (!ok) {
    return (
      <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-6 text-center max-w-2xl mx-auto">
        <div className="mx-auto w-fit rounded-full bg-orange-100 p-3 mb-3">
          <AlertCircle size={24} className="text-orange-600" />
        </div>
        <h3 className="font-semibold text-orange-900">Stats unavailable</h3>
        <p className="mt-1 text-sm text-orange-700">
          Analytics data is currently unavailable.
        </p>
      </div>
    );
  }

  const hasAny =
    statusData.some((x) => x.value > 0) ||
    priorityData.some((x) => x.value > 0) ||
    recent.length > 0;

  if (!hasAny) {
    return (
      <EmptyState
        icon="question"
        title="No analytics yet"
        message="Create a few issues to see charts and recent activity here."
        actionLabel="Create Issue"
        actionTo="/app/issues/new"
      />
    );
  }

  const resolutionRate =
    totalIssues > 0 ? Math.round((resolvedCount / totalIssues) * 100) : 0;

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Analytics</h1>
          <p className="mt-1 text-xs text-zinc-600">
            Track issue metrics and performance
          </p>
        </div>
        <Link
          to="/app/issues"
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Issues */}
        <div className="rounded-xl border border-zinc-200 bg-linear-to-br from-gray-100 to-white p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-zinc-600">
              Total Issues
            </div>
            <div className="rounded-lg bg-gray-200 p-2">
              <TrendingUp size={20} className="text-black" />
            </div>
          </div>
          <div className="text-3xl font-bold text-zinc-900">{totalIssues}</div>
          <div className="mt-2 text-xs text-zinc-600">Across all statuses</div>
        </div>

        {/* Active Issues */}
        <div className="rounded-xl border border-zinc-200 bg-linear-to-br from-gray-100 to-white p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-zinc-600">
              Active Issues
            </div>
            <div className="rounded-lg bg-gray-200 p-2">
              <Activity size={20} className="text-black" />
            </div>
          </div>
          <div className="text-3xl font-bold text-zinc-900">
            {openCount + inProgressCount}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              <AlertCircle size={12} />
              {openCount} Open
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              <Clock size={12} />
              {inProgressCount} In Progress
            </span>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="rounded-xl border border-zinc-200 bg-linear-to-br from-gray-100 to-white p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-zinc-600">
              Resolution Rate
            </div>
            <div className="rounded-lg bg-gray-200 p-2">
              <CheckCircle size={20} className="text-black" />
            </div>
          </div>
          <div className="text-3xl font-bold text-zinc-900">
            {resolutionRate}%
          </div>
          <div className="mt-2 text-xs text-zinc-600">
            {resolvedCount} issues resolved
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DonutChartCard title="Issues by Status" data={statusData} />
        <PieChartCard title="Issues by Priority" data={priorityData} />
      </div>

      {/* Recent Issues Section */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-900">
            Recent Activity
          </h3>
          <Link
            to="/app/issues"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-fit rounded-full bg-zinc-100 p-3 mb-3">
              <Clock size={24} className="text-zinc-400" />
            </div>
            <p className="text-sm text-zinc-600">No recent issues to display</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((it) => {
              const getStatusColor = (status: string) => {
                if (status === "OPEN") return "bg-orange-100 text-orange-700";
                if (status === "IN_PROGRESS")
                  return "bg-blue-100 text-blue-700";
                if (status === "RESOLVED") return "bg-green-100 text-green-700";
                return "bg-zinc-100 text-zinc-700";
              };

              const getPriorityColor = (priority: string) => {
                if (priority === "HIGH") return "bg-red-100 text-red-700";
                if (priority === "MEDIUM")
                  return "bg-yellow-100 text-yellow-700";
                if (priority === "LOW") return "bg-zinc-100 text-zinc-600";
                return "bg-zinc-100 text-zinc-700";
              };

              return (
                <Link
                  key={it._id}
                  to={`/app/issues/${it._id}`}
                  className="block rounded-lg border border-zinc-200 p-4 hover:border-zinc-900 hover:bg-zinc-50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-zinc-900 group-hover:text-zinc-900 truncate">
                        {it.title}
                      </div>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            it.status
                          )}`}
                        >
                          {it.status === "OPEN" && <AlertCircle size={12} />}
                          {it.status === "IN_PROGRESS" && <Clock size={12} />}
                          {it.status === "RESOLVED" && (
                            <CheckCircle size={12} />
                          )}
                          {it.status.replace("_", " ")}
                        </span>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                            it.priority
                          )}`}
                        >
                          {it.priority}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {new Date(it.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0 mt-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
