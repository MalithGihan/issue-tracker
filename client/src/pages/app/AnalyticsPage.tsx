import { useStatsQuery } from "../../features/issues/issuesApi";

export default function AnalyticsPage() {
  const { data, isLoading } = useStatsQuery();

  if (isLoading) return <div>Loading stats...</div>;
  if (!data?.ok) return <div>Failed to load stats.</div>;

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Analytics</h2>
      <pre className="rounded-lg border p-3 text-sm text-white overflow-auto">
        {JSON.stringify(data.stats, null, 2)}
      </pre>
    </div>
  );
}
