export const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);

export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

export const statusColor = (status) => ({
  PENDING: "badge-pending",
  APPROVED: "badge-approved",
  REJECTED: "badge-rejected",
  PROCESSED: "badge-processed",
  PAID: "badge-paid",
  DRAFT: "badge-draft",
}[status] || "badge-draft");

export const billTypeIcon = (type) => ({
  TRAVEL: "✈️",
  FOOD: "🍽️",
  ACCOMMODATION: "🏨",
  MISCELLANEOUS: "📦",
}[type] || "🧾");

export const roleLabel = (role) => ({
  ADMIN: "Admin",
  MANAGER: "Manager",
  TEAM_LEAD: "Team Lead",
  EMPLOYEE: "Employee",
  PAYMENT_ADMIN: "Payment Admin",
}[role] || role);

export const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

export const BILL_TYPES = ["TRAVEL", "FOOD", "ACCOMMODATION", "MISCELLANEOUS"];
export const ROLES = ["ADMIN", "MANAGER", "TEAM_LEAD", "EMPLOYEE", "PAYMENT_ADMIN"];
export const BILL_STATUSES = ["PENDING", "APPROVED", "REJECTED", "PAID"];
