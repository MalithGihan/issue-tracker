import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-16">
      <h1 className="text-4xl font-semibold">Track issues. Ship faster.</h1>
      <p className="mt-4 text-zinc-300 max-w-xl">
        A modern issue tracker with secure authentication, filtering, and analytics.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/register" className="rounded-xl bg-white text-black px-4 py-2">
          Get started
        </Link>
        <Link to="/features" className="rounded-xl border border-zinc-700 px-4 py-2 text-zinc-200">
          See features
        </Link>
      </div>
    </div>
  );
}
