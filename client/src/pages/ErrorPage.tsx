import { AlertCircle, Home, RefreshCw } from "lucide-react";

export default function ErrorPage() {
  // Demo error data - replace with your actual error logic
  const err = { status: 404, statusText: "Page Not Found" };
  
  let title = "Something went wrong";
  let message = "Please try again.";
  let errorCode = null;

  if (err?.status) {
    errorCode = err.status;
    title = `Error ${err.status}`;
    message = err.statusText || message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      

      <div className="relative z-10 w-full max-w-2xl">
        <div className="">
          {/* Error icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          {/* Error code (if available) */}
          {errorCode && (
            <div className="text-center mb-4">
              <span className="text-6xl sm:text-7xl font-bold bg-linear-to-r from-cyan-500 to-green-400 bg-clip-text text-transparent">
                {errorCode}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-xl sm:text-xl font-bold text-black text-center mb-3">
            {title}
          </h1>

          {/* Message */}
          <p className="text-zinc-600 text-sm text-center mb-8 max-w-md mx-auto">
            {message}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
            <button
              onClick={() => window.location.reload()}
              className="group flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-black rounded-xl hover:bg-gray-200 hover:border-gray-400 transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Reload Page
            </button>

            <a
              href="/"
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-zinc-800 transition-all duration-200 shadow-lg"
            >
              <Home className="w-4 h-4" />
              Go Home
            </a>
          </div>

          {/* Additional help text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-zinc-600 text-center">
              If this problem persists, please{" "}
              <a href="#" className="text-cyan-500 hover:text-cyan-600 transition-colors duration-200 font-medium">
                contact support
              </a>
            </p>
          </div>
        </div>

        {/* Common error codes reference */}
        <div className="mt-6 text-center">
          <details className="group">
            <summary className="text-sm text-zinc-500 hover:text-zinc-700 cursor-pointer transition-colors duration-200 inline-flex items-center gap-2">
              Common error codes
              <span className="transform group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <div className="mt-4 p-4 bg-white border-2 border-gray-200 rounded-xl text-left shadow-lg">
              <div className="grid sm:grid-cols-2 gap-3 text-xs text-zinc-600">
                <div><span className="text-black font-semibold">404:</span> Page not found</div>
                <div><span className="text-black font-semibold">500:</span> Server error</div>
                <div><span className="text-black font-semibold">403:</span> Access forbidden</div>
                <div><span className="text-black font-semibold">401:</span> Unauthorized</div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}