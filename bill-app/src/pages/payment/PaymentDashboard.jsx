import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { StatCard } from "../../components/charts/Charts";
import BillsTable from "../../components/common/BillsTable";
import { CreditCard, CheckCircle, Clock, IndianRupee, Mail, X, Save } from "lucide-react";
import { formatINR, formatDate } from "../../utils/helpers";
import { DEMO_BILLS } from "../../utils/mockData";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

/* ── Mark as Paid Modal ─────────────────────────── */
const MarkPaidModal = ({ bill, onClose, onDone }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [paying, setPaying] = useState(false);
  const onSubmit = async (data) => {
    setPaying(true);
    await new Promise(r => setTimeout(r, 700));
    toast.success(`Payment of ${formatINR(bill.amount)} marked as paid! Ref: ${data.txRef}`);
    onDone();
    onClose();
    setPaying(false);
  };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>💳 Process Payment</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ padding: "0.85rem", background: "var(--bg)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{bill.title}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                {bill.submittedBy?.name} · {formatINR(bill.amount)}
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                UPI / Bank: <strong>{bill.submittedBy?.upiId || "sneha@upi"}</strong>
              </p>
            </div>
            <div className="form-group">
              <label>Transaction Reference / UTR Number *</label>
              <input className={`form-input ${errors.txRef ? "error" : ""}`}
                placeholder="e.g. UTR123456789012"
                {...register("txRef", { required: "Transaction reference required" })} />
              {errors.txRef && <span className="field-error">{errors.txRef.message}</span>}
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select className="form-select" {...register("method")}>
                <option>NEFT</option>
                <option>IMPS</option>
                <option>UPI</option>
                <option>RTGS</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Payment Date</label>
              <input className="form-input" type="date" defaultValue={new Date().toISOString().split("T")[0]}
                {...register("payDate")} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={paying}>
              {paying ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Processing…</> : <><Save size={14} /> Mark as Paid</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PaymentDashboard = () => {
  const { user } = useAuth();
  const [payingBill, setPayingBill] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const approved = DEMO_BILLS.filter(b => b.status === "APPROVED");
  const paid = DEMO_BILLS.filter(b => b.status === "PAID");
  const totalPaid = paid.reduce((s, b) => s + b.amount, 0);
  const totalPending = approved.reduce((s, b) => s + b.amount, 0);

  const exportCSV = () => {
    const rows = [
      ["Title", "Employee", "Amount", "UPI/Bank", "Date", "Status"],
      ...approved.map(b => [b.title, b.submittedBy?.name, b.amount, b.submittedBy?.upiId || "—", b.date, b.status]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "pending_payments.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  };

  const sendEmailReminder = (bill) => {
    window.open(`mailto:${bill.submittedBy?.email || ""}?subject=Reimbursement%20Update&body=Hi%20${bill.submittedBy?.name}%2C%0A%0AYour%20bill%20%22${encodeURIComponent(bill.title)}%22%20of%20${formatINR(bill.amount)}%20has%20been%20approved%20and%20is%20being%20processed.%0A%0ARegards%2C%0AAccounts%20Team`);
    toast.success(`Email client opened for ${bill.submittedBy?.name}`);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="page-title">Payment Dashboard 💳</h1>
        <p className="page-subtitle">Welcome, {user?.name} — process approved reimbursements via bank transfer</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatCard label="Pending Payments" value={approved.length} icon={Clock} color="#b45309" />
        <StatCard label="Processed (Total)" value={paid.length} icon={CheckCircle} color="#198038" />
        <StatCard label="Amount Paid Out" value={formatINR(totalPaid)} icon={IndianRupee} color="#0f62fe" />
        <StatCard label="Amount Pending" value={formatINR(totalPending)} icon={CreditCard} color="#8b5cf6" />
      </div>

      {/* Approved — ready to pay */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <h2 className="section-title">⚡ Approved Bills — Ready for Payment</h2>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.1rem" }}>Transfer funds via UPI/Bank, then mark as paid</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>
            Export CSV
          </button>
        </div>

        {approved.length === 0 ? (
          <div className="empty-state"><p>🎉 All payments processed! No pending payments.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bill</th>
                  <th>Employee</th>
                  <th>Amount</th>
                  <th>UPI / Bank</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approved.map(bill => (
                  <tr key={bill.id}>
                    <td>
                      <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{bill.title}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{bill.project?.name}</p>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--primary-dim)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700 }}>
                          {bill.submittedBy?.name?.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>{bill.submittedBy?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.95rem", color: "var(--primary)" }}>{formatINR(bill.amount)}</span></td>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)", background: "var(--bg)", padding: "0.2rem 0.5rem", borderRadius: 4, border: "1px solid var(--border)" }}>
                        {bill.submittedBy?.upiId || "sneha@upi"}
                      </span>
                    </td>
                    <td><span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{formatDate(bill.date)}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        <button className="btn btn-ghost btn-icon btn-sm" title="Send email reminder" onClick={() => sendEmailReminder(bill)}>
                          <Mail size={14} />
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => setPayingBill(bill)}>
                          Mark Paid
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment history */}
      <div className="card">
        <h2 className="section-title" style={{ marginBottom: "1rem" }}>Payment History</h2>
        <BillsTable bills={paid} showSubmitter emptyMessage="No payments processed yet." />
      </div>
      {payingBill && <MarkPaidModal bill={payingBill} onClose={() => setPayingBill(null)} onDone={() => setRefresh(r => r + 1)} />}
    </DashboardLayout>
  );
};

export default PaymentDashboard;
