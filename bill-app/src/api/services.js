import axiosInstance from "./axiosInstance";

// ── Auth ──────────────────────────────────
export const authService = {
  login: (email, password) => axiosInstance.post("/auth/login", { email, password }).then(r => r.data),
  getMe: () => axiosInstance.get("/auth/me").then(r => r.data),
  updateProfile: (data) => axiosInstance.put("/auth/me", data).then(r => r.data),
  changePassword: (data) => axiosInstance.put("/auth/me/password", data).then(r => r.data),
  uploadQrCode: (file) => {
    const fd = new FormData(); fd.append("file", file);
    return axiosInstance.post("/auth/me/qr-upload", fd, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data);
  },
};

// ── Bills ─────────────────────────────────
export const billService = {
  getAll: (params) => axiosInstance.get("/bills", { params }).then(r => r.data),
  getById: (id) => axiosInstance.get(`/bills/${id}`).then(r => r.data),
  create: (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
    return axiosInstance.post("/bills", fd, { headers: { "Content-Type": "multipart/form-data" } }).then(r => r.data);
  },
  update: (id, data) => axiosInstance.put(`/bills/${id}`, data).then(r => r.data),
  approve: (id, note) => axiosInstance.post(`/bills/${id}/approve`, { note }).then(r => r.data),
  reject: (id, reason) => axiosInstance.post(`/bills/${id}/reject`, { reason }).then(r => r.data),
  markPaid: (id, txRef) => axiosInstance.post(`/bills/${id}/pay`, { txRef }).then(r => r.data),
  getMyBills: (params) => axiosInstance.get("/bills/my", { params }).then(r => r.data),
  getStats: () => axiosInstance.get("/bills/stats").then(r => r.data),
};

// ── Users ─────────────────────────────────
export const userService = {
  getAll: (params) => axiosInstance.get("/users", { params }).then(r => r.data),
  getById: (id) => axiosInstance.get(`/users/${id}`).then(r => r.data),
  create: (data) => axiosInstance.post("/users", data).then(r => r.data),
  update: (id, data) => axiosInstance.put(`/users/${id}`, data).then(r => r.data),
  delete: (id) => axiosInstance.delete(`/users/${id}`).then(r => r.data),
  toggleStatus: (id) => axiosInstance.patch(`/users/${id}/toggle`).then(r => r.data),
};

// ── Projects ──────────────────────────────
export const projectService = {
  getAll: (params) => axiosInstance.get("/projects", { params }).then(r => r.data),
  getById: (id) => axiosInstance.get(`/projects/${id}`).then(r => r.data),
  create: (data) => axiosInstance.post("/projects", data).then(r => r.data),
  update: (id, data) => axiosInstance.put(`/projects/${id}`, data).then(r => r.data),
  assignMember: (id, userId) => axiosInstance.post(`/projects/${id}/members`, { userId }).then(r => r.data),
};

// ── Departments ───────────────────────────
export const deptService = {
  getAll: () => axiosInstance.get("/departments").then(r => r.data),
  create: (data) => axiosInstance.post("/departments", data).then(r => r.data),
  update: (id, data) => axiosInstance.put(`/departments/${id}`, data).then(r => r.data),
};

// ── Dashboard stats ───────────────────────
export const dashboardService = {
  getAdminStats: () => axiosInstance.get("/dashboard/admin").then(r => r.data),
  getManagerStats: () => axiosInstance.get("/dashboard/manager").then(r => r.data),
  getTeamLeadStats: () => axiosInstance.get("/dashboard/teamlead").then(r => r.data),
  getEmployeeStats: () => axiosInstance.get("/dashboard/employee").then(r => r.data),
  getPaymentStats: () => axiosInstance.get("/dashboard/payment").then(r => r.data),
};
