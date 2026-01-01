import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="border-b border-zinc-800 p-4">Topbar (later)</div>

      <div className="flex">
        <aside className="w-64 border-r border-zinc-800 p-4">
          Sidebar (later)
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
