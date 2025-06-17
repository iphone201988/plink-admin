import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import PublicRoute from "@/components/PublicRoute";
import App from "@/App";
import Loader from "@/components/Loader/Loader";
// Lazy-loaded components
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const UserManagement = lazy(() => import("@/pages/UserManagement"));
const GroupManagement = lazy(() => import("@/pages/GroupManagement"));
const Calendar = lazy(() => import("@/pages/Calendar"));
const CourtManagement = lazy(() => import("@/pages/CourtManagement"));
const Availability = lazy(() => import("@/pages/Availability"));
const StaticPages = lazy(() => import("@/pages/StaticPages"));
const Ratings = lazy(() => import("@/pages/Ratings"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const Settings = lazy(() => import("@/pages/Settings"));
const Login = lazy(() => import("@/pages/Login"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Landing = lazy(() => import("@/pages/Landing"));

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      {
        path: "dashboard",
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<Loader />}>
            <UserManagement />
          </Suspense>
        ),
      },
      {
        path: "groups",
        element: (
          <Suspense fallback={<Loader />}>
            <GroupManagement />
          </Suspense>
        ),
      },
      {
        path: "calendar",
        element: (
          <Suspense fallback={<Loader />}>
            <Calendar />
          </Suspense>
        ),
      },
      {
        path: "courts",
        element: (
          <Suspense fallback={<Loader />}>
            <CourtManagement />
          </Suspense>
        ),
      },
      {
        path: "availability",
        element: (
          <Suspense fallback={<Loader />}>
            <Availability />
          </Suspense>
        ),
      },
      {
        path: "static-pages",
        element: (
          <Suspense fallback={<Loader />}>
            <StaticPages />
          </Suspense>
        ),
      },
      {
        path: "ratings",
        element: (
          <Suspense fallback={<Loader />}>
            <Ratings />
          </Suspense>
        ),
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<Loader />}>
            <Notifications />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<Loader />}>
            <Settings />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/g/*",
    element: <Navigate to="/" replace />,
  },
  {
    path: "c/*",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/",
    element: (
      <PublicRoute>
        <Suspense fallback={<Loader />}>
          <Landing />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: "/admin/login",
    element: (
      <PublicRoute>
        <Suspense fallback={<Loader />}>
          <Login />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loader />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router;