/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Home,
  ArrowLeft,
  FileQuestion,
  PhoneCall,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authApi";
import { getRtkErrorMessage } from "../../lib/rtkError";
import toast from "react-hot-toast";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: true,

    onSubmit: async (values, helpers) => {
      try {
        const payload = {
          email: values.email.trim().toLowerCase(),
          password: values.password,
        };

        await login(payload).unwrap();

        toast.success("Logged in");
        nav("/app", { replace: true });
      } catch (err) {
        toast.error(getRtkErrorMessage(err, "Login failed"));
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.15), transparent 80%)`,
        }}
      />

      <div className="w-full max-w-md">
        <Link to="/" className="absolute top-8 left-4 md:left-8 ">
          <button className="group flex items-center px-3 py-2 border-2 text-sm border-gray-100 text-black font-semibold rounded-xl hover:bg-black/5 hover:border-gray-200 transition-all duration-200">
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 hidden md:inline-block opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              <Home className="w-4 h-4" />
              Home
            </span>
          </button>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <img src="/logo/logo.png" alt="logo" width={40} height={40} />
          </div>
          <h1 className="text-xl font-bold bg-linear-to-r from-cyan-400 to-green-300 bg-clip-text text-transparent mb-2">
            Welcome back
          </h1>
          <p className="text-zinc-500">Enter your credentials to continue</p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700"
            >
              Email
            </label>
            <div className="relative mt-2">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Mail size={18} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                className={`w-full pl-10 pr-4 py-1 md:py-3 rounded-md md:rounded-xl border ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-zinc-200 focus:ring-zinc-900"
                } bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                placeholder="you@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle size={14} />
                <span>{String(formik.errors.email)}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-700"
              >
                Password
              </label>
              <button
                type="button"
                className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Lock size={18} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`w-full pl-10 pr-12 py-1 md:py-3 rounded-md md:rounded-xl border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-zinc-200 focus:ring-zinc-900"
                } bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle size={14} />
                <span>{String(formik.errors.password)}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={isLoading || formik.isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-2 md:py-3 px-4 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
          >
            {isLoading || formik.isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-zinc-500">
                or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-medium hover:bg-zinc-50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-medium hover:bg-zinc-50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <div className="text-center text-sm text-zinc-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium text-zinc-900 hover:underline"
            >
              Sign up
            </a>
          </div>
        </div>
        <div className="absolute flex flex-row gap-2 bottom-3 md:bottom-8 right-4 md:right-8">
          <button className="group flex items-center px-3 py-3 rounded-full bg-black/5 hover:bg-black/10 hover:border-gray-200 transition-all duration-200">
            <PhoneCall className="w-4 h-4 text-black" />
          </button>
          <button className="group flex items-center px-3 py-3 rounded-full bg-black/5 hover:bg-black/10 hover:border-gray-200 transition-all duration-200">
            <FileQuestion className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
