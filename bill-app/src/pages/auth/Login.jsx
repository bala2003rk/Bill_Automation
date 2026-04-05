import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DEMO_USERS } from "../../utils/mockData";

const ROLE_REDIRECT = {
  EMPLOYEE: "/dashboard/employee",
  TEAM_LEAD: "/dashboard/teamlead",
  MANAGER: "/dashboard/manager",
  ADMIN: "/dashboard/admin",
  PAYMENT_ADMIN: "/dashboard/payment",
};

const DEMO_CREDS = [
  { label: "Admin (CEO)", email: "admin@company.com", role: "ADMIN" },
  { label: "Manager", email: "manager@company.com", role: "MANAGER" },
  { label: "Team Lead", email: "tl@company.com", role: "TEAM_LEAD" },
  { label: "Employee", email: "emp@company.com", role: "EMPLOYEE" },
  { label: "Accountant", email: "accounts@company.com", role: "PAYMENT_ADMIN" },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Try real backend first
      let user, token;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) {
          const json = await res.json();
          user = json.user; token = json.token;
        } else throw new Error("bad creds");
      } catch {
        // Demo mode fallback
        const demoUser = DEMO_USERS.find(u => u.email === data.email);
        if (!demoUser || data.password !== "demo123") throw new Error("Invalid credentials. Demo password: demo123");
        user = demoUser;
        token = "demo-token-" + demoUser.role;
      }
      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      setTimeout(() => navigate(ROLE_REDIRECT[user.role] || "/login"), 600);
    } catch (err) {
      toast.error(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "3rem", maxWidth: 520 }}>
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💼</div>
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>BillTrack</span>
          </div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 700, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
            Employee<br />Reimbursement<br /><span style={{ color: "var(--primary)" }}>Portal</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Submit travel & food bills, track approvals, and get reimbursed — all in one place.
          </p>
        </div>

        {/* Feature pills */}
        {["Role-based access control", "Bill submission with receipt upload", "Multi-stage approval workflow", "Email notifications & audit trail", "Analytics & spending reports"].map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", flexShrink: 0 }} />
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{f}</span>
          </div>
        ))}

        {/* Demo credentials */}
        <div style={{ marginTop: "2rem", padding: "1rem", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.6rem" }}>Quick Demo Login</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {DEMO_CREDS.map(c => (
              <button key={c.role} onClick={() => { setValue("email", c.email); setValue("password", "demo123"); }}
                style={{ padding: "0.25rem 0.6rem", borderRadius: 6, background: "rgba(15,98,254,0.2)", border: "1px solid rgba(15,98,254,0.35)", color: "#93c5fd", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>
                {c.label}
              </button>
            ))}
          </div>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginTop: "0.5rem" }}>Password for all demo accounts: <strong style={{ color: "rgba(255,255,255,0.5)" }}>demo123</strong></p>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "2.5rem 2rem", width: "100%", maxWidth: 420, boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>
          <div style={{ marginBottom: "1.75rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Sign in</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                <input className={`form-input ${errors.email ? "error" : ""}`} type="email" placeholder="you@company.com"
                  style={{ paddingLeft: "2.25rem" }}
                  {...register("email", { required: "Email required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })} />
              </div>
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                <input className={`form-input ${errors.password ? "error" : ""}`} type={showPw ? "text" : "password"} placeholder="Enter your password"
                  style={{ paddingLeft: "2.25rem", paddingRight: "2.5rem" }}
                  {...register("password", { required: "Password required", minLength: { value: 6, message: "Min 6 characters" } })} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", display: "flex", alignItems: "center", padding: 0 }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}
              style={{ padding: "0.7rem", fontSize: "0.95rem", justifyContent: "center", marginTop: "0.5rem" }}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in…</> : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", padding: "0.85rem", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Building2 size={14} style={{ color: "var(--text-muted)" }} />
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Don't have an account? Contact your <strong>Admin</strong> to get access.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
