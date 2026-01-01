import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-3">
        <div className="text-xl font-semibold">404 — Page not found</div>
        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          The page you’re looking for doesn’t exist.
        </div>
        <Link className="inline-flex rounded-lg border px-3 py-2 text-sm" to="/">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
