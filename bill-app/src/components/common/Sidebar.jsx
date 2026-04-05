import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard, Receipt, FolderKanban, Users, Settings,
  LogOut, CreditCard, UserCircle, ChevronLeft, ChevronRight,
  Building2, CheckSquare, BarChart2,
} from "lucide-react";
import { getInitials, roleLabel } from "../../utils/helpers";

const ROLE_MENUS = {
  EMPLOYEE: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/employee" },
    { label: "My Bills", icon: Receipt, path: "/dashboard/employee/bills" },
    { label: "My Projects", icon: FolderKanban, path: "/dashboard/employee/projects" },
    { label: "Profile", icon: UserCircle, path: "/profile" },
  ],
  TEAM_LEAD: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/teamlead" },
    { label: "Team Bills", icon: Receipt, path: "/dashboard/teamlead/bills" },
    { label: "Projects", icon: FolderKanban, path: "/dashboard/teamlead/projects" },
    { label: "My Team", icon: Users, path: "/dashboard/teamlead/team" },
    { label: "Profile", icon: UserCircle, path: "/profile" },
  ],
  MANAGER: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/manager" },
    { label: "All Bills", icon: Receipt, path: "/dashboard/manager/bills" },
    { label: "Approve Bills", icon: CheckSquare, path: "/dashboard/manager/approve" },
    { label: "Projects", icon: FolderKanban, path: "/dashboard/manager/projects" },
    { label: "Teams", icon: Users, path: "/dashboard/manager/teams" },
    { label: "Reports", icon: BarChart2, path: "/dashboard/manager/reports" },
    { label: "Profile", icon: UserCircle, path: "/profile" },
  ],
  ADMIN: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/admin" },
    { label: "All Bills", icon: Receipt, path: "/dashboard/admin/bills" },
    { label: "Projects", icon: FolderKanban, path: "/dashboard/admin/projects" },
    { label: "Users", icon: Users, path: "/dashboard/admin/users" },
    { label: "Departments", icon: Building2, path: "/dashboard/admin/departments" },
    { label: "Reports", icon: BarChart2, path: "/dashboard/admin/reports" },
    { label: "Settings", icon: Settings, path: "/dashboard/admin/settings" },
    { label: "Profile", icon: UserCircle, path: "/profile" },
  ],
  PAYMENT_ADMIN: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/payment" },
    { label: "Process Payments", icon: CreditCard, path: "/dashboard/payment/process" },
    { label: "History", icon: Receipt, path: "/dashboard/payment/history" },
    { label: "Profile", icon: UserCircle, path: "/profile" },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const items = ROLE_MENUS[user?.role] || [];

  const handleLogout = () => { logout(); navigate("/login"); };

  const sidebarStyle = {
    width: collapsed ? "60px" : "240px",
    minHeight: "100vh",
    background: "var(--sidebar-bg)",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.22s ease",
    flexShrink: 0,
    position: "relative",
    zIndex: 10,
  };

  return (
    <aside style={sidebarStyle}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", padding: "0.85rem 0.85rem", minHeight: "56px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💼</div>
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>BillTrack</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(p => !p)}
          style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "var(--sidebar-text)", borderRadius: 6, padding: "0.3rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User info */}
      {!collapsed ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.85rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</p>
            <p style={{ fontSize: "0.72rem", color: "var(--sidebar-text)" }}>{roleLabel(user?.role)}</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", padding: "0.85rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {getInitials(user?.name)}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.6rem 0.5rem", display: "flex", flexDirection: "column", gap: "2px" }}>
        {items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.split("/").length <= 3}
            title={collapsed ? item.label : ""}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "0.65rem",
              padding: collapsed ? "0.6rem" : "0.58rem 0.7rem",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: "7px", fontSize: "0.85rem", fontWeight: 500,
              color: isActive ? "#fff" : "var(--sidebar-text)",
              background: isActive ? "var(--sidebar-active-bg)" : "transparent",
              textDecoration: "none", transition: "all 0.15s", whiteSpace: "nowrap", overflow: "hidden",
            })}
            className={({ isActive }) => isActive ? "" : "sidebar-link"}
          >
            {({ isActive }) => (
              <>
                <item.icon size={17} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.8 }} />
                {!collapsed && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "0.65rem",
            width: "100%", padding: collapsed ? "0.6rem" : "0.58rem 0.7rem",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: "7px", background: "none", border: "none",
            color: "var(--sidebar-text)", fontSize: "0.85rem", fontWeight: 500,
            transition: "all 0.15s", whiteSpace: "nowrap",
          }}
          title={collapsed ? "Logout" : ""}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
