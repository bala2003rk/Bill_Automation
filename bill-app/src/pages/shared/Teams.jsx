import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import BillsTable from "../../components/common/BillsTable";
import { Users, Mail, Hash, Building2, Receipt, X, ChevronDown, ChevronUp } from "lucide-react";
import { roleLabel, formatINR } from "../../utils/helpers";
import { DEMO_USERS, DEMO_BILLS } from "../../utils/mockData";

const Teams = ({ role = "TEAM_LEAD" }) => {
  const [expandedMember, setExpandedMember] = useState(null);

  const members = role === "MANAGER"
    ? DEMO_USERS.filter(u => ["EMPLOYEE", "TEAM_LEAD"].includes(u.role))
    : DEMO_USERS.filter(u => u.role === "EMPLOYEE");

  const billsFor = (userId) => DEMO_BILLS.filter(b => b.submittedBy?.id === userId);

  const roleColors = {
    EMPLOYEE:  { bg: "#EAF3DE", color: "#3B6D11" },
    TEAM_LEAD: { bg: "#E6F1FB", color: "#0C447C" },
  };

  const toggle = (id) => setExpandedMember(prev => prev === id ? null : id);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="page-title">{role === "MANAGER" ? "All Teams" : "My Team"}</h1>
        <p className="page-subtitle">
          {role === "MANAGER" ? "Employees and team leads across your department" : "Members under your leadership"}
        </p>
      </div>

      {/* Summary row */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[
          { label: "Total members", value: members.length },
          { label: "Combined bills", value: members.reduce((s, u) => s + billsFor(u.id).length, 0) },
          { label: "Pending bills", value: members.reduce((s, u) => s + billsFor(u.id).filter(b => b.status === "PENDING").length, 0) },
          { label: "Total claimed", value: formatINR(members.reduce((s, u) => s + billsFor(u.id).reduce((a, b) => a + b.amount, 0), 0)) },
        ].map(s => (
          <div key={s.label} className="card" style={{ flex: "1 1 160px", padding: "1rem 1.25rem" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-mono)", lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Members — expandable cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {members.map(member => {
          const bills   = billsFor(member.id);
          const pending = bills.filter(b => b.status === "PENDING").length;
          const rc      = roleColors[member.role] || roleColors.EMPLOYEE;
          const isOpen  = expandedMember === member.id;

          return (
            <div key={member.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
              {/* Header row — always visible */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", cursor: "pointer" }}
                onClick={() => toggle(member.id)}>
                {/* Avatar */}
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--primary)", color: "#fff", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {member.name.charAt(0)}
                </div>

                {/* Name + meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{member.name}</p>
                    <span style={{ padding: "0.15rem 0.55rem", borderRadius: 99, fontSize: "0.7rem", fontWeight: 600, background: rc.bg, color: rc.color }}>
                      {roleLabel(member.role)}
                    </span>
                    {pending > 0 && (
                      <span style={{ padding: "0.15rem 0.55rem", borderRadius: 99, fontSize: "0.7rem", fontWeight: 600, background: "var(--warning-light)", color: "var(--warning)" }}>
                        {pending} pending
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>{member.email}</p>
                </div>

                {/* Quick stats */}
                <div style={{ display: "flex", gap: "1.5rem", flexShrink: 0 }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: "1rem", lineHeight: 1 }}>{bills.length}</p>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Bills</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: "1rem", lineHeight: 1, color: "var(--success)" }}>
                      {bills.filter(b => b.status === "PAID").length}
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Paid</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: "1rem", lineHeight: 1 }}>
                      {formatINR(bills.reduce((s, b) => s + b.amount, 0))}
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Total</p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                  <a href={`mailto:${member.email}`}
                    className="btn btn-ghost btn-icon btn-sm" title={`Email ${member.name}`}>
                    <Mail size={15} />
                  </a>
                </div>

                {/* Expand toggle */}
                <div style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Expandable bills section */}
              {isOpen && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "1rem 1.25rem", background: "var(--bg)" }}>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                      <Hash size={12} />{member.employeeId}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                      <Building2 size={12} />{member.department}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.6rem" }}>
                    Bills submitted by {member.name.split(" ")[0]}
                  </p>
                  <BillsTable
                    bills={bills}
                    emptyMessage={`${member.name.split(" ")[0]} hasn't submitted any bills yet.`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Teams;
