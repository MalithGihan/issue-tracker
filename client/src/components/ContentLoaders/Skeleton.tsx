

export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-md bg-zinc-200",
        "before:absolute before:inset-0",
        "before:-translate-x-full",
        "before:animate-[shimmer_2s_infinite]",
        "before:bg-linear-to-r",
        "before:from-transparent before:via-white/60 before:to-transparent",
        className,
      ].join(" ")}
    />
  );
}
