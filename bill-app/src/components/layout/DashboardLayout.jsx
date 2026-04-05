import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";

const DashboardLayout = ({ children }) => (
  <div style={{ display: "flex", minHeight: "100vh" }}>
    <Sidebar />
    <main style={{ flex: 1, overflow: "auto", background: "var(--bg)" }}>
      <div style={{ padding: "1.75rem 2rem", maxWidth: 1400, width: "100%" }}>
        {children || <Outlet />}
      </div>
    </main>
  </div>
);

export default DashboardLayout;
