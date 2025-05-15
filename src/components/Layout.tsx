import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { sidebarCollapsed } = useSelector((state: any) => state.ui);
  const dispatch = useDispatch();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin/dashboard") return "Dashboard";
    if (path === "/admin/users") return "User Management";
    if (path === "/admin/groups") return "Group Management";
    if (path === "/admin/calendar") return "Calendar";
    if (path === "/admin/courts") return "Court Management";
    if (path === "/admin/availability") return "Availability";
    if (path === "/admin/static-pages") return "Static Pages";
    if (path === "/admin/ratings") return "Ratings";
    if (path === "/admin/notifications") return "Notifications";
    if (path === "/admin/settings") return "Settings";
    return path.charAt(1).toUpperCase() + path.slice(2).replace("-", " ");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-6 z-50">
        <Button
          variant="outline"
          size="icon"
          className="bg-secondary dark:bg-gray-700 rounded-full shadow-md"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-primary" />
          ) : (
            <Moon className="h-5 w-5 text-primary" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary">
        <motion.div 
          className="container mx-auto px-6 py-8"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-textDark">{getPageTitle()}</h1>
              <p className="text-textLight mt-1">Welcome back, Admin! Here's what's happening.</p>
            </div>
          </div>

          {/* Page Content */}
          {children}
        </motion.div>
      </main>
    </div>
  );
}
