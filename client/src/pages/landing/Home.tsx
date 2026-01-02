/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Users,
  Shield,
  Rocket,
  Github,
} from "lucide-react";
import { AnimatedCounter } from "../../components/Home/AnimationCounter";

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Track and resolve issues in real-time with blazing fast performance",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work seamlessly with your team on projects and workflows",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get insights with powerful analytics and reporting tools",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security to keep your data safe and compliant",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users" , suffix: '+'},
    { number: "99.9%", label: "Uptime" , suffix: '%'},
    { number: "50K+", label: "Issues Resolved" , suffix: '+'},
    { number: "24/7", label: "Support" , suffix: '/7' },
  ];

  return (
    <div className="min-h-screen mx-auto bg-white text-black overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.15), transparent 80%)`,
        }}
      />

      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-pulse-slow-delayed" />
        </div>

        <div className="relative flex flex-col justify-center z-10 max-w-6xl mx-auto text-center animate-fadeIn items-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-slideUp">
            <span className="bg-linear-to-r from-black via-cyan-400 to-green-300 bg-clip-text text-transparent">
              Issue Tracking
            </span>
            <br />
            <span className="text-black">Reimagined</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 mb-12 max-w-2xl mx-auto animate-slideUp-delayed">
            Streamline your workflow with powerful issue tracking built for
            modern teams. Fast, intuitive, and designed to scale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideUp-more-delayed text-sm">
            <button className="group relative px-8 py-4 bg-linear-to-r from-cyan-400 to-green-300 text-white font-semibold rounded-xl hover:from-cyan-300 hover:to-green-200 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-cyan-400/20">
              <span className="flex items-center gap-2">
                Get Started
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </button>

            <button className="group px-8 py-4 border-2 border-gray-100 text-black font-semibold rounded-xl hover:bg-white/5 hover:border-white/30 transition-all duration-200">
              <span className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                View on GitHub
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-10 my-20">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-8 md:gap-10">
                <div
                  className="cursor-pointer flex flex-col min-w-30 text-center"
                >
                  <div className="text-2xl sm:text-4xl font-bold bg-linear-to-r from-cyan-400 to-green-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
                    <AnimatedCounter
                      end={stat.number}
                      duration={2000}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-sm text-zinc-500 mt-2">{stat.label}</div>
                </div>

                {index < stats.length - 1 && (
                  <div className="hidden md:block w-px h-16 bg-linear-to-b from-transparent via-zinc-700 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 md:bottom-26 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-black/20 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-black/40 rounded-full" />
          </div>
        </div>
      </section>

      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-start mb-20">
            <h2 className="text-xl sm:text-3xl font-bold mb-4">
              Built for{" "}
              <span className="bg-linear-to-r from-cyan-400 to-green-300 bg-clip-text text-transparent">
                Performance
              </span>
            </h2>
            <p className="text-zinc-400 text-sm">
              Everything you need to manage issues effectively
            </p>
            <div className="hidden md:block h-px w-full my-4 bg-linear-to-b from-transparent via-black/20 to-transparent" />
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {features.map((feature, index) => (
              <>
                <div
                  key={index}
                  className="relative flex flex-col justify-center items-center p-8 cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-black" />
                    </div>

                    <h3 className="text-md font-semibold mb-2 text-black">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-400 text-sm font-base">
                      {feature.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-black/60 transition-opacity duration-300">
                      <span className="text-sm">Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>

                {index < features.length - 1 && (
                  <div className="hidden md:block w-px self-stretch bg-linear-to-b from-transparent via-black/20 to-transparent" />
                )}
              </>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-12 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative p-12 bg-gray-50 shadow-2xs border border-white/10 rounded-xl overflow-hidden">
            <div className="relative text-center">
              <h2 className="text-2xl sm:text-2xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-zinc-400 mb-8 max-w-xl mx-auto text-sm">
                Join thousands of teams already using Issue Tracker to
                streamline their workflow
              </p>

              <div className="flex flex-col sm:flex-row items-center text-sm justify-center gap-4">
                <button className="group px-8 py-4 bg-linear-to-r from-cyan-400 to-green-300 text-white font-semibold rounded-xl hover:from-cyan-300 hover:to-green-200 transform transition-all duration-200 shadow-lg shadow-cyan-400/20">
                  <span className="flex items-center gap-2">
                    Start Free Trial
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                </button>

                <button className="px-8 py-4 text-black font-semibold rounded-xl border border-gray-200 hover:bg-black/5 transition-all duration-200">
                  Schedule a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slow-delayed {
          animation: pulse-slow-delayed 4s ease-in-out infinite 2s;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-slideUp-delayed {
          animation: slideUp 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-slideUp-more-delayed {
          animation: slideUp 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fadeIn-delayed {
          animation: fadeIn 1s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
