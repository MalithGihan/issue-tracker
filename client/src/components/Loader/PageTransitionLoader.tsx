import { useEffect, useState } from "react";

export default function PageTransitionLoader({ ms = 350 }) {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    const t = setTimeout(() => setShow(false), ms);
    return () => clearTimeout(t);
  }, [ms]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative mb-8">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-transparent" />
          <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full border-4 border-cyan-400 opacity-20" />
        </div>
        <div className="text-sm text-zinc-400 animate-pulse">Loading…</div>
      </div>
    </div>
  );
}