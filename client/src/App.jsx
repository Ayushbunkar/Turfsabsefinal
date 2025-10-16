// // ...existing code...
// import React, { Suspense, lazy } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Turfs from "./pages/Turfs";
// import NotFound from "./pages/NotFound";
// import Booking from "./pages/Booking";
// import { SocketProvider } from "./context/SocketContext";
// import Unauthorized from "./pages/unauthorized";
// import UserDashboard from "./pages/Dashboard/Userdashboard/UserDashboard";
// import UserMyBookings from "./pages/Dashboard/Userdashboard/MyBookings";
// import UserProfile from "./pages/Dashboard/Userdashboard/UserProfile";
// import PaymentHistory from "./pages/Dashboard/Userdashboard/UserPayments";
// import Notifications from "./pages/Dashboard/Userdashboard/UserNotifications";
// import Settings from "./pages/Dashboard/Userdashboard/Settings";
// import HelpSupport from "./pages/Dashboard/Userdashboard/HelpSupport";
// import AdminDashboard from "./pages/Dashboard/TurfAdminDashboard/TurfAdminDashboard";
// import MyBookings from "./pages/Dashboard/TurfAdminDashboard/TurfAdminBookings";
// import Profile from "./pages/Dashboard/TurfAdminDashboard/TurfAdminProfile";
// import TurfAdminTurfs from "./pages/Dashboard/TurfAdminDashboard/TurfAdminTurfs";
// import TurfAdminAnalytics from "./pages/Dashboard/TurfAdminDashboard/TurfAdminAnalytics";
// import TurfAdminOverview from "./pages/Dashboard/TurfAdminDashboard/TurfAdminOverview";
// import TurfAdminNotifications from "./pages/Dashboard/TurfAdminDashboard/TurfAdminNotifications";
// import TurfAdminSettings from "./pages/Dashboard/TurfAdminDashboard/TurfAdminSettings";
// import TurfAdminHelp from "./pages/Dashboard/TurfAdminDashboard/TurfAdminHelp";

// const SuperAdminDashboard = lazy(() => import("./pages/Dashboard/superadmin/SuperAdminDashboard.jsx"));
// const SuperAdminAnalytics = lazy(() => import("./pages/Dashboard/superadmin/SuperAdminAnalytics.jsx"));
// const SuperAdminUsers = lazy(() => import("./pages/Dashboard/superadmin/SuperAdminUsers.jsx"));
// const SuperAdminTurfAdmins = lazy(() => import("./pages/Dashboard/superadmin/SuperAdminTurfAdmins.jsx"));
// const SuperAdminTurfs = lazy(() => import("./pages/Dashboard/superadmin/SuperAdminTurfs.jsx"));
// const SuperAdminBookings = lazy(() => import("./pages/Dashboard/superadmin/SuperAdminBookings.jsx"));
// const SuperAdminRevenue = lazy(() => import("./pages/Dashboard/superadmin/SuperAdminRevenue.jsx"));
// const SuperAdminSystemHealth = lazy(() => import("./pages/Dashboard/superadmin/SuperAdminSystemHealth.jsx"));
// const SuperAdminNotifications = lazy(() => import("./pages/Dashboard/superadmin/SuperAdminNotifications.jsx"));
// const SuperAdminDatabase = lazy(() => import("./pages/Dashboard/superadmin/SuperAdminDatabase.jsx"));
// const SuperAdminEmails = lazy(() => import("./pages/Dashboard/superadmin/SuperAdminEmails.jsx"));
// const SuperAdminSupport = lazy(() => import("./pages/Dashboard/superadmin/SuperAdminSupport.jsx"));
// const SuperAdminSettings = lazy(() => import("./pages/Dashboard/superadmin/SuperAdminSettings.jsx"));
// // import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";


// const App = () => {
//   // Function to check if user is authenticated
//   const isAuthenticated = () => {
//     return localStorage.getItem("token") !== null;
//   };

//   // Function to get user role
//   const getUserRole = () => {
//     const user = localStorage.getItem("user");
//     return user ? JSON.parse(user).role : null;
//   };

//   return (
//     <AuthProvider>
//       <Router>
//         <Navbar />
//         <div className="pt-16">
//           {/* Add padding-top to account for fixed navbar */}
//           <Suspense fallback={<div className="flex items-center justify-center h-96 text-lg">Loading...</div>}>
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/about" element={<About />} />
//               <Route path="/contact" element={<Contact />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/turfs" element={<Turfs />} />
//               <Route
//                 path="/booking/:id"
//                 element={
//                   <ProtectedRoute role="user">
//                     <Booking />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route path="/unauthorized" element={<Unauthorized />} />


//               {/* Protected routes */}


//               <Route
//                 path="/dashboard/user"
//                 element={
//                   <ProtectedRoute role="user">
//                     <UserDashboard />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/user/my-bookings"
//                 element={
//                   <ProtectedRoute role="user">
//                     <UserMyBookings />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/user/profile"
//                 element={
//                   <ProtectedRoute role="user">
//                     <UserProfile />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/user/payments"
//                 element={
//                   <ProtectedRoute role="user">
//                     <PaymentHistory />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/user/notifications"
//                 element={
//                   <ProtectedRoute role="user">
//                     <Notifications />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/user/settings"
//                 element={
//                   <ProtectedRoute role="user">
//                     <Settings />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/user/help"
//                 element={
//                   <ProtectedRoute role="user">
//                     <HelpSupport />
//                   </ProtectedRoute>
//                 }
//               />


//               <Route
//                 path="/dashboard/admin"
//                 element={
//                   <ProtectedRoute role="admin">
//                     <AdminDashboard />
//                   </ProtectedRoute>
//                 }
//               >
//                 <Route index element={<TurfAdminOverview />} />
//                 <Route path="turfs" element={<TurfAdminTurfs />} />
//                 <Route path="analytics" element={<TurfAdminAnalytics />} />
//                 <Route path="notifications" element={<TurfAdminNotifications />} />
//                 <Route path="settings" element={<TurfAdminSettings />} />
//                 <Route path="help" element={<TurfAdminHelp />} />
//                 <Route path="my-bookings" element={<MyBookings />} />
//                 <Route path="profile" element={<Profile />} />
//               </Route>

//               {/* Superadmin routes for sidebar navigation */}
//               <Route path="/dashboard/superadmin" element={<ProtectedRoute role="superadmin"><SuperAdminDashboard /></ProtectedRoute>} />
//               <Route path="/dashboard/superadmin/users" element={<ProtectedRoute role="superadmin"><SuperAdminUsers /></ProtectedRoute>} />
//               <Route path="/dashboard/superadmin/turf-admins" element={<ProtectedRoute role="superadmin"><SuperAdminTurfAdmins /></ProtectedRoute>} />
//               <Route path="/dashboard/superadmin/turfs" element={<ProtectedRoute role="superadmin"><SuperAdminTurfs /></ProtectedRoute>} />
//               <Route path="/dashboard/superadmin/bookings" element={<ProtectedRoute role="superadmin"><SuperAdminBookings /></ProtectedRoute>} />
//               <Route path="/dashboard/superadmin/analytics" element={<ProtectedRoute role="superadmin"><SuperAdminAnalytics /></ProtectedRoute>} />
//               <Route path="/dashboard/superadmin/revenue" element={<ProtectedRoute role="superadmin"><SuperAdminRevenue /></ProtectedRoute>} />
//               <Route path="/dashboard/superadmin/system-health" element={<ProtectedRoute role="superadmin"><SuperAdminSystemHealth /></ProtectedRoute>} />
//               <Route path="/dashboard/superadmin/notifications" element={<ProtectedRoute role="superadmin"><SuperAdminNotifications /></ProtectedRoute>} />
//               <Route path="/dashboard/superadmin/database" element={<ProtectedRoute role="superadmin"><SuperAdminDatabase /></ProtectedRoute>} />
//               <Route path="/dashboard/superadmin/emails" element={<ProtectedRoute role="superadmin"><SuperAdminEmails /></ProtectedRoute>} />
//               <Route path="/dashboard/superadmin/support" element={<ProtectedRoute role="superadmin"><SuperAdminSupport /></ProtectedRoute>} />
//               <Route path="/dashboard/superadmin/settings" element={<ProtectedRoute role="superadmin"><SuperAdminSettings /></ProtectedRoute>} />
//               {/* 404 route */}
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </Suspense>
//         </div>
//         {/* Only show Footer on non-dashboard pages - useLocation provides SPA-aware routing */}
//         <FooterVisibility />
//       </Router>
//     </AuthProvider>
//   );
// };

// // Component placed outside Routes to access location
// function FooterVisibility() {
//   const location = useLocation();
//   // Hide footer for any dashboard path (covers /dashboard/user, /dashboard/admin, /dashboard/superadmin)
//   const isDashboard = location.pathname.startsWith("/dashboard");
//   return !isDashboard ? <Footer /> : null;
// }

// export default App;

// ...existing code...
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Turfs from "./pages/Turfs";
import NotFound from "./pages/NotFound";
import Booking from "./pages/Booking";
import { SocketProvider } from "./context/SocketContext";
import Unauthorized from "./pages/unauthorized";

// === USER DASHBOARD ===
import UserDashboard from "./pages/Dashboard/Userdashboard/UserDashboard";
import UserMyBookings from "./pages/Dashboard/Userdashboard/MyBookings";
import UserProfile from "./pages/Dashboard/Userdashboard/UserProfile";
import PaymentHistory from "./pages/Dashboard/Userdashboard/UserPayments";
import Notifications from "./pages/Dashboard/Userdashboard/UserNotifications";
import Settings from "./pages/Dashboard/Userdashboard/Settings";
import HelpSupport from "./pages/Dashboard/Userdashboard/HelpSupport";

// === ADMIN DASHBOARD ===
import AdminDashboard from "./pages/Dashboard/TurfAdminDashboard/TurfAdminDashboard";
import MyBookings from "./pages/Dashboard/TurfAdminDashboard/TurfAdminBookings";
import Profile from "./pages/Dashboard/TurfAdminDashboard/TurfAdminProfile";
import TurfAdminTurfs from "./pages/Dashboard/TurfAdminDashboard/TurfAdminTurfs";
import TurfAdminAnalytics from "./pages/Dashboard/TurfAdminDashboard/TurfAdminAnalytics";
import TurfAdminOverview from "./pages/Dashboard/TurfAdminDashboard/TurfAdminOverview";
import TurfAdminNotifications from "./pages/Dashboard/TurfAdminDashboard/TurfAdminNotifications";
import TurfAdminSettings from "./pages/Dashboard/TurfAdminDashboard/TurfAdminSettings";
import TurfAdminHelp from "./pages/Dashboard/TurfAdminDashboard/TurfAdminHelp";

// === SUPERADMIN DASHBOARD (Lazy Loaded) ===
const SuperAdminDashboard = lazy(() =>
  import("./pages/Dashboard/superadmin/SuperAdminDashboard.jsx")
);
const SuperAdminAnalytics = lazy(() =>
  import("./pages/Dashboard/superadmin/SuperAdminAnalytics.jsx")
);
const SuperAdminUsers = lazy(() =>
  import("./pages/Dashboard/superadmin/SuperAdminUsers.jsx")
);
const SuperAdminTurfAdmins = lazy(() =>
  import("./pages/Dashboard/superadmin/SuperAdminTurfAdmins.jsx")
);
const SuperAdminTurfs = lazy(() =>
  import("./pages/Dashboard/superadmin/SuperAdminTurfs.jsx")
);
const SuperAdminBookings = lazy(() =>
  import("./pages/Dashboard/superadmin/SuperAdminBookings.jsx")
);
const SuperAdminRevenue = lazy(() =>
  import("./pages/Dashboard/superadmin/SuperAdminRevenue.jsx")
);
const SuperAdminSystemHealth = lazy(() =>
  import("./pages/Dashboard/superadmin/SuperAdminSystemHealth.jsx")
);
const SuperAdminNotifications = lazy(() =>
  import("./pages/Dashboard/superadmin/SuperAdminNotifications.jsx")
);
const SuperAdminDatabase = lazy(() =>
  import("./pages/Dashboard/superadmin/SuperAdminDatabase.jsx")
);
const SuperAdminEmails = lazy(() =>
  import("./pages/Dashboard/superadmin/SuperAdminEmails.jsx")
);
const SuperAdminSupport = lazy(() =>
  import("./pages/Dashboard/superadmin/SuperAdminSupport.jsx")
);
const SuperAdminSettings = lazy(() =>
  import("./pages/Dashboard/superadmin/SuperAdminSettings.jsx")
);

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  // === AUTH HELPERS ===
  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  const getUserRole = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).role : null;
  };

  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Navbar />
          <div className="pt-16">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-96 text-lg">
                  Loading...
                </div>
              }
            >
              <Routes>
                {/* === PUBLIC ROUTES === */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/turfs" element={<Turfs />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* === USER BOOKING === */}
                <Route
                  path="/booking/:id"
                  element={
                    <ProtectedRoute role="user">
                      <Booking />
                    </ProtectedRoute>
                  }
                />

                {/* === USER DASHBOARD ROUTES === */}
                <Route
                  path="/dashboard/user"
                  element={
                    <ProtectedRoute role="user">
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/user/my-bookings"
                  element={
                    <ProtectedRoute role="user">
                      <UserMyBookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/user/profile"
                  element={
                    <ProtectedRoute role="user">
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/user/payments"
                  element={
                    <ProtectedRoute role="user">
                      <PaymentHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/user/notifications"
                  element={
                    <ProtectedRoute role="user">
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/user/settings"
                  element={
                    <ProtectedRoute role="user">
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/user/help"
                  element={
                    <ProtectedRoute role="user">
                      <HelpSupport />
                    </ProtectedRoute>
                  }
                />

                {/* === ADMIN DASHBOARD ROUTES === */}
                <Route
                  path="/dashboard/admin"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<TurfAdminOverview />} />
                  <Route path="turfs" element={<TurfAdminTurfs />} />
                  <Route path="analytics" element={<TurfAdminAnalytics />} />
                  <Route path="notifications" element={<TurfAdminNotifications />} />
                  <Route path="settings" element={<TurfAdminSettings />} />
                  <Route path="help" element={<TurfAdminHelp />} />
                  <Route path="my-bookings" element={<MyBookings />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* === SUPERADMIN DASHBOARD ROUTES === */}
                <Route
                  path="/dashboard/superadmin"
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/superadmin/users"
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/superadmin/turf-admins"
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminTurfAdmins />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/superadmin/turfs"
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminTurfs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/superadmin/bookings"
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminBookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/superadmin/analytics"
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/superadmin/revenue"
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminRevenue />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/superadmin/system-health"
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminSystemHealth />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/superadmin/notifications"
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminNotifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/superadmin/database"
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminDatabase />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/superadmin/emails"
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminEmails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/superadmin/support"
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminSupport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/superadmin/settings"
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminSettings />
                    </ProtectedRoute>
                  }
                />

                {/* === 404 FALLBACK === */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>

          {/* Hide footer for dashboard paths */}
          <FooterVisibility />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
};

// === Footer Visibility Helper ===
function FooterVisibility() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  return !isDashboard ? <Footer /> : null;
}

export default App;
