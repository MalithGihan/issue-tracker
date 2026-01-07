import { useEffect, useState } from "react";

export default function AppBootLoader({
  children,
  ms = 600,
}: {
  children: React.ReactNode;
  ms?: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);

  if (!ready) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-10 w-10 flex items-center justify-center mb-8">
            <img
              alt="logo"
              src="/logo/logo.png"
              height={20}
              width={20}
              className="absolute z-10"
            />
            <div className="absolute inset-0 h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent" />
            <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full border-4 border-cyan-400 opacity-20" />
          </div>
          <div className="text-sm text-zinc-400 animate-pulse">Loading…</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
