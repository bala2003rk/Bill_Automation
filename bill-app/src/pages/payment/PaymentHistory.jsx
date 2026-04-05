import DashboardLayout from "../../components/layout/DashboardLayout";
import BillsTable from "../../components/common/BillsTable";
import { DEMO_BILLS } from "../../utils/mockData";
import { formatINR } from "../../utils/helpers";
import { IndianRupee, CheckCircle, Calendar } from "lucide-react";

const PaymentHistory = () => {
  const paid = DEMO_BILLS.filter(b => b.status === "PAID");
  const totalPaid = paid.reduce((s, b) => s + b.amount, 0);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="page-title">Payment History</h1>
        <p className="page-subtitle">All completed reimbursements processed by your team</p>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[
          { label: "Total paid out", value: formatINR(totalPaid), icon: IndianRupee, color: "#0f62fe" },
          { label: "Transactions", value: paid.length, icon: CheckCircle, color: "#198038" },
          { label: "This month", value: formatINR(paid.reduce((s, b) => s + (new Date(b.date).getMonth() === new Date().getMonth() ? b.amount : 0), 0)), icon: Calendar, color: "#b45309" },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: "flex", alignItems: "center", gap: "0.85rem", flex: "1 1 200px", padding: "1.1rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <p style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-mono)", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="section-title" style={{ marginBottom: "1rem" }}>All Processed Payments</h2>
        <BillsTable bills={paid} showSubmitter emptyMessage="No payments have been processed yet." />
      </div>
    </DashboardLayout>
  );
};

export default PaymentHistory;
