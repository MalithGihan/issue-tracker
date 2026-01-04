import { Link } from "react-router-dom";
import { Inbox, FileQuestion, Search, AlertCircle, Plus } from "lucide-react";

type Props = {
  title: string;
  message?: string;
  actionLabel?: string;
  actionTo?: string;
  icon?: "inbox" | "search" | "question" | "alert" | "plus";
};

export default function EmptyState({ 
  title, 
  message, 
  actionLabel, 
  actionTo,
  icon = "inbox" 
}: Props) {
  const icons = {
    inbox: Inbox,
    search: Search,
    question: FileQuestion,
    alert: AlertCircle,
    plus: Plus
  };

  const Icon = icons[icon];

  return (
    <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
      <div className="mx-auto w-fit rounded-full bg-zinc-200 p-4">
        <Icon size={32} className="text-zinc-500" strokeWidth={1.5} />
      </div>
      
      <h3 className="mt-4 text-lg font-semibold text-zinc-900">{title}</h3>
      
      {message && (
        <p className="mt-2 text-sm text-zinc-600 max-w-md mx-auto">
          {message}
        </p>
      )}

      {actionLabel && actionTo && (
        <div className="mt-6">
          <Link 
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
            to={actionTo}
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}