import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Building2, Plus, X, Save } from "lucide-react";
import { formatINR } from "../../utils/helpers";
import { DEMO_USERS, DEMO_BILLS } from "../../utils/mockData";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

const DEPARTMENTS = [
  { id: "d1", name: "Engineering", manager: "Priya Sharma", budget: 200000, headcount: 3, color: "#0f62fe" },
  { id: "d2", name: "Sales",       manager: "—",            budget: 120000, headcount: 2, color: "#8b5cf6" },
  { id: "d3", name: "Finance",     manager: "—",            budget: 60000,  headcount: 1, color: "#06b6d4" },
  { id: "d4", name: "HR",          manager: "—",            budget: 40000,  headcount: 1, color: "#f59e0b" },
];

/* ── Dept Form Modal ─────────────────────────────── */
const DeptFormModal = ({ dept, onClose }) => {
  const isEdit = !!dept;
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: dept ? { name: dept.name, budget: dept.budget, manager: dept.manager } : {},
  });
  const onSubmit = (data) => {
    toast.success(isEdit ? `Department "${data.name}" updated!` : `Department "${data.name}" created!`);
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{isEdit ? "Edit Department" : "New Department"}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
            <div className="form-group">
              <label>Department Name *</label>
              <input className={`form-input ${errors.name ? "error" : ""}`} placeholder="e.g. Operations"
                {...register("name", { required: "Name required" })} />
              {errors.name && <span className="field-error">{errors.name.message}</span>}
            </div>
            <div className="form-group">
              <label>Annual Budget (₹) *</label>
              <input className="form-input" type="number" placeholder="100000"
                {...register("budget", { required: true, min: 1 })} />
            </div>
            <div className="form-group">
              <label>Assigned Manager</label>
              <select className="form-select" {...register("manager")}>
                <option value="—">— Not assigned —</option>
                {DEMO_USERS.filter(u => u.role === "MANAGER").map(u => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><Save size={14} /> {isEdit ? "Save Changes" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Detail Modal ────────────────────────────────── */
const DetailModal = ({ dept, onClose }) => {
  const members = DEMO_USERS.filter(u => u.department === dept.name);
  const bills   = DEMO_BILLS.filter(b => DEMO_USERS.find(u => u.id === b.submittedBy?.id)?.department === dept.name);
  const spent   = bills.reduce((s, b) => s + b.amount, 0);
  const pct     = Math.min(100, Math.round((spent / dept.budget) * 100));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: `${dept.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 size={16} color={dept.color} />
            </div>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{dept.name} Department</h2>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Budget */}
          <div style={{ background: "var(--bg)", borderRadius: "var(--radius)", padding: "1rem", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Annual budget utilised</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 700 }}>{formatINR(spent)} / {formatINR(dept.budget)}</span>
            </div>
            <div style={{ height: 8, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: dept.color }} />
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>{pct}% used · {formatINR(dept.budget - spent)} remaining</p>
          </div>

          {/* Members */}
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Members ({members.length})</p>
            {members.length === 0
              ? <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>No members in this department yet.</p>
              : members.map(m => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--primary-dim)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 700 }}>
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>{m.name}</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{m.role}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{DEMO_BILLS.filter(b => b.submittedBy?.id === m.id).length} bills</span>
                </div>
              ))
            }
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ───────────────────────────────────── */
const Departments = () => {
  const [showAdd,     setShowAdd]     = useState(false);
  const [editDept,    setEditDept]    = useState(null);
  const [detailDept,  setDetailDept]  = useState(null);

  const spendFor = (name) =>
    DEMO_BILLS.filter(b => DEMO_USERS.find(u => u.id === b.submittedBy?.id)?.department === name)
              .reduce((s, b) => s + b.amount, 0);

  return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Manage departments, budgets and managers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={15} /> New Department</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
        {DEPARTMENTS.map(dept => {
          const spent = spendFor(dept.name);
          const pct   = Math.min(100, Math.round((spent / dept.budget) * 100));
          return (
            <div key={dept.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${dept.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Building2 size={20} color={dept.color} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "1rem" }}>{dept.name}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Manager: {dept.manager}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1, textAlign: "center", padding: "0.6rem", background: "var(--bg)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                  <p style={{ fontWeight: 700, fontSize: "1.1rem", fontFamily: "var(--font-mono)" }}>{dept.headcount}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Members</p>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "0.6rem", background: "var(--bg)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                  <p style={{ fontWeight: 700, fontSize: "1.1rem", fontFamily: "var(--font-mono)", color: "var(--primary)" }}>{formatINR(spent)}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Spent (MTD)</p>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Annual budget</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{formatINR(dept.budget)}</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: dept.color }} />
                </div>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{pct}% used</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => setDetailDept(dept)}>View Details</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditDept(dept)}>Edit</button>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd    && <DeptFormModal onClose={() => setShowAdd(false)} />}
      {editDept   && <DeptFormModal dept={editDept}   onClose={() => setEditDept(null)} />}
      {detailDept && <DetailModal  dept={detailDept}  onClose={() => setDetailDept(null)} />}
    </DashboardLayout>
  );
};

export default Departments;
