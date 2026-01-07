import { MoreHorizontal } from "lucide-react";


type DataCardProps = {
  index: number;
  icon: React.ReactNode;
  stats: string;
  title: string;
  description: string;
};

export default function DataCardPage({
  index,
  icon,
  description,
  stats,
  title,
}: DataCardProps) {
  return (
    <div
      key={index}
      className={`group relative m-2 p-8 bg-white/10 backdrop-blur-xl border-2 border-cyan-100/50 shadow-xl shadow-cyan-200/20 rounded-xl shrink-0 w-87.5 snap-center hover:border-cyan-300/70 hover:bg-white/30 transition-all duration-500`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="relative z-10">
        <div className="text-black bg-gray-100 p-3 rounded-md mb-5">{icon}</div>

        <div className="inline-block mb-3 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
          {stats}
        </div>

        <h3 className="text-xl font-bold mb-3 pb-2 text-gray-900 transition-colors duration-300 border-b-1 border-black">
          {title}
        </h3>

        <p className="text-gray-600 text-xs leading-relaxed">{description}</p>

        <button className="mt-4 flex items-center text-gray-100 text-xs font-medium hover:text-black transition-all duration-300 gap-1">
          Learn more
          <MoreHorizontal />
        </button>
      </div>
    </div>
  );
}
