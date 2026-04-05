import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { StatCard, MonthlyChart, SpendingBarChart, DonutChart } from "../../components/charts/Charts";
import BillsTable from "../../components/common/BillsTable";
import { Receipt, Users, FolderKanban, TrendingUp, IndianRupee, AlertTriangle } from "lucide-react";
import { formatINR } from "../../utils/helpers";
import { DEMO_BILLS, DEMO_MONTHLY_DATA, DEMO_DEPT_DATA, DEMO_STATUS_DATA } from "../../utils/mockData";

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);

  const allBills = DEMO_BILLS;
  const pending = allBills.filter(b => b.status === "PENDING");
  const totalAmount = allBills.reduce((s, b) => s + b.amount, 0);

  return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">Manager Dashboard 📊</h1>
          <p className="page-subtitle">Welcome, {user?.name} — Department spending & approvals</p>
        </div>
        {pending.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "var(--radius)", background: "var(--warning-light)", border: "1px solid #fde68a" }}>
            <AlertTriangle size={15} color="var(--warning)" />
            <span style={{ fontSize: "0.825rem", color: "var(--warning)", fontWeight: 500 }}>{pending.length} bills awaiting your approval</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Total Bills" value={allBills.length} icon={Receipt} color="#0f62fe" trend={12} />
        <StatCard label="Pending Approval" value={pending.length} icon={TrendingUp} color="#b45309" />
        <StatCard label="Total Teams" value={3} icon={Users} color="#0891b2" />
        <StatCard label="Total Spend" value={formatINR(totalAmount)} icon={IndianRupee} color="#198038" />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: "1rem", marginBottom: "1.5rem" }}>
        <MonthlyChart data={DEMO_MONTHLY_DATA} title="Dept Monthly Spending" />
        <SpendingBarChart data={DEMO_DEPT_DATA} title="Team-wise Spending" dataKey="value" />
        <DonutChart data={DEMO_STATUS_DATA} title="Bill Status" />
      </div>

      {/* Pending approvals */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <h2 className="section-title">⚡ Bills Awaiting Approval</h2>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>Review and approve/reject employee submissions</p>
          </div>
          <span className="badge badge-pending">{pending.length} Pending</span>
        </div>
        <BillsTable bills={pending} showApprove showSubmitter onRefresh={() => setRefresh(r => r + 1)} emptyMessage="🎉 All caught up! No bills pending approval." />
      </div>

      {/* All bills */}
      <div className="card">
        <h2 className="section-title" style={{ marginBottom: "1rem" }}>All Department Bills</h2>
        <BillsTable bills={allBills} showSubmitter onRefresh={() => setRefresh(r => r + 1)} />
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
