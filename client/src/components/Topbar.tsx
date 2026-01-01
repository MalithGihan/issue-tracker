import { useTheme } from "../theme/ThemeProvider";

export default function Topbar() {
  const { theme, toggle } = useTheme();

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
      <div className="text-sm font-medium">Dashboard</div>

      <button
        onClick={toggle}
        className="text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>
    </div>
  );
}
