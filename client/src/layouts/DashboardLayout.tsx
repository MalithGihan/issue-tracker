import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Topbar />

      <div className="flex">
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 p-4">
          Sidebar (later)
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
