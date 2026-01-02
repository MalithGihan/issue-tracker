import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListTodo, Plus, BarChart3, Settings } from "lucide-react";

const Item = ({ 
  to, 
  label, 
  icon: Icon 
}: { 
  to: string; 
  label: string; 
  icon: React.ElementType;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-zinc-900 text-white shadow-sm"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 "
      }`
    }
    end={to === "/app"}
  >
    <Icon size={18} className="shrink-0" />
    <span>{label}</span>
  </NavLink>
);

export default function Sidebar() {
  return (
    <aside className="h-full w-64 border-r border-zinc-200 bg-white flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3">
            Navigation
          </h2>
        </div>
        <nav className="space-y-1">
          <Item to="/app" label="Overview" icon={LayoutDashboard} />
          <Item to="/app/issues" label="Issues" icon={ListTodo} />
          <Item to="/app/issues/new" label="Create Issue" icon={Plus} />
          <Item to="/app/analytics" label="Analytics" icon={BarChart3} />
          <Item to="/app/settings" label="Settings" icon={Settings} />
        </nav>
      </div>
      
      {/* Footer Section */}
      <div className="p-4 border-t border-zinc-200 ">
        <div className="text-xs text-zinc-500 text-center">
          Issue Tracker v1.0
        </div>
      </div>
    </aside>
  );
}