import { Outlet } from "react-router-dom";
import { useState } from "react";
import Topbar from "../components/Dashboard/Topbar";
import Sidebar from "../components/Dashboard/Sidebar";
import AuthGate from "../components/Dashboard/AuthGate";

export default function DashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white">
      <AuthGate>
        {(user) => (
          <div className="min-h-screen flex flex-col bg-white text-zinc-900 ">
            <Topbar
              userId={user.id}
              userName={user.name}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />

            <div className="flex flex-1 relative">
              {/* Mobile Sidebar Overlay */}
              {isMenuOpen && (
                <div
                  className="lg:hidden fixed inset-0 bg-black/50 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
              )}

              {/* Sidebar */}
              <div
                className={`
                fixed lg:relative inset-y-0 left-0 z-50
                transform transition-transform duration-300 ease-in-out
                ${
                  isMenuOpen
                    ? "translate-x-0"
                    : "-translate-x-full lg:translate-x-0"
                }
              `}
              >
                <Sidebar />
              </div>

              <main className="flex-1 p-6 bg-white">
                <Outlet />
              </main>
            </div>
          </div>
        )}
      </AuthGate>
    </div>
  );
}
