import { createBrowserRouter } from "react-router-dom";
import MarketingLayout from "../layouts/MarketingLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/Dashboard/ProtectedRoute";

import DashboardHome from "../pages/app/DashboardHome";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import IssuesListPage from "../pages/app/IssuesListPage";
import IssueCreatePage from "../pages/app/IssueCreatePage";
import AnalyticsPage from "../pages/app/AnalyticsPage";
import SettingsPage from "../pages/app/SettingsPage";
import IssueEditPage from "../pages/app/IssueEditPage";
import ErrorPage from "../pages/error/ErrorPage";
import NotFoundPage from "../pages/error/NotFoundPage";
import HomePage from "../pages/landing/Home";
import KanbanBoardPage from "../pages/app/KanbanBoardPage";
import FeaturesPage from "../pages/landing/Features";
import Pricing from "../pages/landing/Pricing";
import ContactPage from "../pages/landing/ContactPage";

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/features", element: <FeaturesPage /> },
      { path: "/pricing", element: <Pricing /> },
      { path: "/contact", element: <ContactPage /> },
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
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "issues/:id/edit", element: <IssueEditPage /> },
      { path: "board", element: <KanbanBoardPage /> },
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
  { path: "*", element: <NotFoundPage /> },
]);
