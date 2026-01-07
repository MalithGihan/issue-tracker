import { CheckCircle2 } from "lucide-react";

type BottomButtonSetProps = {
  topic: string;
  description: string;
  button1Title: string;
  button2Title: string;
};

export default function BottomButtonSet({
  topic,
  description,
  button1Title,
  button2Title,
}: BottomButtonSetProps) {
  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 mb-10">
      <div className="max-w-6xl mx-auto">
        <div className="relative p-12 bg-gray-200/10 backdrop-blur-sm shadow-2xs border border-white/10 rounded-xl overflow-hidden">
          <div className="relative text-center">
            <h2 className="text-2xl sm:text-2xl font-bold mb-4">{topic}</h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto text-sm">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center text-sm justify-center gap-4">
              <button className="group px-8 py-4 bg-linear-to-r from-cyan-400 to-green-300 text-white font-semibold rounded-xl hover:from-cyan-300 hover:to-green-200 transform transition-all duration-200 shadow-lg shadow-cyan-400/20">
                <span className="flex items-center gap-2">
                  {button1Title}
                  <CheckCircle2 className="w-5 h-5" />
                </span>
              </button>

              <button className="px-8 py-4 text-black font-semibold rounded-xl border border-gray-200 hover:bg-black/5 transition-all duration-200">
                {button2Title}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
