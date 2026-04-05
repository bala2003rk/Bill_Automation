import { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Building2, Hash, CreditCard, Lock, Save } from "lucide-react";
import { roleLabel, getInitials } from "../../utils/helpers";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const { register, handleSubmit } = useForm({ defaultValues: { name: user?.name, upiId: user?.upiId || "", bankAccount: "", ifsc: "" } });
  const [saving, setSaving] = useState(false);

  const onSave = async (data) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    toast.success("Profile updated successfully!");
    setSaving(false);
  };

  const onChangePassword = async (data) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    toast.success("Password changed successfully!");
    setSaving(false);
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 720 }}>
        <h1 className="page-title" style={{ marginBottom: "1.5rem" }}>My Profile</h1>

        {/* Profile header card */}
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem", padding: "1.5rem" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--primary)", color: "#fff", fontSize: "1.75rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>{user?.name}</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{user?.email}</p>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
              <span className="badge badge-approved">{roleLabel(user?.role)}</span>
              <span className="tag"><Building2 size={11} /> {user?.department || "Engineering"}</span>
              <span className="tag"><Hash size={11} /> {user?.employeeId || "EMP004"}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", background: "var(--surface)", padding: "0.25rem", borderRadius: "var(--radius)", border: "1px solid var(--border)", width: "fit-content" }}>
          {["profile", "bank", "password"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: "0.4rem 1rem", borderRadius: "calc(var(--radius) - 2px)", border: "none", fontSize: "0.825rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                background: activeTab === t ? "var(--primary)" : "transparent",
                color: activeTab === t ? "#fff" : "var(--text-secondary)" }}>
              {t === "profile" ? "Personal Info" : t === "bank" ? "Bank Details" : "Security"}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="card">
            <h2 className="section-title" style={{ marginBottom: "1.25rem" }}><User size={15} style={{ display: "inline", marginRight: 6 }} />Personal Information</h2>
            <form onSubmit={handleSubmit(onSave)}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-input" {...register("name")} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input className="form-input" value={user?.email} disabled />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input className="form-input" value={user?.department || "Engineering"} disabled />
                </div>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input className="form-input" value={user?.employeeId || "EMP004"} disabled />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input className="form-input" value={roleLabel(user?.role)} disabled />
                </div>
              </div>
              <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving…</> : <><Save size={14} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "bank" && (
          <div className="card">
            <h2 className="section-title" style={{ marginBottom: "0.5rem" }}><CreditCard size={15} style={{ display: "inline", marginRight: 6 }} />Bank & Payment Details</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>These details will be used by the accounts team to process your reimbursements.</p>
            <form onSubmit={handleSubmit(onSave)}>
              <div className="form-group">
                <label>UPI ID</label>
                <input className="form-input" placeholder="yourname@upi or phone@bank" {...register("upiId")} />
              </div>
              <div className="divider" />
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.75rem" }}>OR Bank Transfer Details</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className="form-group">
                  <label>Account Number</label>
                  <input className="form-input" placeholder="Bank account number" {...register("bankAccount")} />
                </div>
                <div className="form-group">
                  <label>IFSC Code</label>
                  <input className="form-input" placeholder="e.g. HDFC0001234" {...register("ifsc")} />
                </div>
                <div className="form-group">
                  <label>Account Holder Name</label>
                  <input className="form-input" placeholder="As per bank records" {...register("accountName")} />
                </div>
                <div className="form-group">
                  <label>Bank Name</label>
                  <input className="form-input" placeholder="e.g. HDFC Bank" {...register("bankName")} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving…</> : <><Save size={14} /> Save Bank Details</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "password" && (
          <div className="card">
            <h2 className="section-title" style={{ marginBottom: "1.25rem" }}><Lock size={15} style={{ display: "inline", marginRight: 6 }} />Change Password</h2>
            <form onSubmit={handleSubmit(onChangePassword)}>
              <div className="form-group">
                <label>Current Password</label>
                <input className="form-input" type="password" placeholder="Enter current password" {...register("currentPassword")} />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input className="form-input" type="password" placeholder="At least 8 characters" {...register("newPassword")} />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input className="form-input" type="password" placeholder="Repeat new password" {...register("confirmPassword")} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Updating…</> : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
