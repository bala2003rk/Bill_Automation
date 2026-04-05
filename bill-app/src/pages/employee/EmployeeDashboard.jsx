import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { StatCard } from "../../components/charts/Charts";
import { MonthlyChart } from "../../components/charts/Charts";
import BillsTable from "../../components/common/BillsTable";
import SubmitBillModal from "../../components/common/SubmitBillModal";
import { Receipt, Clock, CheckCircle, FolderKanban, Plus, IndianRupee } from "lucide-react";
import { formatINR } from "../../utils/helpers";
import { DEMO_BILLS, DEMO_MONTHLY_DATA, DEMO_STATUS_DATA } from "../../utils/mockData";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const myBills = DEMO_BILLS.filter(b => b.submittedBy?.id === "4");
  const totalSpent = myBills.reduce((s, b) => s + (b.status !== "REJECTED" ? b.amount : 0), 0);
  const pending = myBills.filter(b => b.status === "PENDING").length;
  const approved = myBills.filter(b => b.status === "APPROVED").length;
  const paid = myBills.filter(b => b.status === "PAID").length;

  const recentBills = [...myBills].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="page-subtitle">Your reimbursement overview · {user?.department} Department</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ gap: "0.4rem" }}>
          <Plus size={16} /> Submit Bill
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Total Claimed" value={formatINR(totalSpent)} icon={IndianRupee} color="#0f62fe" />
        <StatCard label="Pending Review" value={pending} icon={Clock} color="#b45309" />
        <StatCard label="Approved" value={approved} icon={CheckCircle} color="#198038" />
        <StatCard label="Paid Out" value={paid} icon={Receipt} color="#8b5cf6" />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1rem", marginBottom: "1.5rem" }}>
        <MonthlyChart data={DEMO_MONTHLY_DATA} title="My Monthly Spending (₹)" />

        {/* Quick info card */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <p className="section-title" style={{ marginBottom: "1rem" }}>Bill Status Breakdown</p>
          {[
            { label: "Paid", count: paid, color: "#198038" },
            { label: "Approved (pending payment)", count: approved, color: "#0f62fe" },
            { label: "Pending review", count: pending, color: "#b45309" },
            { label: "Rejected", count: myBills.filter(b => b.status === "REJECTED").length, color: "#da1e28" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{s.label}</span>
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{s.count}</span>
            </div>
          ))}

          <div style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "var(--radius)", background: "var(--primary-dim)", border: "1px solid rgba(15,98,254,0.15)" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 500 }}>💡 Tip: Attach GST receipts for faster approval</p>
          </div>
        </div>
      </div>

      {/* Recent bills */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2 className="section-title">My Recent Bills</h2>
          <a href="/dashboard/employee/bills" style={{ fontSize: "0.8rem", color: "var(--primary)" }}>View all →</a>
        </div>
        <BillsTable bills={recentBills} onRefresh={() => setRefresh(r => r + 1)} emptyMessage="No bills submitted yet. Click 'Submit Bill' to get started." />
      </div>

      {/* Projects assigned */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <h2 className="section-title" style={{ marginBottom: "1rem" }}>My Active Projects</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
          {[
            { name: "Infosys Integration", client: "Infosys Ltd", location: "Chennai", bills: 2 },
            { name: "TCS Portal", client: "TCS", location: "Hyderabad", bills: 1 },
          ].map(p => (
            <div key={p.name} className="card-flat" style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--primary-dim)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FolderKanban size={16} color="var(--primary)" />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{p.name}</p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{p.client} · {p.location}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{p.bills} bill(s) submitted</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && <SubmitBillModal onClose={() => setShowModal(false)} onSuccess={() => setRefresh(r => r + 1)} />}
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
