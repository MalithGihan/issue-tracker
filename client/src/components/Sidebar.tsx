import { NavLink } from "react-router-dom";

const Item = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block rounded-lg px-3 py-2 text-sm ${
        isActive
          ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
      }`
    }
    end={to === "/app"}
  >
    {label}
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="min-h-screen w-64 border-r border-zinc-200 dark:border-zinc-800 p-4">
      <div className="mb-3 text-sm font-semibold">Menu</div>
      <div className="space-y-1">
        <Item to="/app" label="Overview" />
        <Item to="/app/issues" label="Issues" />
        <Item to="/app/issues/new" label="Create Issue" />
        <Item to="/app/analytics" label="Analytics" />
        <Item to="/app/settings" label="Settings" />
      </div>
    </aside>
  );
}
