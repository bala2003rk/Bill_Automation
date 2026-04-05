import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ROLE_REDIRECTS = {
  EMPLOYEE: "/dashboard/employee",
  TEAM_LEAD: "/dashboard/teamlead",
  MANAGER: "/dashboard/manager",
  ADMIN: "/dashboard/admin",
  PAYMENT_ADMIN: "/dashboard/payment",
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
      <p className="text-muted" style={{ fontSize: "0.875rem" }}>Loading your workspace…</p>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to={ROLE_REDIRECTS[user.role] || "/login"} replace />;

  return children;
};

export default ProtectedRoute;
