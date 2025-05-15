import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer } from "@/components/ui/toast-container";
import { store } from "@/store/store";
import App from "./App";
import "./index.css";

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
import Landing from "./pages/Landing";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <App />,
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
    path:"/",
    element:<Landing/>
  },
  {
    path: "/admin/login",
    element: <Login />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
      <ToastContainer />
    </ThemeProvider>
  </Provider>
);
