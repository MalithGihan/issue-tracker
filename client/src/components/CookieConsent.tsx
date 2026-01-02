/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Cookie, Shield, X, Check } from "lucide-react";

const KEY = "cookie_consent";

function setConsent(value: any) {
  localStorage.setItem(KEY, value);
  document.cookie = `cookie_consent=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem(KEY);
    if (!v) {
      setTimeout(() => setOpen(true), 500);
    }
  }, []);

  const handleClose = (consent: any) => {
    setIsClosing(true);
    setTimeout(() => {
      setConsent(consent);
      setOpen(false);
      setIsClosing(false);
    }, 300);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      <div
        className={`pointer-events-auto w-full transition-all duration-300 ${
          isClosing
            ? "opacity-0 translate-y-8 scale-95"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        <div className="relative w-full rounded-2xl border-2 border-white/10 bg-white shadow-2xl overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>

          {/* Close button */}
          <button
            onClick={() => handleClose("rejected")}
            className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative p-6 sm:p-8">
            {/* Icon and Title */}
            <div className="flex items-start gap-4 mb-4">
              <div className="shrink-0 w-12 h-12 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black mb-2">
                  Cookie Preferences
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  We use{" "}
                  <span className="font-semibold text-black">
                    essential cookies
                  </span>{" "}
                  to keep you signed in and ensure the best experience. Optional
                  cookies may be used for analytics to improve our service.
                </p>
              </div>
            </div>

            {/* Info callout */}
            <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-600">
                  Your privacy matters. Essential cookies are required for
                  authentication and security. You can manage your preferences
                  anytime in settings.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleClose("rejected")}
                className="flex-1 group relative px-6 py-3 rounded-xl border-2 border-gray-100 bg-white text-black font-medium hover:bg-gray-50 hover:border-gray-200 transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  Reject Optional
                </span>
              </button>

              <button
                onClick={() => handleClose("accepted")}
                className="flex-1 group relative px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-zinc-800 transition-all duration-200 overflow-hidden shadow-lg"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  Accept All
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>

            {/* Learn more link */}
            <div className="mt-4 text-center">
              <a
                href="#"
                className="text-xs text-zinc-500 hover:text-black transition-colors duration-200 inline-flex items-center gap-1 group"
              >
                Learn more about our cookies
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="h-1 bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(2rem) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
