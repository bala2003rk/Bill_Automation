import DashboardLayout from "../../components/layout/DashboardLayout";
import { MonthlyChart, SpendingBarChart, DonutChart } from "../../components/charts/Charts";
import { DEMO_MONTHLY_DATA, DEMO_DEPT_DATA, DEMO_STATUS_DATA, DEMO_BILLS } from "../../utils/mockData";
import { formatINR, formatDate } from "../../utils/helpers";
import { Download } from "lucide-react";
import { toast } from "react-hot-toast";

const Reports = ({ role = "MANAGER" }) => {
  const totalSpend = DEMO_BILLS.reduce((s, b) => s + b.amount, 0);
  const avgBill = totalSpend / DEMO_BILLS.length;
  const maxBill = Math.max(...DEMO_BILLS.map(b => b.amount));

  // Per-project breakdown
  const projectSpend = [
    { name: "Infosys Intg.", value: 3700, fill: "#0f62fe" },
    { name: "TCS Portal", value: 5140, fill: "#8b5cf6" },
    { name: "Wipro Analytics", value: 5200, fill: "#06b6d4" },
  ];

  const typeBreakdown = [
    { name: "Travel", value: DEMO_BILLS.filter(b => b.type === "TRAVEL").reduce((s, b) => s + b.amount, 0), fill: "#0f62fe" },
    { name: "Food", value: DEMO_BILLS.filter(b => b.type === "FOOD").reduce((s, b) => s + b.amount, 0), fill: "#8b5cf6" },
  ];

  return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">{role === "ADMIN" ? "Organisation-wide" : "Department"} spending insights</p>
        </div>
        <button className="btn btn-outline" onClick={() => {
          const rows = [["Month","Travel","Food","Total"], ...DEMO_MONTHLY_DATA.map(r => [r.month, r.travel, r.food, r.total])];
          const csv  = rows.map(r => r.join(",")).join("\n");
          const a    = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], {type:"text/csv"})), download: "spending_report.csv" });
          a.click(); toast.success("Report downloaded!");
        }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total spend (all time)", value: formatINR(totalSpend), sub: "All bills combined" },
          { label: "Average bill amount", value: formatINR(Math.round(avgBill)), sub: `Across ${DEMO_BILLS.length} bills` },
          { label: "Largest single bill", value: formatINR(maxBill), sub: "Hotel stay Hyderabad" },
          { label: "Approval rate", value: "78%", sub: "Approved / Total submitted" },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: "1.1rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{k.label}</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-primary)", lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <MonthlyChart data={DEMO_MONTHLY_DATA} title="Monthly trend — Travel vs Food (₹)" />
        <SpendingBarChart data={role === "ADMIN" ? DEMO_DEPT_DATA : projectSpend} title={role === "ADMIN" ? "Department-wise spend" : "Project-wise spend"} dataKey="value" />
      </div>

      {/* Charts row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        <DonutChart data={DEMO_STATUS_DATA} title="Bill status distribution" />
        <DonutChart data={typeBreakdown} title="Expense type breakdown" />
        <div className="card" style={{ padding: "1.25rem" }}>
          <p className="section-title" style={{ marginBottom: "1rem" }}>Month-over-month</p>
          {[
            { month: "January", change: +23.4, amount: formatINR(31000) },
            { month: "February", change: -15.5, amount: formatINR(26200) },
            { month: "March", change: -22.1, amount: formatINR(20400) },
          ].map(m => (
            <div key={m.month} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: "0.85rem" }}>{m.month}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 600 }}>{m.amount}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: m.change >= 0 ? "var(--danger)" : "var(--success)" }}>
                {m.change >= 0 ? "▲" : "▼"} {Math.abs(m.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top spenders table */}
      <div className="card">
        <h2 className="section-title" style={{ marginBottom: "1rem" }}>Top bills this month</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bill</th>
                <th>Employee</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[...DEMO_BILLS].sort((a, b) => b.amount - a.amount).slice(0, 5).map(bill => (
                <tr key={bill.id}>
                  <td><p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{bill.title}</p></td>
                  <td><span style={{ fontSize: "0.85rem" }}>{bill.submittedBy?.name}</span></td>
                  <td><span style={{ fontSize: "0.82rem" }}>{bill.type}</span></td>
                  <td><span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{formatINR(bill.amount)}</span></td>
                  <td><span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{formatDate(bill.date)}</span></td>
                  <td><span className={`badge badge-${bill.status.toLowerCase()}`}>{bill.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
