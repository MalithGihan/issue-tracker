import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Mail, LogIn, UserPlus } from "lucide-react";

// Navigation items with categories and descriptions
const navItems = [
  {
    name: "Home",
    path: "/",
    category: "Core",
    description: "Overview and analytics"
  },
  {
    name: "Features",
    path: "/features",
    category: "Info",
    description: "Explore capabilities"
  },
  {
    name: "Pricing",
    path: "/pricing",
    category: "Info",
    description: "View plans & pricing"
  },
  {
    name: "Contact",
    path: "/contact",
    icon: Mail,
    category: "Info",
    description: "Get in touch with us"
  }
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navCls = ({ isActive } : any) =>
    `relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg ${
      isActive 
        ? "text-black front-bold bg-black/5" 
        : "text-black/60"
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 font-bold text-lg text-white group"
          >
            <img alt="logo" src="/logo/logo.png" height={25} width={25}/>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem('')}
              >
                <NavLink to={item.path} className={navCls}>
                  {item.name}
                </NavLink>
                
                {/* Tooltip */}
                {hoveredItem === item.path && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-white border rounded-lg shadow-xl whitespace-nowrap animate-fadeIn">
                    <div className="text-xs text-zinc-400 mb-1">{item.category}</div>
                    <div className="text-[10px] text-black/60">{item.description}</div>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-white rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              to="/login" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/5 text-zinc-400 hover:text-black transition-colors duration-200"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link 
              to="/register" 
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-linear-to-r from-cyan-400 to-green-300 text-white hover:scale-102 rounded-lg transform transition-all duration-200 shadow-lg shadow-black-500/20"
            >
              <UserPlus className="w-4 h-4" />
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-zinc-800/50 animate-slideDown">
            {/* Mobile Navigation */}
            <nav className="space-y-1 mb-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-black bg-white/10"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {item.name}
                      <span className="text-xs text-white px-2 py-0.5 bg-zinc-800 rounded">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </NavLink>
              ))}
            </nav>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-2 px-4 pt-4 border-t border-zinc-800/50">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-black transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium  bg-linear-to-r from-cyan-400 to-green-300 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-blue-500/20"
              >
                <UserPlus className="w-4 h-4" />
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 800px;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}