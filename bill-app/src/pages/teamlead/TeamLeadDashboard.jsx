import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { StatCard, MonthlyChart } from "../../components/charts/Charts";
import BillsTable from "../../components/common/BillsTable";
import SubmitBillModal from "../../components/common/SubmitBillModal";
import { Receipt, Users, FolderKanban, CheckCircle, Plus, IndianRupee } from "lucide-react";
import { formatINR } from "../../utils/helpers";
import { DEMO_BILLS, DEMO_MONTHLY_DATA, DEMO_USERS } from "../../utils/mockData";

const TeamLeadDashboard = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  // Team lead sees their own bills + team members
  const teamBills = DEMO_BILLS.filter(b => ["3", "4"].includes(b.submittedBy?.id));
  const pendingReview = teamBills.filter(b => b.status === "PENDING");
  const totalSpend = teamBills.reduce((s, b) => s + b.amount, 0);
  const teamMembers = DEMO_USERS.filter(u => u.role === "EMPLOYEE");

  return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">Team Lead Dashboard 👥</h1>
          <p className="page-subtitle">Welcome, {user?.name} — manage your team's bills & projects</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Submit My Bill</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Team Bills" value={teamBills.length} icon={Receipt} color="#0f62fe" />
        <StatCard label="Pending Review" value={pendingReview.length} icon={CheckCircle} color="#b45309" />
        <StatCard label="Team Members" value={teamMembers.length} icon={Users} color="#0891b2" />
        <StatCard label="Team Spend" value={formatINR(totalSpend)} icon={IndianRupee} color="#198038" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        <MonthlyChart data={DEMO_MONTHLY_DATA} title="Team Monthly Spend" />

        {/* Team members */}
        <div className="card">
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>Team Members</h2>
          {teamMembers.map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--primary-dim)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>
                {m.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{m.name}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{m.employeeId} · {m.department}</p>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {DEMO_BILLS.filter(b => b.submittedBy?.id === m.id).length} bills
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2 className="section-title">Team Bills</h2>
          {pendingReview.length > 0 && <span className="badge badge-pending">{pendingReview.length} pending</span>}
        </div>
        <BillsTable bills={teamBills} showSubmitter onRefresh={() => setRefresh(r => r + 1)} emptyMessage="No team bills submitted yet." />
      </div>

      {showModal && <SubmitBillModal onClose={() => setShowModal(false)} onSuccess={() => setRefresh(r => r + 1)} />}
    </DashboardLayout>
  );
};

export default TeamLeadDashboard;
