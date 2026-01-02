/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { 
  Zap, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  MessageSquare,
  FileText,
  Shield,
  HelpCircle,
  Rocket,
  Users,
  Briefcase,
  ArrowRight,
  Send
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [hoveredSocial, setHoveredSocial] = useState('');

  const handleSubscribe = (e:any) => {
    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
  };

  const footerSections = [
    {
      title: "Product",
      icon: Rocket,
      links: [
        { name: "Features", href: "#", icon: Zap },
        { name: "Integrations", href: "#", icon: Users },
        { name: "Pricing", href: "#", icon: Briefcase },
        { name: "Changelog", href: "#", icon: FileText }
      ]
    },
    {
      title: "Resources",
      icon: FileText,
      links: [
        { name: "Documentation", href: "#", icon: FileText },
        { name: "API Reference", href: "#", icon: MessageSquare },
        { name: "Guides", href: "#", icon: HelpCircle },
        { name: "Community", href: "#", icon: Users }
      ]
    },
    {
      title: "Company",
      icon: Briefcase,
      links: [
        { name: "About Us", href: "#", icon: Users },
        { name: "Blog", href: "#", icon: FileText },
        { name: "Careers", href: "#", icon: Briefcase },
        { name: "Contact", href: "#", icon: Mail }
      ]
    },
    {
      title: "Legal",
      icon: Shield,
      links: [
        { name: "Privacy Policy", href: "#", icon: Shield },
        { name: "Terms of Service", href: "#", icon: FileText },
        { name: "Cookie Policy", href: "#", icon: FileText },
        { name: "Security", href: "#", icon: Shield }
      ]
    }
  ];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#", color: "cyan" },
    { name: "Github", icon: Github, href: "#", color: "green" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "cyan" },
    { name: "Email", icon: Mail, href: "#", color: "green" }
  ];

  return (
    <footer className="relative border-t border-zinc-800/50 bg-white overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-300/10 rounded-full blur-3xl animate-pulse-slow-delayed"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Section - Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4 group cursor-pointer">
              <img alt="logo" src='../../public/logo/logo.png' height={25} width={25}/>
              <span className="text-base font-bold bg-linear-to-r from-cyan-400 to-green-300 bg-clip-text text-transparent">
                Issue Tracker
              </span>
            </div>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Streamline your workflow with powerful issue tracking. Built for modern teams who value efficiency and collaboration.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  onMouseEnter={() => setHoveredSocial(social.name)}
                  onMouseLeave={() => setHoveredSocial('')}
                  className={`group relative w-10 h-10 rounded-lg bg-gray-100 shadow-xs flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                    social.color === "cyan" ? "hover:border-cyan-400/50" : "hover:border-green-300/50"
                  }`}
                  aria-label={social.name}
                >
                  <social.icon className={`w-4 h-4 text-zinc-400 transition-colors duration-300 ${
                    social.color === "cyan" ? "group-hover:text-cyan-400" : "group-hover:text-green-300"
                  }`} />
                  
                  {hoveredSocial === social.name && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-50 border border-white rounded-lg text-xs text-black/60 whitespace-nowrap animate-fadeIn">
                      {social.name}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-50 border-b border-r border-white rotate-45"></div>
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-2">
            <div className="">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black/70 mb-2">
                    Stay Updated
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Get the latest features, updates, and tips delivered to your inbox.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative group text-sm">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors duration-200" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 bg-white shadow-2xs border border-gray-100 rounded-lg text-black placeholder-zinc-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                    required
                  />
                </div>
                <button
                  onClick={handleSubscribe}
                  className="group gap-2 flex items-center px-3 py-2 text-sm font-medium bg-linear-to-r from-cyan-400 to-green-300 text-white hover:scale-102 rounded-lg transform transition-all duration-200 shadow-lg shadow-black-500/20"
                >
                  Subscribe
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 pb-12 border-b border-zinc-800/50">
          {footerSections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="w-4 h-4 text-black" />
                <h4 className="font-semibold text-black/60 text-sm">
                  {section.title}
                </h4>
              </div>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-black transition-colors duration-200"
                    >
                      <link.icon className="w-3 h-3 opacity-0 group-hover:opacity-100 text-black/50 transition-opacity duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span>© {new Date().getFullYear()} Issue Tracker V1.0</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1 group">
              Status
              <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse-slow"></div>
            </a>
            <a href="#" className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors duration-200 group">
              Support
              <ArrowRight className="inline w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
            </a>
            <a href="#" className="text-sm text-zinc-400 hover:text-green-300 transition-colors duration-200 group">
              Feedback
              <ArrowRight className="inline w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

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

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slow-delayed {
          animation: pulse-slow-delayed 4s ease-in-out infinite 2s;
        }
      `}</style>
    </footer>
  );
}