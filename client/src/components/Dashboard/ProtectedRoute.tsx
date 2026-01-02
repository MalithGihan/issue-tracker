import { Navigate } from "react-router-dom";
import { useMeQuery } from "../../features/auth/authApi";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data, isLoading } = useMeQuery();

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!data?.ok) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
