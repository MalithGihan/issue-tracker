import type { ReactNode } from "react";
import { useMeQuery } from "../../features/auth/authApi";
import { Navigate } from "react-router-dom";

export default function AuthGate({ children }: { children: (userId: string) => ReactNode }) {
  const { data, isLoading, isError } = useMeQuery();

  if (isLoading) return <div className="p-6">Loading session...</div>;
  if (isError || !data?.ok) return <Navigate to="/login" replace />;

  return <>{children(data.userId)}</>;
}
