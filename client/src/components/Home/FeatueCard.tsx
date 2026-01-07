import { ArrowRight } from "lucide-react";
import type { ComponentType } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

export default function FeatureCard({
  title,
  description,
  icon: Icon,
}: FeatureCardProps) {
  return (
    <div className="relative flex flex-col justify-center items-center p-4 cursor-pointer">
      <div className="relative">
        <div className="w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
          <Icon className="w-6 h-6 text-black" />
        </div>

        <h3 className="text-md font-semibold mb-2 text-black">{title}</h3>
        <p className="text-zinc-400 text-sm font-base">{description}</p>

        <div className="mt-4 flex items-center gap-2 text-black/60 transition-opacity duration-300">
          <span className="text-sm">Learn more</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </div>
  );
}
