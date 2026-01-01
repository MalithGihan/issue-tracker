import { createBrowserRouter } from "react-router-dom";
import MarketingLayout from "../layouts/MarketingLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import LandingPage from "../pages/public/LandingPage";
import PlaceholderPage from "../pages/public/PlaceholderPage";
import DashboardHome from "../pages/app/DashboardHome";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import IssuesListPage from "../pages/app/IssuesListPage";
import IssueCreatePage from "../pages/app/IssueCreatePage";
import IssueDetailPage from "../pages/app/IssueDetailPage";
import AnalyticsPage from "../pages/app/AnalyticsPage";
import SettingsPage from "../pages/app/SettingsPage";
import IssueEditPage from "../pages/app/IssueEditPage";
import ErrorPage from "../pages/ErrorPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/features", element: <PlaceholderPage title="Features" /> },
      { path: "/pricing", element: <PlaceholderPage title="Pricing" /> },
      { path: "/contact", element: <PlaceholderPage title="Contact" /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/app",
    errorElement: <ErrorPage />,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "issues", element: <IssuesListPage /> },
      { path: "issues/new", element: <IssueCreatePage /> },
      { path: "issues/:id", element: <IssueDetailPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "issues/:id/edit", element: <IssueEditPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
