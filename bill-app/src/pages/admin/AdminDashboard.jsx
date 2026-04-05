import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { StatCard, MonthlyChart, SpendingBarChart, DonutChart } from "../../components/charts/Charts";
import BillsTable from "../../components/common/BillsTable";
import { Receipt, Users, FolderKanban, Building2, IndianRupee, Plus, Shield, X, Save } from "lucide-react";
import { formatINR, formatDate, roleLabel } from "../../utils/helpers";
import { DEMO_BILLS, DEMO_MONTHLY_DATA, DEMO_DEPT_DATA, DEMO_STATUS_DATA, DEMO_USERS, DEMO_PROJECTS } from "../../utils/mockData";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

/* ── Add User Modal ───────────────────────────────── */
const AddUserModal = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    toast.success(`User ${data.name} created! Wire to your backend to persist.`);
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Add New User</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label>Full Name *</label>
                <input className={`form-input ${errors.name ? "error" : ""}`} placeholder="e.g. Rahul Verma"
                  {...register("name", { required: "Name required" })} />
                {errors.name && <span className="field-error">{errors.name.message}</span>}
              </div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label>Email Address *</label>
                <input className={`form-input ${errors.email ? "error" : ""}`} type="email" placeholder="rahul@company.com"
                  {...register("email", { required: "Email required" })} />
                {errors.email && <span className="field-error">{errors.email.message}</span>}
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select className="form-select" {...register("role", { required: true })}>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="TEAM_LEAD">Team Lead</option>
                  <option value="MANAGER">Manager</option>
                  <option value="PAYMENT_ADMIN">Payment Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department *</label>
                <select className="form-select" {...register("department")}>
                  <option>Engineering</option>
                  <option>Sales</option>
                  <option>Finance</option>
                  <option>HR</option>
                </select>
              </div>
              <div className="form-group">
                <label>Employee ID *</label>
                <input className="form-input" placeholder="e.g. EMP006"
                  {...register("employeeId", { required: true })} />
              </div>
              <div className="form-group">
                <label>Temporary Password *</label>
                <input className="form-input" type="password" placeholder="Min 6 characters"
                  {...register("password", { required: true, minLength: 6 })} />
              </div>
            </div>
            <div style={{ padding: "0.75rem", background: "var(--primary-dim)", borderRadius: "var(--radius)", border: "1px solid rgba(15,98,254,0.15)", marginTop: "0.5rem" }}>
              <p style={{ fontSize: "0.78rem", color: "var(--primary)" }}>💡 User will receive an email with login instructions once connected to the backend.</p>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><Save size={14} /> Create User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Edit User Modal ──────────────────────────────── */
const EditUserModal = ({ user, onClose }) => {
  const { register, handleSubmit } = useForm({ defaultValues: { name: user.name, role: user.role, department: user.department } });
  const onSubmit = (data) => {
    toast.success(`${user.name} updated!`);
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Edit User — {user.name}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-input" {...register("name")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div className="form-group">
                <label>Role</label>
                <select className="form-select" {...register("role")}>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="TEAM_LEAD">Team Lead</option>
                  <option value="MANAGER">Manager</option>
                  <option value="PAYMENT_ADMIN">Payment Admin</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department</label>
                <select className="form-select" {...register("department")}>
                  <option>Engineering</option>
                  <option>Sales</option>
                  <option>Finance</option>
                  <option>HR</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><Save size={14} /> Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Add Project Modal ────────────────────────────── */
const AddProjectModal = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    toast.success(`Project "${data.name}" created!`);
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>New Project</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
            <div className="form-group">
              <label>Project Name *</label>
              <input className={`form-input ${errors.name ? "error" : ""}`} placeholder="e.g. HCL Data Migration"
                {...register("name", { required: "Name required" })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div className="form-group">
                <label>Client Name *</label>
                <input className="form-input" placeholder="e.g. HCL Technologies"
                  {...register("clientName", { required: true })} />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input className="form-input" placeholder="e.g. Noida"
                  {...register("location", { required: true })} />
              </div>
              <div className="form-group">
                <label>Annual Budget (₹) *</label>
                <input className="form-input" type="number" placeholder="500000"
                  {...register("budget", { required: true, min: 1 })} />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input className="form-input" type="date" defaultValue={new Date().toISOString().split("T")[0]}
                  {...register("startDate")} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><Save size={14} /> Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Main Dashboard ───────────────────────────────── */
const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddUser, setShowAddUser]       = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editUser, setEditUser]             = useState(null);

  const totalSpend   = DEMO_BILLS.reduce((s, b) => s + b.amount, 0);
  const pendingBills = DEMO_BILLS.filter(b => b.status === "PENDING");
  const TABS = ["overview", "bills", "users", "projects"];

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <Shield size={16} color="var(--primary)" />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Admin Panel</span>
          </div>
          <h1 className="page-title">System Overview</h1>
          <p className="page-subtitle">Welcome, {user?.name} — full organisation control</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-outline" onClick={() => setShowAddUser(true)}><Plus size={15} /> Add User</button>
          <button className="btn btn-primary" onClick={() => setShowAddProject(true)}><Plus size={15} /> New Project</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", background: "var(--surface)", padding: "0.25rem", borderRadius: "var(--radius)", border: "1px solid var(--border)", width: "fit-content" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ padding: "0.45rem 1.1rem", borderRadius: "calc(var(--radius) - 2px)", border: "none", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              background: activeTab === t ? "var(--primary)" : "transparent",
              color: activeTab === t ? "#fff" : "var(--text-secondary)" }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Overview tab ── */}
      {activeTab === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <StatCard label="Total Bills"     value={DEMO_BILLS.length}                              icon={Receipt}      color="#0f62fe" trend={8} />
            <StatCard label="Total Users"     value={DEMO_USERS.length}                              icon={Users}        color="#0891b2" />
            <StatCard label="Active Projects" value={DEMO_PROJECTS.filter(p => p.status === "ACTIVE").length} icon={FolderKanban} color="#198038" />
            <StatCard label="Org Spend (MTD)" value={formatINR(totalSpend)}                          icon={IndianRupee}  color="#8b5cf6" trend={-4} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <MonthlyChart data={DEMO_MONTHLY_DATA} title="Organisation-wide Monthly Spend" />
            <SpendingBarChart data={DEMO_DEPT_DATA} title="Department-wise Spending" dataKey="value" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1rem", marginBottom: "1.5rem" }}>
            <div className="card">
              <h2 className="section-title" style={{ marginBottom: "1rem" }}>Recent Bills</h2>
              <BillsTable bills={DEMO_BILLS.slice(0, 5)} showSubmitter />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <DonutChart data={DEMO_STATUS_DATA} title="Bill Status Distribution" />
              {pendingBills.length > 0 && (
                <div style={{ padding: "1rem", borderRadius: "var(--radius)", background: "var(--warning-light)", border: "1px solid #fde68a" }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--warning)", marginBottom: "0.35rem" }}>⚠️ Action Needed</p>
                  <p style={{ fontSize: "0.78rem", color: "#78350f" }}>{pendingBills.length} bills are pending manager approval.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Bills tab ── */}
      {activeTab === "bills" && (
        <div className="card">
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>All Bills — Organisation</h2>
          <BillsTable bills={DEMO_BILLS} showSubmitter />
        </div>
      )}

      {/* ── Users tab ── */}
      {activeTab === "users" && (
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h2 className="section-title">User Management</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddUser(true)}><Plus size={14} /> Add User</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Employee</th><th>Role</th><th>Department</th><th>Employee ID</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {DEMO_USERS.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary-dim)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700 }}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{u.name}</p>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-approved">{roleLabel(u.role)}</span></td>
                    <td><span style={{ fontSize: "0.85rem" }}>{u.department}</span></td>
                    <td><span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--text-muted)" }}>{u.employeeId}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        <button className="btn btn-outline btn-sm" onClick={() => setEditUser(u)}>Edit</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }}
                          onClick={() => { if (window.confirm(`Remove ${u.name}? This would be permanent.`)) toast.success(`${u.name} removed (demo).`); }}>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Projects tab ── */}
      {activeTab === "projects" && (
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h2 className="section-title">Projects</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddProject(true)}><Plus size={14} /> New Project</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {DEMO_PROJECTS.map(p => {
              const pct = Math.min(100, Math.round((p.spent / p.budget) * 100));
              return (
                <div key={p.id} className="card-flat">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                    <h3 style={{ fontWeight: 600, fontSize: "0.925rem" }}>{p.name}</h3>
                    <span className={`badge ${p.status === "ACTIVE" ? "badge-approved" : "badge-pending"}`}>{p.status}</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>{p.clientName} · {p.location}</p>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Budget utilised</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{formatINR(p.spent)} / {formatINR(p.budget)}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 99, background: pct > 80 ? "var(--danger)" : pct > 60 ? "var(--warning)" : "var(--success)", width: `${pct}%` }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>👥 {p.members} members</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>📅 {formatDate(p.startDate)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddUser    && <AddUserModal    onClose={() => setShowAddUser(false)} />}
      {showAddProject && <AddProjectModal onClose={() => setShowAddProject(false)} />}
      {editUser       && <EditUserModal   user={editUser} onClose={() => setEditUser(null)} />}
    </DashboardLayout>
  );
};

export default AdminDashboard;
