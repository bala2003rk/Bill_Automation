import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Settings, Bell, Shield, Database, Mail, Save } from "lucide-react";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
  const [billLimit, setBillLimit] = useState(10000);
  const [autoApprove, setAutoApprove] = useState(false);
  const [emailOnSubmit, setEmailOnSubmit] = useState(true);
  const [emailOnApprove, setEmailOnApprove] = useState(true);
  const [emailOnReject, setEmailOnReject] = useState(true);
  const [emailOnPay, setEmailOnPay] = useState(true);

  const Toggle = ({ value, onChange, label, description }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 0", borderBottom: "1px solid var(--border)" }}>
      <div>
        <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>{label}</p>
        {description && <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>{description}</p>}
      </div>
      <div
        onClick={() => onChange(!value)}
        style={{ width: 40, height: 22, borderRadius: 99, background: value ? "var(--primary)" : "var(--border)", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 2, left: value ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 720 }}>
        <h1 className="page-title" style={{ marginBottom: "1.5rem" }}>System Settings</h1>

        {/* Bill limits */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--primary-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Settings size={15} color="var(--primary)" />
            </div>
            <h2 className="section-title">Bill Submission Rules</h2>
          </div>

          <div className="form-group">
            <label>Maximum bill amount per submission (₹)</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input className="form-input" type="number" value={billLimit} onChange={e => setBillLimit(e.target.value)} style={{ maxWidth: 200 }} />
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Bills above this need special approval</span>
            </div>
          </div>

          <Toggle value={autoApprove} onChange={setAutoApprove}
            label="Auto-approve small bills"
            description="Bills under ₹500 are automatically approved without manager review" />

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={() => toast.success("Settings saved! (Demo mode)")}><Save size={14} /> Save Rules</button>
          </div>
        </div>

        {/* Email notifications */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EAF3DE", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bell size={15} color="#3B6D11" />
            </div>
            <h2 className="section-title">Email Notification Triggers</h2>
          </div>

          <Toggle value={emailOnSubmit} onChange={setEmailOnSubmit}
            label="Bill submitted"
            description="Notify manager and team lead when employee submits a bill" />
          <Toggle value={emailOnApprove} onChange={setEmailOnApprove}
            label="Bill approved"
            description="Notify employee and payment admin when a bill is approved" />
          <Toggle value={emailOnReject} onChange={setEmailOnReject}
            label="Bill rejected"
            description="Notify employee with rejection reason" />
          <Toggle value={emailOnPay} onChange={setEmailOnPay}
            label="Payment processed"
            description="Notify employee with transaction reference when payment is made" />

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={() => toast.success("Email settings saved! (Demo mode)")}><Save size={14} /> Save Email Settings</button>
          </div>
        </div>

        {/* SMTP */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mail size={15} color="var(--warning)" />
            </div>
            <h2 className="section-title">SMTP / Email Configuration</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div className="form-group"><label>SMTP Host</label><input className="form-input" defaultValue="smtp.gmail.com" /></div>
            <div className="form-group"><label>SMTP Port</label><input className="form-input" defaultValue="587" /></div>
            <div className="form-group"><label>SMTP Username</label><input className="form-input" placeholder="your@gmail.com" /></div>
            <div className="form-group"><label>SMTP Password</label><input className="form-input" type="password" placeholder="App password" /></div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label>Sender Name / From Email</label>
              <input className="form-input" defaultValue="BillTrack <noreply@company.com>" />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
            <button className="btn btn-outline" onClick={() => toast.success("Test email sent to admin! (Demo)")}> Send Test Email</button>
            <button className="btn btn-primary" onClick={() => toast.success("SMTP config saved!")}><Save size={14} /> Save Config</button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card" style={{ border: "1px solid var(--danger-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--danger-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={15} color="var(--danger)" />
            </div>
            <h2 className="section-title" style={{ color: "var(--danger)" }}>Danger Zone</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem", background: "var(--danger-light)", borderRadius: "var(--radius)", border: "1px solid #fca5a5" }}>
            <div>
              <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>Reset all demo data</p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Clear all bills, restore default users and projects</p>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => toast.error("This will delete all data. Not implemented in demo.")}>Reset Data</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
