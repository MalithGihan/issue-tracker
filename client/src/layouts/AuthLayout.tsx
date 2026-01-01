import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-xl font-semibold">Issue Tracker</div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
