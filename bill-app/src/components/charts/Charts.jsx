import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatINR } from "../../utils/helpers";

// ── Stat Card ──────────────────────────────────────────────────
export const StatCard = ({ label, value, icon: Icon, color, trend, trendLabel, prefix = "" }) => (
  <div className="card stat-card" style={{ padding: "1.25rem" }}>
    <div className="stat-icon" style={{ background: `${color}15` }}>
      <Icon size={20} color={color} />
    </div>
    <div style={{ flex: 1 }}>
      <p className="stat-value">{prefix}{value}</p>
      <p className="stat-label">{label}</p>
      {trend !== undefined && (
        <p className="stat-trend" style={{ color: trend >= 0 ? "var(--success)" : "var(--danger)" }}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% {trendLabel || "vs last month"}
        </p>
      )}
    </div>
  </div>
);

// ── Monthly Area Chart ────────────────────────────────────────
export const MonthlyChart = ({ data, title }) => (
  <div className="card" style={{ padding: "1.25rem" }}>
    <p className="section-title" style={{ marginBottom: "1.25rem" }}>{title || "Monthly Spending"}</p>
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="gradTravel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0f62fe" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#0f62fe" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradFood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+"k" : v}`} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} width={48} />
        <Tooltip formatter={(v, n) => [formatINR(v), n === "travel" ? "Travel" : n === "food" ? "Food" : n]} contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="travel" stroke="#0f62fe" fill="url(#gradTravel)" strokeWidth={2} name="Travel" dot={false} />
        <Area type="monotone" dataKey="food" stroke="#8b5cf6" fill="url(#gradFood)" strokeWidth={2} name="Food" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// ── Bar Chart ─────────────────────────────────────────────────
export const SpendingBarChart = ({ data, title, dataKey = "value", nameKey = "name" }) => (
  <div className="card" style={{ padding: "1.25rem" }}>
    <p className="section-title" style={{ marginBottom: "1.25rem" }}>{title || "Spending Breakdown"}</p>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey={nameKey} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+"k" : v}`} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} width={48} />
        <Tooltip formatter={(v) => [formatINR(v)]} contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }} />
        <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => <Cell key={i} fill={entry.fill || "#0f62fe"} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// ── Donut/Pie Chart ───────────────────────────────────────────
export const DonutChart = ({ data, title }) => (
  <div className="card" style={{ padding: "1.25rem" }}>
    <p className="section-title" style={{ marginBottom: "0.75rem" }}>{title || "Status Breakdown"}</p>
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      <ResponsiveContainer width={140} height={140}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
            {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
          </Pie>
          <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {data.map(d => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: d.fill, flexShrink: 0 }} />
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{d.name}</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", marginLeft: "auto" }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
