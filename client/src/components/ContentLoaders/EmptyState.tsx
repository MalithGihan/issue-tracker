import { Link } from "react-router-dom";

type Props = {
  title: string;
  message?: string;
  actionLabel?: string;
  actionTo?: string;
};

export default function EmptyState({ title, message, actionLabel, actionTo }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center">
      <div className="text-lg font-semibold">{title}</div>
      {message && <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{message}</div>}

      {actionLabel && actionTo && (
        <div className="mt-4">
          <Link className="inline-flex rounded-lg border px-3 py-2 text-sm" to={actionTo}>
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
