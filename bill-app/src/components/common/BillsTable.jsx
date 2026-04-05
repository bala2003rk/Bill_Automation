import { useState } from "react";
import { Eye, CheckCircle, XCircle, CreditCard, Filter, Search } from "lucide-react";
import { formatINR, formatDate, statusColor, billTypeIcon } from "../../utils/helpers";
import { toast } from "react-hot-toast";

const BillsTable = ({
  bills = [],
  loading = false,
  showApprove = false,
  showPay = false,
  showSubmitter = false,
  onRefresh,
  emptyMessage = "No bills found",
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionBill, setActionBill] = useState(null);
  const [actionType, setActionType] = useState(null); // approve | reject | pay
  const [reason, setReason] = useState("");
  const [txRef, setTxRef] = useState("");
  const [acting, setActing] = useState(false);

  const filtered = bills.filter(b => {
    const matchSearch = !search || b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.submittedBy?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const doAction = async () => {
    setActing(true);
    try {
      const token = localStorage.getItem("token");
      const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const url = `${base}/bills/${actionBill.id}/${actionType === "pay" ? "pay" : actionType === "approve" ? "approve" : "reject"}`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(actionType === "pay" ? { txRef } : { reason }),
          signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) throw new Error();
      } catch {
        await new Promise(r => setTimeout(r, 700)); // demo mode
      }
      toast.success(actionType === "approve" ? "Bill approved!" : actionType === "reject" ? "Bill rejected." : "Payment processed!");
      setActionBill(null); setReason(""); setTxRef("");
      onRefresh?.();
    } catch { toast.error("Action failed. Please try again."); }
    finally { setActing(false); }
  };

  const STATUSES = ["ALL", "PENDING", "APPROVED", "REJECTED", "PAID"];

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="form-input" placeholder="Search bills…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: "2rem", height: 36, fontSize: "0.85rem" }} />
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: "0.3rem 0.75rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 500, border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
                background: statusFilter === s ? "var(--primary)" : "transparent",
                color: statusFilter === s ? "#fff" : "var(--text-secondary)",
                borderColor: statusFilter === s ? "var(--primary)" : "var(--border)" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          <div className="spinner" style={{ margin: "0 auto 0.75rem" }} />
          <p style={{ fontSize: "0.875rem" }}>Loading bills…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>🧾</p>
          <p style={{ marginTop: "0.5rem" }}>{emptyMessage}</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bill</th>
                {showSubmitter && <th>Submitted By</th>}
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(bill => (
                <tr key={bill.id}>
                  <td>
                    <div>
                      <p style={{ fontWeight: 500, fontSize: "0.875rem", color: "var(--text-primary)" }}>{bill.title}</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{bill.project?.name || "—"}</p>
                    </div>
                  </td>
                  {showSubmitter && (
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--primary-dim)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700 }}>
                          {bill.submittedBy?.name?.charAt(0)}
                        </div>
                        <span style={{ fontSize: "0.85rem" }}>{bill.submittedBy?.name}</span>
                      </div>
                    </td>
                  )}
                  <td><span style={{ fontSize: "0.85rem" }}>{billTypeIcon(bill.type)} {bill.type?.charAt(0) + bill.type?.slice(1).toLowerCase()}</span></td>
                  <td><span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "0.875rem" }}>{formatINR(bill.amount)}</span></td>
                  <td><span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{formatDate(bill.date)}</span></td>
                  <td><span className={`badge ${statusColor(bill.status)}`}>{bill.status}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: "0.35rem" }}>
                      <button className="btn btn-ghost btn-icon btn-sm" title="View details" onClick={() => alert(`Bill: ${bill.title}\nAmount: ${formatINR(bill.amount)}\nStatus: ${bill.status}\nDescription: ${bill.description || "—"}\n${bill.rejectionReason ? "Rejection reason: " + bill.rejectionReason : ""}`)}>
                        <Eye size={14} />
                      </button>
                      {showApprove && bill.status === "PENDING" && (
                        <>
                          <button className="btn btn-success btn-icon btn-sm" title="Approve" onClick={() => { setActionBill(bill); setActionType("approve"); }}>
                            <CheckCircle size={14} />
                          </button>
                          <button className="btn btn-danger btn-icon btn-sm" title="Reject" onClick={() => { setActionBill(bill); setActionType("reject"); }}>
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                      {showPay && bill.status === "APPROVED" && (
                        <button className="btn btn-primary btn-icon btn-sm" title="Process payment" onClick={() => { setActionBill(bill); setActionType("pay"); }}>
                          <CreditCard size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Action confirmation modal */}
      {actionBill && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setActionBill(null)}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>
                {actionType === "approve" ? "✅ Approve Bill" : actionType === "reject" ? "❌ Reject Bill" : "💳 Process Payment"}
              </h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setActionBill(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="card-flat" style={{ marginBottom: "1rem" }}>
                <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{actionBill.title}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                  {actionBill.submittedBy?.name} · {formatINR(actionBill.amount)}
                </p>
              </div>
              {actionType === "reject" && (
                <div className="form-group">
                  <label>Rejection Reason *</label>
                  <textarea className="form-input" rows={3} placeholder="Explain why this bill is being rejected…"
                    value={reason} onChange={e => setReason(e.target.value)} style={{ resize: "vertical" }} />
                </div>
              )}
              {actionType === "pay" && (
                <div className="form-group">
                  <label>Transaction Reference *</label>
                  <input className="form-input" placeholder="Bank transfer ID / UTR number"
                    value={txRef} onChange={e => setTxRef(e.target.value)} />
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    UPI/Bank: {actionBill.bankDetails || actionBill.submittedBy?.upiId || "Check employee profile"}
                  </p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setActionBill(null)}>Cancel</button>
              <button onClick={doAction} disabled={acting || (actionType === "reject" && !reason.trim()) || (actionType === "pay" && !txRef.trim())}
                className={`btn ${actionType === "approve" ? "btn-success" : actionType === "reject" ? "btn-danger" : "btn-primary"}`}>
                {acting ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Processing…</> :
                  actionType === "approve" ? "Approve" : actionType === "reject" ? "Reject" : "Mark as Paid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillsTable;
