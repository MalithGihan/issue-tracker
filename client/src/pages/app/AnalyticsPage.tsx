import { Link } from "react-router-dom";
import { useStatsQuery } from "../../features/issues/issuesApi";
import BarChartCard from "../../components/BarChartCard";
import EmptyState from "../../components/ContentLoaders/EmptyState";
import Skeleton from "../../components/ContentLoaders/Skeleton";

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useStatsQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border p-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-4 h-64 w-full" />
        </div>
        <div className="rounded-2xl border p-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-4 h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-3">
        <div>Failed to load stats.</div>
        <button
          className="rounded-lg border px-3 py-2 text-sm"
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

  const statusData = [
    { name: "OPEN", value: Number(byStatus.OPEN ?? 0) },
    { name: "IN_PROGRESS", value: Number(byStatus.IN_PROGRESS ?? 0) },
    { name: "RESOLVED", value: Number(byStatus.RESOLVED ?? 0) },
  ];

  const priorityData = [
    { name: "LOW", value: Number(byPriority.LOW ?? 0) },
    { name: "MEDIUM", value: Number(byPriority.MEDIUM ?? 0) },
    { name: "HIGH", value: Number(byPriority.HIGH ?? 0) },
  ];

  if (!ok) return <div>Stats unavailable.</div>;

  const hasAny =
    statusData.some((x) => x.value > 0) ||
    priorityData.some((x) => x.value > 0) ||
    recent.length > 0;

  if (!hasAny) {
    return (
      <EmptyState
        title="No analytics yet"
        message="Create a few issues to see charts and recent activity."
        actionLabel="Create issue"
        actionTo="/app/issues/new"
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Analytics</h2>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarChartCard title="Issues by status" data={statusData} />
        <BarChartCard title="Issues by priority" data={priorityData} />
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <div className="text-sm font-semibold mb-3">Recent issues</div>

        {recent.length === 0 ? (
          <div className="text-sm text-zinc-500">No recent issues.</div>
        ) : (
          <div className="space-y-2">
            {recent.map((it) => (
              <Link
                key={it._id}
                to={`/app/issues/${it._id}`}
                className="block rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <div className="font-medium">{it.title}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {it.status} • {it.priority} •{" "}
                  {new Date(it.updatedAt).toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
