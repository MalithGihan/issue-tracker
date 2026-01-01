import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const navCls = ({ isActive }: { isActive: boolean }) =>
    `text-sm ${isActive ? "text-white" : "text-zinc-300 hover:text-white"}`;

  return (
   <header className="border-b border-zinc-800">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-semibold">Issue Tracker</Link>

        <nav className="hidden sm:flex items-center gap-5">
          <NavLink to="/features" className={navCls}>Features</NavLink>
          <NavLink to="/pricing" className={navCls}>Pricing</NavLink>
          <NavLink to="/contact" className={navCls}>Contact</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-zinc-300 hover:text-white">
            Login
          </Link>
          <Link to="/register" className="text-sm rounded-xl bg-white text-black px-3 py-2">
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
