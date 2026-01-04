import { Moon, Sun, LogOut, User, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../features/auth/authApi";
import { useTheme } from "../../theme/useTheme";
import { useDispatch } from "react-redux";
import { baseApi } from "../../app/baseApi";

interface TopbarProps {
  userId: string;
  userName: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export default function Topbar({
  userName,
  isMenuOpen,
  setIsMenuOpen,
}: TopbarProps) {
  const nav = useNavigate();
  const { theme, toggle } = useTheme();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  async function onLogout() {
    await logout();
    dispatch(baseApi.util.resetApiState());
    nav("/", { replace: true });
  }

  const onToggle = () => {
    toggle();
  };

  return (
    <div className="border-b border-zinc-200  bg-white  px-4 py-3 flex items-center justify-between">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden p-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex flex-row items-center gap-2 lg:flex-none ">
        <img
          src={
            theme === "dark"
              ? "../../../public/logo/logo_white.png"
              : "../../../public/logo/logo.png"
          }
          alt="logo"
          width={15}
          height={15}
        />
        <div
          className={`text-sm font-semibold ${
            theme === "dark"
              ? "bg-linear-to-r from-cyan-400 to-green-300 bg-clip-text text-transparent"
              : "text-black"
          }`}
        >
          Issue Tracker
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-8">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-200 ">
          <User size={14} className="text-black " />
          <span className="text-xs font-medium text-black/60 ">{userName}</span>
        </div>
        <button
          onClick={onToggle}
          className="relative inline-flex items-center h-3 w-10 rounded-full bg-zinc-200  transition-colors duration-300 focus:outline-none focus:ring-offset-2"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label="Toggle theme"
        >
          <span
            className={`${
              theme === "dark" ? "translate-x-5" : "translate-x-0"
            } inline-flex items-center justify-center h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out`}
          >
            {theme === "dark" ? (
              <Moon size={14} className="text-black" />
            ) : (
              <Sun size={14} className="text-yellow-500" />
            )}
          </span>
        </button>
        <button
          onClick={onLogout}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm font-semibold px-3 py-2 text-black hover:text-red-600  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut size={16} />
              <span>Logout</span>
            </>
          )}
        </button>
      </div>

      <div className="lg:hidden flex items-center gap-2">
        <button
          onClick={onToggle}
          className="p-2 text-black hover:bg-gray-100 rounded-lg transition-colors"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button
          onClick={onLogout}
          disabled={isLoading}
          className="p-2 text-black hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Logout"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <LogOut size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
