/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Construction, Wrench, Hammer, ArrowLeft, Clock } from "lucide-react";

export default function PlaceholderPage({title}:any) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-300/10 rounded-full blur-3xl animate-pulse-slow-delayed" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="relative mb-8 flex justify-center">
          <div 
            className="absolute w-32 h-32 rounded-full border-4 border-dashed border-cyan-400/30"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          <div 
            className="absolute w-24 h-24 rounded-full border-4 border-dashed border-green-300/30"
            style={{ transform: `rotate(${-rotation}deg)` }}
          />
          
          <div className="relative w-20 h-20 bg-linear-to-br from-cyan-400/20 to-green-300/20 backdrop-blur-sm border border-white/10 rounded-2xl flex items-center justify-center animate-float">
            <Construction className="w-10 h-10 text-cyan-400" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-linear-to-r from-cyan-400 via-gray-200 to-green-300 bg-clip-text text-transparent animate-fadeIn">
          {title}
        </h1>
        
        <p className="text-md text-zinc-400 font-semibold mb-8">
          Under Construction
        </p>

        <div className="flex items-center justify-center gap-6 mb-12">
          <div className="group">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300 cursor-pointer">
              <Wrench className="w-6 h-6 text-zinc-400 group-hover:text-cyan-400 transition-colors duration-300" />
            </div>
          </div>
          <div className="group">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300 cursor-pointer">
              <Hammer className="w-6 h-6 text-zinc-400 group-hover:text-green-300 transition-colors duration-300" />
            </div>
          </div>
          <div className="group">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300 cursor-pointer">
              <Clock className="w-6 h-6 text-zinc-400 group-hover:text-cyan-400 transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl mb-8 animate-slideUp">
          <p className="text-sm text-zinc-400 leading-relaxed">
            We're working hard to bring you something amazing. This page is currently being crafted with care and attention to detail. Check back soon!
          </p>
        </div>

        {/* Back button */}
        <button 
          onClick={() => window.history.back()}
          className="group inline-flex items-center gap-2 px-6 py-3 font-semibold bg-white/5 border border-gray-200 text-black rounded-xl hover:bg-white/10 hover:border-black transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Go Back
        </button>

        {/* Progress indicator */}
        <div className="mt-12 ">
          <div className="flex justify-center items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
          <p className="text-xs text-zinc-600">Building something great...</p>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slow-delayed {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slow-delayed {
          animation: pulse-slow-delayed 4s ease-in-out infinite 2s;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}