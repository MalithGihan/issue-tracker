import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authApi";
import toast from "react-hot-toast";
import { getRtkErrorMessage } from "../../lib/rtkError";
import { loginSchema } from "../../features/validators";
import { firstZodError } from "../../lib/zodError";

export default function LoginPage() {
  const nav = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) return toast.error(firstZodError(parsed.error));

    const r = await login(parsed.data);
    if ("error" in r)
      return toast.error(getRtkErrorMessage(r.error, "Login failed"));

    toast.success("Logged in");
    nav("/app", { replace: true });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="text-lg font-semibold">Login</div>

      <input
        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      <input
        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      <button
        disabled={isLoading}
        className="w-full rounded-xl bg-white text-black p-3"
      >
        {isLoading ? "Loading..." : "Login"}
      </button>

      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        No account?{" "}
        <Link className="text-black dark:text-white underline" to="/register">
          Sign up
        </Link>
      </div>
    </form>
  );
}
