import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Shield, BarChart3, Settings, Bell,
  LogOut, ChevronLeft, ChevronRight, UserCheck, Building,
  Activity, DollarSign, Database, Mail, HelpCircle
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard/superadmin", description: "Overview & Analytics" },
  { title: "User Management", icon: Users, path: "/dashboard/superadmin/users", description: "Manage all users" },
  { title: "Turf Admin Management", icon: Shield, path: "/dashboard/superadmin/turf-admins", description: "Manage turf administrators" },
  { title: "Turfs & Venues", icon: Building, path: "/dashboard/superadmin/turfs", description: "Manage all turfs" },
  { title: "Bookings", icon: UserCheck, path: "/dashboard/superadmin/bookings", description: "Monitor all bookings" },
  { title: "Analytics & Reports", icon: BarChart3, path: "/dashboard/superadmin/analytics", description: "System analytics" },
  { title: "Revenue Management", icon: DollarSign, path: "/dashboard/superadmin/revenue", description: "Financial overview" },
  { title: "System Health", icon: Activity, path: "/dashboard/superadmin/system-health", description: "Monitor system status" },
  { title: "Notifications", icon: Bell, path: "/dashboard/superadmin/notifications", description: "System alerts" },
  { title: "Database Management", icon: Database, path: "/dashboard/superadmin/database", description: "Database operations" },
  { title: "Email Management", icon: Mail, path: "/dashboard/superadmin/emails", description: "Email campaigns" },
  { title: "Support & Tickets", icon: HelpCircle, path: "/dashboard/superadmin/support", description: "Customer support" },
  { title: "Settings", icon: Settings, path: "/dashboard/superadmin/settings", description: "System configuration" },
];

const SuperAdminSidebar = ({ isMobileOpen = false, onMobileClose = () => {} }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarVariants = { expanded: { width: "320px" }, collapsed: { width: "80px" } };
  const itemVariants = { expanded: { opacity: 1, x: 0 }, collapsed: { opacity: 0, x: -10 } };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white fixed left-0 z-40 shadow-2xl flex flex-col overflow-hidden min-h-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} lg:block h-screen`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Super Admin</h1>
              <p className="text-xs text-slate-400">TurfOwn Platform</p>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-slate-700 rounded-lg">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-700 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold">{user?.name?.charAt(0) || "S"}</span>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "Super Admin"}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email || "admin@turfown.com"}</p>
            <div className="flex items-center mt-1 text-xs text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>Online
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {menuItems.map(({ icon: Icon, title, path, description }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${isActive ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <motion.div variants={itemVariants} animate={collapsed ? "collapsed" : "expanded"} className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{title}</p>
                <p className="text-xs text-slate-400 truncate">{description}</p>
              </motion.div>
            )}
            {collapsed && (
              <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                {title}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

  {/* Footer */}
  <div className="mt-auto p-4 border-t border-slate-700 flex-shrink-0">
        {!collapsed && (
          <div className="text-xs text-slate-400">
            <div className="flex justify-between">
              <span>System Status</span>
              <span className="text-green-400 flex items-center gap-1"><div className="w-2 h-2 bg-green-400 rounded-full"></div>Healthy</span>
            </div>
            <div className="flex justify-between"><span>Server Load</span><span>23%</span></div>
            <div className="flex justify-between"><span>Active Users</span><span>1,247</span></div>
          </div>
        )}
        <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-colors">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
          {collapsed && <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">Logout</div>}
        </button>
      </div>
    </motion.div>
  );
};

export default SuperAdminSidebar;
