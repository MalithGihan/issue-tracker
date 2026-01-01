import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const err = useRouteError();

  let title = "Something went wrong";
  let message = "Please try again.";

  if (isRouteErrorResponse(err)) {
    title = `Error ${err.status}`;
    message = err.statusText || message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-3">
        <div className="text-xl font-semibold">{title}</div>
        <div className="text-sm text-zinc-600 dark:text-zinc-300">{message}</div>

        <div className="flex gap-2">
          <button
            className="rounded-lg border px-3 py-2 text-sm"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
          <Link className="rounded-lg border px-3 py-2 text-sm" to="/">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
