import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../features/auth/authApi";

export default function RegisterPage() {
  const nav = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const r = await register({ email, password });
    if ("error" in r) return alert("Register failed");

    // after register, go to dashboard
    nav("/app", { replace: true });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="text-lg font-semibold">Create account</div>

      <input
        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      <input
        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3"
        placeholder="Password (min 8 chars)"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />

      <button
        disabled={isLoading}
        className="w-full rounded-xl bg-black text-white dark:bg-white dark:text-black p-3"
      >
        {isLoading ? "Loading..." : "Sign up"}
      </button>

      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link className="text-black dark:text-white underline" to="/login">
          Login
        </Link>
      </div>
    </form>
  );
}

