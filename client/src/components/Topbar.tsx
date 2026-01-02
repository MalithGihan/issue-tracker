import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/auth/authApi";
import { useTheme } from "../theme/ThemeProvider";

export default function Topbar({ userId }: { userId: string }) {
  const nav = useNavigate();
  const { theme, toggle } = useTheme();
  const [logout, { isLoading }] = useLogoutMutation();

  async function onLogout() {
    await logout();
    nav("/", { replace: true });
  }

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
      <div className="text-sm font-medium">Dashboard</div>

      <div className="flex items-center gap-2">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          User: {userId.slice(0, 8)}…
        </div>

        <button
          onClick={toggle}
          className="text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>

        <button
          onClick={onLogout}
          disabled={isLoading}
          className="text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
