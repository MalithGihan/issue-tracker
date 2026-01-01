import { useStatsQuery } from "../../features/issues/issuesApi";
import StatusChart from "../../components/StatusChart";

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useStatsQuery();

  if (isLoading) return <div>Loading stats...</div>;

  if (isError || !data) {
    return (
      <div className="space-y-3">
        <div>Failed to load stats.</div>
        <button className="rounded-lg border px-3 py-2 text-sm" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  // Support both shapes: { stats } or { byStatus } (your backend returns byStatus)
  const raw = (data.stats ?? data.byStatus ?? {}) as Record<string, number>;

  const chartData = [
    { name: "OPEN", value: Number(raw.OPEN ?? 0) },
    { name: "IN_PROGRESS", value: Number(raw.IN_PROGRESS ?? 0) },
    { name: "RESOLVED", value: Number(raw.RESOLVED ?? 0) },
  ];

  const total = chartData.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Analytics</h2>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">Total: {total}</div>
      </div>

      <StatusChart data={chartData} />

      {/* keep a raw dump for debugging (you can remove later) */}
      <pre className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 text-sm overflow-auto">
        {JSON.stringify(raw, null, 2)}
      </pre>
    </div>
  );
}
