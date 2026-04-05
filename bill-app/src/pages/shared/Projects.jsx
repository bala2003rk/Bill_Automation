import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { FolderKanban, Plus, Users, MapPin, Calendar, X, Save, IndianRupee, Receipt } from "lucide-react";
import { formatINR, formatDate } from "../../utils/helpers";
import { DEMO_PROJECTS, DEMO_BILLS } from "../../utils/mockData";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

const statusColors = {
  ACTIVE:    { bg: "#EAF3DE", color: "#3B6D11" },
  ON_HOLD:   { bg: "#FAEEDA", color: "#633806" },
  COMPLETED: { bg: "#E6F1FB", color: "#0C447C" },
};

const statusLabel = (s) => s === "ON_HOLD" ? "On Hold" : s.charAt(0) + s.slice(1).toLowerCase();

/* ── Detail Modal ─────────────────────────────────── */
const DetailModal = ({ project, onClose }) => {
  const pct = Math.min(100, Math.round((project.spent / project.budget) * 100));
  const sc  = statusColors[project.status] || statusColors.ACTIVE;
  const bills = DEMO_BILLS.filter(b => b.project?.id === project.id);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--primary-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FolderKanban size={18} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{project.name}</h2>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{project.clientName}</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          {/* Status + meta */}
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ padding: "0.2rem 0.7rem", borderRadius: 99, fontSize: "0.72rem", fontWeight: 600, background: sc.bg, color: sc.color }}>{statusLabel(project.status)}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}><MapPin size={12} />{project.location}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}><Users size={12} />{project.members} members</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}><Calendar size={12} />Started {formatDate(project.startDate)}</span>
          </div>

          {/* Budget */}
          <div style={{ background: "var(--bg)", borderRadius: "var(--radius)", padding: "1rem", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Budget utilised</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 700, color: pct > 80 ? "var(--danger)" : "var(--primary)" }}>
                {formatINR(project.spent)} / {formatINR(project.budget)}
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: pct > 80 ? "var(--danger)" : pct > 60 ? "var(--warning)" : "var(--success)" }} />
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>{pct}% of annual budget used · {formatINR(project.budget - project.spent)} remaining</p>
          </div>

          {/* Bills on this project */}
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.6rem", color: "var(--text-secondary)" }}>
              Bills submitted for this project ({bills.length})
            </p>
            {bills.length === 0 ? (
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>No bills submitted yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {bills.map(b => (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.55rem 0.75rem", borderRadius: "var(--radius)", background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Receipt size={13} color="var(--text-muted)" />
                      <div>
                        <p style={{ fontSize: "0.82rem", fontWeight: 500 }}>{b.title}</p>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{b.submittedBy?.name} · {formatDate(b.date)}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", fontWeight: 600 }}>{formatINR(b.amount)}</span>
                      <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

/* ── Add / Edit Modal ─────────────────────────────── */
const ProjectFormModal = ({ project, onClose, onSave }) => {
  const isEdit = !!project;
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: project ? {
      name: project.name,
      clientName: project.clientName,
      location: project.location,
      budget: project.budget,
      status: project.status,
      startDate: project.startDate,
    } : {},
  });

  const onSubmit = (data) => {
    onSave(data);
    toast.success(isEdit ? "Project updated!" : "Project created!");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{isEdit ? "Edit Project" : "New Project"}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
            <div className="form-group">
              <label>Project Name *</label>
              <input className={`form-input ${errors.name ? "error" : ""}`} placeholder="e.g. Infosys Integration Phase 2"
                {...register("name", { required: "Project name required" })} />
              {errors.name && <span className="field-error">{errors.name.message}</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div className="form-group">
                <label>Client Name *</label>
                <input className={`form-input ${errors.clientName ? "error" : ""}`} placeholder="e.g. Infosys Ltd"
                  {...register("clientName", { required: "Client name required" })} />
                {errors.clientName && <span className="field-error">{errors.clientName.message}</span>}
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input className={`form-input ${errors.location ? "error" : ""}`} placeholder="e.g. Chennai"
                  {...register("location", { required: "Location required" })} />
              </div>
              <div className="form-group">
                <label>Annual Budget (₹) *</label>
                <input className={`form-input ${errors.budget ? "error" : ""}`} type="number" min="1" placeholder="500000"
                  {...register("budget", { required: "Budget required", min: 1 })} />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input className="form-input" type="date" {...register("startDate")} />
              </div>
            </div>
            {isEdit && (
              <div className="form-group">
                <label>Status</label>
                <select className="form-select" {...register("status")}>
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><Save size={14} /> {isEdit ? "Save Changes" : "Create Project"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Main Page ───────────────────────────────────── */
const Projects = ({ role = "EMPLOYEE" }) => {
  const [filter, setFilter]       = useState("ALL");
  const [detailProject, setDetailProject] = useState(null);
  const [editProject, setEditProject]     = useState(null);
  const [showAdd, setShowAdd]     = useState(false);

  const canCreate = ["ADMIN", "MANAGER"].includes(role);

  const filtered = DEMO_PROJECTS.filter(p =>
    filter === "ALL" ? true : p.status === filter
  );

  return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Client location projects your team is assigned to</p>
        </div>
        {canCreate && (
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> New Project
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem" }}>
        {["ALL", "ACTIVE", "ON_HOLD", "COMPLETED"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "0.3rem 0.9rem", borderRadius: 99, fontSize: "0.78rem", fontWeight: 500, border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
              background: filter === s ? "var(--primary)" : "transparent",
              color: filter === s ? "#fff" : "var(--text-secondary)",
              borderColor: filter === s ? "var(--primary)" : "var(--border)" }}>
            {s === "ALL" ? "All" : s === "ON_HOLD" ? "On Hold" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state card"><p>No projects found.</p></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
          {filtered.map(p => {
            const pct = Math.min(100, Math.round((p.spent / p.budget) * 100));
            const sc  = statusColors[p.status] || statusColors.ACTIVE;
            return (
              <div key={p.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--primary-dim)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FolderKanban size={18} color="var(--primary)" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{p.name}</p>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{p.clientName}</p>
                    </div>
                  </div>
                  <span style={{ padding: "0.2rem 0.6rem", borderRadius: 99, fontSize: "0.72rem", fontWeight: 600, background: sc.bg, color: sc.color, whiteSpace: "nowrap" }}>
                    {statusLabel(p.status)}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}><MapPin size={12} />{p.location}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}><Users size={12} />{p.members} members</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}><Calendar size={12} />{formatDate(p.startDate)}</span>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Budget utilised</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, fontFamily: "var(--font-mono)", color: pct > 80 ? "var(--danger)" : "var(--text-primary)" }}>
                      {formatINR(p.spent)} / {formatINR(p.budget)}
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: pct > 80 ? "var(--danger)" : pct > 60 ? "var(--warning)" : "var(--success)", transition: "width 0.5s ease" }} />
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{pct}% of budget used</p>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                  <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => setDetailProject(p)}>
                    View Details
                  </button>
                  {canCreate && (
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditProject(p)}>
                      Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {detailProject && <DetailModal project={detailProject} onClose={() => setDetailProject(null)} />}
      {editProject   && <ProjectFormModal project={editProject} onClose={() => setEditProject(null)} onSave={() => {}} />}
      {showAdd       && <ProjectFormModal onClose={() => setShowAdd(false)} onSave={() => {}} />}
    </DashboardLayout>
  );
};

export default Projects;
