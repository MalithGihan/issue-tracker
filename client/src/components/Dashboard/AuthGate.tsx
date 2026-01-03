import { Navigate } from "react-router-dom";
import { useMeQuery } from "../../features/auth/authApi";
import type { ReactNode } from "react";

export default function AuthGate({
  children,
}: {
  children: (user: { id: string; name: string; email: string; organization: string }) => ReactNode;
}) {
  const { data, isLoading, isError } = useMeQuery();

  if (isLoading) return <div className="p-6">Loading session...</div>;
  if (isError || !data?.ok) return <Navigate to="/login" replace />;

  return <>{children(data.user)}</>;
}
