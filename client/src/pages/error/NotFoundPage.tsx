import { Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
    

      <div className="relative z-10 w-full max-w-lg animate-fadeIn">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 flex items-center justify-center animate-float">
                <Search className="w-10 h-10 text-black" />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-300 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
          </div>

          <div className="text-center mb-4">
            <span className="text-7xl font-bold bg-linear-to-r from-cyan-500 to-green-400 bg-clip-text text-transparent">
              404
            </span>
          </div>

          <h1 className="text-base font-bold text-black text-center mb-2">
            Page Not Found
          </h1>

          <p className="text-zinc-600 text-center mb-8 text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex justify-center">
            <a
              href="/"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-zinc-800 transition-all duration-200 shadow-lg"
            >
              <Home className="w-4 h-4" />
              Back to Home
              <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-zinc-500 text-center mb-3">
              You might want to:
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <a href="/" className="text-cyan-500 hover:text-cyan-600 transition-colors duration-200">
                Home
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="text-cyan-500 hover:text-cyan-600 transition-colors duration-200">
                Contact Support
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="text-cyan-500 hover:text-cyan-600 transition-colors duration-200">
                Site Map
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}