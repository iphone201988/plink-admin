import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { 
  Home, Users, Layers, Calendar, Volleyball, Clock, FileText, 
  Star, Bell, Settings, LogOut, ChevronLeft, Menu 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toggleSidebar } from "@/store/slices/uiSlice";
import Logo from "@/assets/logo.png";

export function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useSelector((state: any) => state.ui);

  const sidebarVariants = {
    expanded: { width: "18rem" },
    collapsed: { width: "5rem" }
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5 mr-3" /> },
    { path: "/admin/users", label: "User Management", icon: <Users className="w-5 h-5 mr-3" /> },
    { path: "/admin/groups", label: "Group Management", icon: <Layers className="w-5 h-5 mr-3" /> },
    { path: "/admin/calendar", label: "Calendar", icon: <Calendar className="w-5 h-5 mr-3" /> },
    { path: "/admin/courts", label: "Court Management", icon: <Volleyball className="w-5 h-5 mr-3" /> },
    { path: "/admin/availability", label: "Availability", icon: <Clock className="w-5 h-5 mr-3" /> },
    { path: "/admin/static-pages", label: "Static Pages", icon: <FileText className="w-5 h-5 mr-3" /> },
    { path: "/admin/ratings", label: "Ratings", icon: <Star className="w-5 h-5 mr-3" /> },
    { path: "/admin/notifications", label: "Notifications", icon: <Bell className="w-5 h-5 mr-3" /> },
    { path: "/admin/settings", label: "Settings", icon: <Settings className="w-5 h-5 mr-3" /> }
  ];

  const handleLogout = () => {
    // Implement logout logic here
    navigate("/admin/login");
  };

  return (
    <motion.aside
      className="bg-white dark:bg-gray-800 shadow-lg h-full flex flex-col z-30 sidebar-animation"
      variants={sidebarVariants}
      animate={sidebarCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3 }}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-accent rounded-md p-1">
            <img src={Logo} alt="Logo" className="h-8 w-8" />
          </span>
          {!sidebarCollapsed && <h1 className="text-2xl font-bold text-textDark dark:text-white">Plink</h1>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-textLight hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Sidebar Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-3 ${isActive 
                    ? "text-primary bg-blue-50 dark:bg-blue-900/30 font-medium" 
                    : "text-textDark dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-primary dark:hover:text-white"
                  } rounded-lg transition-colors whitespace-nowrap`
                }
              >
                {item.icon}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-secondary text-primary dark:bg-gray-700">AU</AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && (
            <div>
              <h4 className="text-sm font-semibold text-textDark dark:text-white">Admin User</h4>
              <p className="text-xs text-textLight dark:text-gray-400">admin@plink.com</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className={`${sidebarCollapsed ? "" : "ml-auto"} text-textLight hover:text-danger dark:text-gray-400 dark:hover:text-red-400 transition-colors`}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}
