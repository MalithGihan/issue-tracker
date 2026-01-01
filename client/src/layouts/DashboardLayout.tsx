import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import AuthGate from "../components/AuthGate";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <AuthGate>
        {(userId) => (
          <>
            <Topbar userId={userId} />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 p-6">
                <Outlet />
              </main>
            </div>
          </>
        )}
      </AuthGate>
    </div>
  );
}
