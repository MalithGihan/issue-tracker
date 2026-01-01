import { createBrowserRouter } from "react-router-dom";
import MarketingLayout from "../layouts/MarketingLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import LandingPage from "../pages/public/LandingPage";
import PlaceholderPage from "../pages/public/PlaceholderPage";
import DashboardHome from "./DashboardHome";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/features", element: <PlaceholderPage title="Features" /> },
      { path: "/pricing", element: <PlaceholderPage title="Pricing" /> },
      { path: "/contact", element: <PlaceholderPage title="Contact" /> },
    ],
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      // later: { path: "issues", element: <IssuesPage /> }, etc.
    ],
  },
  {
  element: <AuthLayout />,
  children: [
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
  ],
},
]);
