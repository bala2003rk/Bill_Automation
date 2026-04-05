// Demo mode mock data — used when no backend is available
export const DEMO_USERS = [
  { id: "1", name: "Rajesh Kumar", email: "admin@company.com", role: "ADMIN", department: "Corporate", employeeId: "EMP001" },
  { id: "2", name: "Priya Sharma", email: "manager@company.com", role: "MANAGER", department: "Engineering", employeeId: "EMP002" },
  { id: "3", name: "Arun Patel", email: "tl@company.com", role: "TEAM_LEAD", department: "Engineering", employeeId: "EMP003" },
  { id: "4", name: "Sneha Reddy", email: "emp@company.com", role: "EMPLOYEE", department: "Engineering", employeeId: "EMP004", upiId: "sneha@upi" },
  { id: "5", name: "Vikram Nair", email: "accounts@company.com", role: "PAYMENT_ADMIN", department: "Finance", employeeId: "EMP005" },
];

export const DEMO_BILLS = [
  { id: "b1", title: "Client site travel - Chennai", type: "TRAVEL", amount: 2850, status: "PENDING", submittedBy: { id: "4", name: "Sneha Reddy" }, project: { id: "p1", name: "Infosys Integration" }, date: "2026-03-20", description: "Flight + cab to client location", createdAt: "2026-03-20T10:00:00Z" },
  { id: "b2", title: "Team lunch - project kickoff", type: "FOOD", amount: 1200, status: "APPROVED", submittedBy: { id: "4", name: "Sneha Reddy" }, project: { id: "p1", name: "Infosys Integration" }, date: "2026-03-18", description: "Team of 4 members, kickoff meeting", createdAt: "2026-03-18T12:00:00Z" },
  { id: "b3", title: "Taxi - weekly office visits", type: "TRAVEL", amount: 640, status: "PAID", submittedBy: { id: "4", name: "Sneha Reddy" }, project: { id: "p2", name: "TCS Portal" }, date: "2026-03-10", description: "Cab receipts attached", createdAt: "2026-03-10T09:00:00Z" },
  { id: "b4", title: "Hotel stay Hyderabad", type: "TRAVEL", amount: 4500, status: "REJECTED", submittedBy: { id: "4", name: "Sneha Reddy" }, project: { id: "p2", name: "TCS Portal" }, date: "2026-03-05", description: "2 nights stay", rejectionReason: "Receipt missing GST details", createdAt: "2026-03-05T08:00:00Z" },
  { id: "b5", title: "Working dinner", type: "FOOD", amount: 890, status: "PENDING", submittedBy: { id: "3", name: "Arun Patel" }, project: { id: "p1", name: "Infosys Integration" }, date: "2026-03-22", description: "Client dinner meeting", createdAt: "2026-03-22T19:00:00Z" },
  { id: "b6", title: "Bangalore visit", type: "TRAVEL", amount: 5200, status: "APPROVED", submittedBy: { id: "3", name: "Arun Patel" }, project: { id: "p3", name: "Wipro Analytics" }, date: "2026-03-15", description: "2-day client visit", createdAt: "2026-03-15T07:00:00Z" },
];

export const DEMO_PROJECTS = [
  { id: "p1", name: "Infosys Integration", clientName: "Infosys Ltd", location: "Chennai", status: "ACTIVE", budget: 50000, spent: 8500, members: 4, startDate: "2026-01-15" },
  { id: "p2", name: "TCS Portal", clientName: "TCS", location: "Hyderabad", status: "ACTIVE", budget: 80000, spent: 12300, members: 6, startDate: "2026-02-01" },
  { id: "p3", name: "Wipro Analytics", clientName: "Wipro Technologies", location: "Bangalore", status: "ON_HOLD", budget: 35000, spent: 5200, members: 3, startDate: "2026-01-20" },
];

export const DEMO_MONTHLY_DATA = [
  { month: "Oct", travel: 12400, food: 5200, total: 17600 },
  { month: "Nov", travel: 18300, food: 7100, total: 25400 },
  { month: "Dec", travel: 9800, food: 4300, total: 14100 },
  { month: "Jan", travel: 22100, food: 8900, total: 31000 },
  { month: "Feb", travel: 19500, food: 6700, total: 26200 },
  { month: "Mar", travel: 14900, food: 5500, total: 20400 },
];

export const DEMO_DEPT_DATA = [
  { name: "Engineering", value: 68400, fill: "#0f62fe" },
  { name: "Sales", value: 42100, fill: "#8b5cf6" },
  { name: "HR", value: 12300, fill: "#06b6d4" },
  { name: "Finance", value: 8900, fill: "#f59e0b" },
];

export const DEMO_STATUS_DATA = [
  { name: "Paid", value: 42, fill: "#198038" },
  { name: "Approved", value: 18, fill: "#0f62fe" },
  { name: "Pending", value: 12, fill: "#b45309" },
  { name: "Rejected", value: 6, fill: "#da1e28" },
];
