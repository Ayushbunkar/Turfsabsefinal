import React from "react";
import { motion } from "framer-motion";
import {
  Home,
  Flag,
  Calendar,
  BarChart3,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Bell,
  Moon,
  Sun,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard/admin" },
  { icon: Flag, label: "My Turfs", path: "/dashboard/admin/turfs" },
  { icon: Calendar, label: "Bookings", path: "/dashboard/admin/my-bookings" },
  { icon: BarChart3, label: "Analytics & Revenue", path: "/dashboard/admin/analytics" },
  { icon: User, label: "Profile", path: "/dashboard/admin/profile" },
  { icon: Bell, label: "Notifications", path: "/dashboard/admin/notifications" },
  { icon: Settings, label: "Settings", path: "/dashboard/admin/settings" },
  { icon: HelpCircle, label: "Help & Support", path: "/dashboard/admin/help" },
];

const AdminSidebar = ({ onToggleDark, darkMode = false, isMobileOpen = false }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Use AuthContext logout and navigate to login route
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 z-40 w-64 bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-800
         transform transition-transform duration-300 ease-in-out h-screen flex flex-col min-h-0
         ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} lg:block`}
    >
      {/* Header */}
  <div className="flex items-center justify-between p-7 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-semibold">
            {user?.name?.[0]?.toUpperCase() || "T"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {user?.name || "Turf Admin"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
        </div>
      </div>

    {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0 sidebar-nav scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {menuItems.map(({ icon: Icon, label, path }, idx) => (
          <NavLink
            key={idx}
            to={path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-green-600/10 dark:bg-green-900/20 text-green-500 dark:text-green-300 border-r-2 border-green-500"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`
            }
            aria-current={({ isActive }) => (isActive ? "page" : undefined)}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

    {/* Footer Actions (fixed at bottom) */}
      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700 bg-transparent flex-shrink-0">
        <button
          type="button"
          onClick={onToggleDark}
          aria-pressed={darkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400/30"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Logout"
          className="flex items-center space-x-3 w-full mt-2 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400/25"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
