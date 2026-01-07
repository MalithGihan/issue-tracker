import type { ComponentType } from "react";

type ContactInfoProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  content: string;
};

export default function ContactInfo({
  icon: Icon,
  title,
  content,
}: ContactInfoProps) {
  return (
    <div className="group relative flex gap-4 items-start">
      <div className="relative w-10 h-10 rounded-xl bg-linear-to-br from-gray-100 to-gray-50 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
        <div className="absolute inset-0 rounded-xl bg-linear-to-br from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Icon className="relative w-4 h-4 text-gray-900 group-hover:text-cyan-600 transition-colors duration-300" />
      </div>
      
      <div className="relative flex-1">
        <h3 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}