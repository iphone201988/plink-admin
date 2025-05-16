import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import UserManagement from "@/pages/UserManagement";
import GroupManagement from "@/pages/GroupManagement";
import Calendar from "@/pages/Calendar";
import CourtManagement from "@/pages/CourtManagement";
import Availability from "@/pages/Availability";
import StaticPages from "@/pages/StaticPages";
import Ratings from "@/pages/Ratings";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import PrivateRoute from "@/components/PrivateRoute";
import Landing from "@/pages/Landing";
import PublicRoute from "@/components/PublicRoute";
import App from "@/App";


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
        element: <Dashboard />
      },
      {
        path: "users",
        element: <UserManagement />
      },
      {
        path: "groups",
        element: <GroupManagement />
      },
      {
        path: "calendar",
        element: <Calendar />
      },
      {
        path: "courts",
        element: <CourtManagement />
      },
      {
        path: "availability",
        element: <Availability />
      },
      {
        path: "static-pages",
        element: <StaticPages />
      },
      {
        path: "ratings",
        element: <Ratings />
      },
      {
        path: "notifications",
        element: <Notifications />
      },
      {
        path: "settings",
        element: <Settings />
      }
    ]
  },
  {
    path: "/",
    element:
      (
        <PublicRoute>
          <Landing />
        </PublicRoute>
      )
  },
  {
    path: "/admin/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: "*",
    element: <NotFound />
  }
]);


export default router;