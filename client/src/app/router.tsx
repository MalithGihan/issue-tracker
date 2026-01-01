import { createBrowserRouter } from "react-router-dom";
import MarketingLayout from "../layouts/MarketingLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import LandingPage from "../pages/public/LandingPage";
import PlaceholderPage from "../pages/public/PlaceholderPage";
import DashboardHome from "./DashboardHome";

export const router = createBrowserRouter([
  // ✅ Public marketing site
  {
    element: <MarketingLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/features", element: <PlaceholderPage title="Features" /> },
      { path: "/pricing", element: <PlaceholderPage title="Pricing" /> },
      { path: "/contact", element: <PlaceholderPage title="Contact" /> },
      { path: "/login", element: <PlaceholderPage title="Login (next step)" /> },
      { path: "/register", element: <PlaceholderPage title="Register (next step)" /> },
    ],
  },

  // ✅ Protected dashboard area
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
]);
