import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

const KEY = "cookie_consent"; // localStorage key

function setConsent(value: "accepted" | "rejected") {
  localStorage.setItem(KEY, value);

  // Optional: store a non-httpOnly cookie just to demonstrate "consent"
  // (Auth cookies are httpOnly + essential, and do NOT depend on this.)
  document.cookie = `cookie_consent=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
  const v = localStorage.getItem(KEY);
  if (!v) {
    flushSync(() => {
      setOpen(true);
    });
  }
}, []);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950/95 p-4 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-200">
            We use <span className="font-medium">essential cookies</span> to keep you signed in.
            Optional cookies may be used for analytics later.
          </div>

          <div className="flex gap-2">
            <button
              className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
              onClick={() => {
                setConsent("rejected");
                setOpen(false);
              }}
            >
              Reject
            </button>
            <button
              className="rounded-xl bg-white px-3 py-2 text-sm text-black"
              onClick={() => {
                setConsent("accepted");
                setOpen(false);
              }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
