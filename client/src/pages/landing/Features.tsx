/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import BottomButtonSet from "../../components/Home/BottomButtonSet";
import {
  ChartArea,
  ChevronLeft,
  ChevronRight,
  DatabaseIcon,
  Earth,
  Lightbulb,
  Lock,
  Rocket,
} from "lucide-react";
import DataCardPage from "../../components/Features/DataCard";
import Guideline from "../../components/Features/Guidline";
import TopTitle from "../../components/Common/TopTitle";

export default function FeaturesPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const features = [
    {
      icon: <Lightbulb />,
      title: "Lightning Fast Performance",
      description:
        "Experience blazing-fast load times and seamless interactions. Our optimized architecture ensures your application runs smoothly, delivering instant responses that keep users engaged and productive.",
      stats: "10x faster",
    },
    {
      icon: <DatabaseIcon />,
      title: "Beautiful Design System",
      description:
        "A comprehensive, modern design language that adapts to your brand. Built with accessibility in mind, every component is crafted to provide an exceptional user experience across all devices and screen sizes.",
      stats: "100+ components",
    },
    {
      icon: <Lock />,
      title: "Enterprise-Grade Security",
      description:
        "Your data's safety is our top priority. With end-to-end encryption, regular security audits, and compliance with industry standards, you can trust that your information is always protected.",
      stats: "99.9% uptime",
    },
    {
      icon: <Rocket />,
      title: "Seamless Integration",
      description:
        "Connect with your favorite tools effortlessly. Our robust API and pre-built integrations make it simple to incorporate into your existing workflow, saving time and reducing complexity.",
      stats: "50+ integrations",
    },
    {
      icon: <ChartArea />,
      title: "Advanced Analytics",
      description:
        "Make data-driven decisions with powerful insights. Track key metrics, visualize trends, and understand user behavior with our comprehensive analytics dashboard that turns data into actionable intelligence.",
      stats: "Real-time data",
    },
    {
      icon: <Earth />,
      title: "Global Scalability",
      description:
        "Built to grow with your business. Our cloud infrastructure automatically scales to handle millions of users worldwide, ensuring consistent performance no matter where your audience is located.",
      stats: "150+ countries",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.12), transparent 80%)`,
        }}
      />

      <div className="relative z-30 max-w-7xl mx-auto px-6 pt-20">
        <TopTitle
          title="Powerful Features"
          subTitle="Everything you need to build, scale, and succeed"
          description="Discover the tools and capabilities that set us apart. From performance to security, we've thought of everything."
        />

        <div className="mt-20 relative">
          <button
            onClick={() => scroll("left")}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-50 
    bg-white/10 backdrop-blur-sm p-3 rounded-full shadow-lg 
    border border-gray-200 hover:bg-cyan-50 hover:border-cyan-300 
    transition-all duration-300 ${
      canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={() => scroll("right")}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-50 
    bg-white/10 backdrop-blur-sm p-3 rounded-full shadow-lg 
    border border-gray-200 hover:bg-cyan-50 hover:border-cyan-300 
    transition-all duration-300 ${
      canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 mx-2 my-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {features.map((feature, index) => (
              <DataCardPage
                icon={feature.icon}
                index={index}
                stats={feature.stats}
                description={feature.description}
                title={feature.title}
              />
            ))}
          </div>
        </div>

        <Guideline />

        <BottomButtonSet
          topic={"Ready to get started?"}
          description={"Join thousands of users who trust our platform"}
          button1Title={"Join Now"}
          button2Title={"Start Free Trial"}
        />
      </div>

      {/* Decorative elements */}
      <div className="fixed top-10 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div
        className="fixed bottom-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      />
    </div>
  );
}
