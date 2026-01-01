import { Link } from "react-router-dom";
import { useStatsQuery } from "../../features/issues/issuesApi";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <div className="text-sm text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  );
}

export default function DashboardHome() {
  const { data, isLoading, isError, refetch } = useStatsQuery();

  const ok = data ? (data.ok ?? true) : false;
  const stats = (data?.stats ?? data?.byStatus ?? {}) as Record<string, number>;
  const open = Number(stats?.OPEN ?? 0);
  const inProgress = Number(stats?.IN_PROGRESS ?? 0);
  const resolved = Number(stats?.RESOLVED ?? 0);
  const total = open + inProgress + resolved;

  console.log(data)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Overview</h2>
        <Link to="/app/issues" className="text-sm underline">
          View issues
        </Link>
      </div>

      {isLoading && <div className="text-sm text-zinc-500">Loading stats...</div>}

      {(isError || (data && !data.ok)) && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="text-sm">Failed to load stats.</div>
          <button
            className="mt-3 rounded-lg border px-3 py-2 text-sm"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && ok && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total issues" value={total} />
            <StatCard label="Open" value={open} />
            <StatCard label="In progress" value={inProgress} />
            <StatCard label="Resolved" value={resolved} />
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Quick actions
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link className="rounded-lg border px-3 py-2 text-sm" to="/app/issues/new">
                Create issue
              </Link>
              <Link className="rounded-lg border px-3 py-2 text-sm" to="/app/issues?status=OPEN&page=1&limit=10">
                View open
              </Link>
              <Link className="rounded-lg border px-3 py-2 text-sm" to="/app/analytics">
                Analytics
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
