import { Navigate } from "react-router-dom";
import { useMeQuery } from "../../features/auth/authApi";
import type { ReactNode } from "react";
import PageTransitionLoader from "../Loader/PageTransitionLoader";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data, isLoading } = useMeQuery();

  if (isLoading) return <PageTransitionLoader />;
  if (!data?.ok) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
