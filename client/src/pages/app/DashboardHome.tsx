import { Link } from "react-router-dom";
import { useStatsQuery } from "../../features/issues/issuesApi";
import Skeleton from "../../components/ContentLoaders/Skeleton";
import { TrendingUp, Clock, CheckCircle, AlertCircle, Plus, Eye, BarChart3 } from "lucide-react";

function StatCard({ 
  label, 
  value, 
  icon: Icon,
  color = "black"
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
  const { data, isLoading, isError, refetch } = useStatsQuery();

  const ok = data ? data.ok ?? true : false;
  const stats = (data?.stats ?? data?.byStatus ?? {}) as Record<string, number>;
  const open = Number(stats?.OPEN ?? 0);
  const inProgress = Number(stats?.IN_PROGRESS ?? 0);
  const resolved = Number(stats?.RESOLVED ?? 0);
  const total = open + inProgress + resolved;

  return (
    <div className="space-y-8 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-black">Overview</h1>
          <p className="mt-1 text-xs text-zinc-600">Track and manage your issues at a glance</p>
        </div>
        <Link 
          to="/app/issues" 
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
        >
          <Eye size={16} />
          View All Issues
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
              <h3 className="font-semibold text-red-900">Failed to load statistics</h3>
              <p className="mt-1 text-xs text-red-700">There was an error loading your dashboard data. Please try again.</p>
              <button
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                onClick={() => refetch()}
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
            <StatCard 
              label="Total Issues" 
              value={total} 
              icon={TrendingUp}
            />
            <StatCard 
              label="Open" 
              value={open} 
              icon={AlertCircle}
            />
            <StatCard 
              label="In Progress" 
              value={inProgress} 
              icon={Clock}
            />
            <StatCard 
              label="Resolved" 
              value={resolved} 
              icon={CheckCircle}
            />
          </div>

          {/* Progress Bar */}
          {total > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-900">Issue Progress</h3>
                  <span className="text-sm text-zinc-600">
                    {resolved} of {total} resolved ({Math.round((resolved / total) * 100)}%)
                  </span>
                </div>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-zinc-100">
                <div 
                  className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${(resolved / total) * 100}%` }}
                />
                <div 
                  className="absolute h-full bg-purple-500 transition-all duration-500"
                  style={{ 
                    left: `${(resolved / total) * 100}%`,
                    width: `${(inProgress / total) * 100}%` 
                  }}
                />
              </div>
              <div className="mt-3 flex items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-zinc-600">Resolved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-zinc-600">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-zinc-200" />
                  <span className="text-zinc-600">Open</span>
                </div>
              </div>
            </div>
          )}

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
    </div>
  );
}