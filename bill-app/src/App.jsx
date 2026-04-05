import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Login from "./pages/auth/Login";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MyBills from "./pages/employee/MyBills";
import TeamLeadDashboard from "./pages/teamlead/TeamLeadDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Departments from "./pages/admin/Departments";
import SettingsPage from "./pages/admin/Settings";
import PaymentDashboard from "./pages/payment/PaymentDashboard";
import PaymentHistory from "./pages/payment/PaymentHistory";
import Projects from "./pages/shared/Projects";
import Teams from "./pages/shared/Teams";
import Reports from "./pages/shared/Reports";
import Profile from "./pages/profile/Profile";

const ALL = ["EMPLOYEE", "TEAM_LEAD", "MANAGER", "ADMIN", "PAYMENT_ADMIN"];

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3500, style: { fontFamily: "var(--font)", fontSize: "0.875rem", borderRadius: "8px", border: "1px solid var(--border)" } }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Employee */}
        <Route path="/dashboard/employee" element={<ProtectedRoute allowedRoles={["EMPLOYEE"]}><EmployeeDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/employee/bills" element={<ProtectedRoute allowedRoles={["EMPLOYEE"]}><MyBills /></ProtectedRoute>} />
        <Route path="/dashboard/employee/projects" element={<ProtectedRoute allowedRoles={["EMPLOYEE"]}><Projects role="EMPLOYEE" /></ProtectedRoute>} />

        {/* Team Lead */}
        <Route path="/dashboard/teamlead" element={<ProtectedRoute allowedRoles={["TEAM_LEAD"]}><TeamLeadDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/teamlead/bills" element={<ProtectedRoute allowedRoles={["TEAM_LEAD"]}><TeamLeadDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/teamlead/projects" element={<ProtectedRoute allowedRoles={["TEAM_LEAD"]}><Projects role="TEAM_LEAD" /></ProtectedRoute>} />
        <Route path="/dashboard/teamlead/team" element={<ProtectedRoute allowedRoles={["TEAM_LEAD"]}><Teams role="TEAM_LEAD" /></ProtectedRoute>} />

        {/* Manager */}
        <Route path="/dashboard/manager" element={<ProtectedRoute allowedRoles={["MANAGER"]}><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/manager/bills" element={<ProtectedRoute allowedRoles={["MANAGER"]}><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/manager/approve" element={<ProtectedRoute allowedRoles={["MANAGER"]}><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/manager/projects" element={<ProtectedRoute allowedRoles={["MANAGER"]}><Projects role="MANAGER" /></ProtectedRoute>} />
        <Route path="/dashboard/manager/teams" element={<ProtectedRoute allowedRoles={["MANAGER"]}><Teams role="MANAGER" /></ProtectedRoute>} />
        <Route path="/dashboard/manager/reports" element={<ProtectedRoute allowedRoles={["MANAGER"]}><Reports role="MANAGER" /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/admin/bills" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/admin/users" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/admin/projects" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Projects role="ADMIN" /></ProtectedRoute>} />
        <Route path="/dashboard/admin/departments" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Departments /></ProtectedRoute>} />
        <Route path="/dashboard/admin/reports" element={<ProtectedRoute allowedRoles={["ADMIN"]}><Reports role="ADMIN" /></ProtectedRoute>} />
        <Route path="/dashboard/admin/settings" element={<ProtectedRoute allowedRoles={["ADMIN"]}><SettingsPage /></ProtectedRoute>} />

        {/* Payment Admin */}
        <Route path="/dashboard/payment" element={<ProtectedRoute allowedRoles={["PAYMENT_ADMIN"]}><PaymentDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/payment/process" element={<ProtectedRoute allowedRoles={["PAYMENT_ADMIN"]}><PaymentDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/payment/history" element={<ProtectedRoute allowedRoles={["PAYMENT_ADMIN"]}><PaymentHistory /></ProtectedRoute>} />

        {/* Shared */}
        <Route path="/profile" element={<ProtectedRoute allowedRoles={ALL}><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
