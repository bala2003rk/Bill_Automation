# BillTrack — Bill Reimbursement App

## 🚀 Quick Start (Frontend Demo)

```bash
cd bill-app
npm install
npm run dev
```

Visit `http://localhost:5173`

### Demo Login Credentials (password: `demo123`)
| Role | Email |
|------|-------|
| Admin (CEO) | admin@company.com |
| Manager | manager@company.com |
| Team Lead | tl@company.com |
| Employee | emp@company.com |
| Accountant | accounts@company.com |

---

## 📁 Project Structure (Frontend — React + Vite)

```
src/
├── api/
│   ├── axiosInstance.js       # Axios with JWT interceptors
│   └── services.js            # All API service functions
├── components/
│   ├── charts/
│   │   └── Charts.jsx         # StatCard, AreaChart, BarChart, DonutChart
│   ├── common/
│   │   ├── BillsTable.jsx     # Reusable bills table w/ approve/pay actions
│   │   ├── ProtectedRoute.jsx
│   │   ├── Sidebar.jsx
│   │   └── SubmitBillModal.jsx # Bill submission form with file upload
│   └── layout/
│       └── DashboardLayout.jsx
├── context/
│   └── AuthContext.jsx        # JWT auth, role checking
├── pages/
│   ├── admin/AdminDashboard.jsx       # Overview + Users + Projects tabs
│   ├── auth/Login.jsx                  # Split-screen login with demo shortcuts
│   ├── employee/
│   │   ├── EmployeeDashboard.jsx
│   │   └── MyBills.jsx
│   ├── manager/ManagerDashboard.jsx   # Approval workflow + charts
│   ├── payment/PaymentDashboard.jsx   # Process payments + email trigger
│   ├── profile/Profile.jsx            # Personal info + bank details + password
│   └── teamlead/TeamLeadDashboard.jsx
├── styles/global.css          # Full design system (IBM Carbon-inspired)
└── utils/
    ├── helpers.js             # formatINR, formatDate, statusColor, etc.
    └── mockData.js            # Demo data (bills, users, projects, charts)
```

---

## 🔧 Backend (Node.js + Express + MongoDB) — TO BE BUILT

### Recommended Stack
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (jsonwebtoken) + bcrypt
- **File Storage**: Multer + Cloudinary (receipts)
- **Email**: Nodemailer (Gmail SMTP or SendGrid)
- **Validation**: Joi or Zod

### Required API Endpoints

#### Auth
```
POST   /api/auth/login          → { token, user }
GET    /api/auth/me             → user object
PUT    /api/auth/me             → update profile
PUT    /api/auth/me/password    → change password
POST   /api/auth/me/qr-upload   → upload QR code
```

#### Bills
```
GET    /api/bills               → all bills (role-filtered by middleware)
GET    /api/bills/my            → current user's bills
GET    /api/bills/stats         → dashboard stats
GET    /api/bills/:id           → single bill
POST   /api/bills               → submit bill (multipart: receipt file)
PUT    /api/bills/:id           → edit draft
POST   /api/bills/:id/approve   → manager approves → email to employee + payment admin
POST   /api/bills/:id/reject    → manager rejects → email to employee with reason
POST   /api/bills/:id/pay       → payment admin marks paid → email to employee
```

#### Users
```
GET    /api/users               → list users (admin only)
POST   /api/users               → create user (admin only)
PUT    /api/users/:id           → update user
DELETE /api/users/:id           → deactivate user
PATCH  /api/users/:id/toggle    → toggle active status
```

#### Projects
```
GET    /api/projects            → list projects (role-filtered)
POST   /api/projects            → create project
PUT    /api/projects/:id        → update project
POST   /api/projects/:id/members → assign member
```

#### Departments
```
GET    /api/departments         → list
POST   /api/departments         → create (admin)
PUT    /api/departments/:id     → update
```

#### Dashboard
```
GET    /api/dashboard/admin     → { totalBills, totalUsers, depts, monthlyData, deptData }
GET    /api/dashboard/manager   → { teamBills, pendingCount, teamCount, monthlyData }
GET    /api/dashboard/teamlead  → { teamBills, pendingCount, memberCount }
GET    /api/dashboard/employee  → { myBills, pendingCount, approvedCount, paidCount }
GET    /api/dashboard/payment   → { pendingPayments, processedCount, totalPaid }
```

### Mongoose Schemas

#### User
```js
{
  name, email, password (hashed), role, department, employeeId,
  upiId, bankAccount, ifsc, bankName, isActive, createdBy, createdAt
}
```

#### Bill
```js
{
  title, type (TRAVEL|FOOD|ACCOMMODATION|MISCELLANEOUS), amount,
  description, date, status (PENDING|APPROVED|REJECTED|PAID),
  submittedBy (User ref), project (Project ref), department,
  receiptUrl, bankDetails,
  approvedBy, approvedAt, rejectionReason,
  paidBy, paidAt, txRef,
  createdAt, updatedAt
}
```

#### Project
```js
{
  name, clientName, location, status (ACTIVE|ON_HOLD|COMPLETED),
  budget, members [User refs], startDate, endDate, createdBy
}
```

#### Department
```js
{ name, manager (User ref), budget, createdAt }
```

### Email Templates (Nodemailer)

4 email events to implement:
1. **Bill Submitted** → notify Team Lead / Manager
2. **Bill Approved** → notify Employee, CC Payment Admin
3. **Bill Rejected** → notify Employee with reason
4. **Bill Paid** → notify Employee with transaction reference

### Role Middleware
```js
// In Express middleware:
const roleGuard = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};
// Usage:
router.get("/users", auth, roleGuard("ADMIN"), userController.getAll);
```

### Environment Variables (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/billtrack
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=BillTrack <noreply@company.com>

# File storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

## ✅ What's Completed (Frontend)

- [x] Login page with demo mode (no backend needed)
- [x] Role-based sidebar navigation (5 roles)
- [x] JWT auth with localStorage persistence + auto-redirect
- [x] Employee Dashboard — stats, charts, recent bills, projects
- [x] Manager Dashboard — approve/reject workflow with reason modal
- [x] Admin Dashboard — tabs: Overview, Bills, Users, Projects
- [x] Team Lead Dashboard — team bills, member list
- [x] Payment Dashboard — process approved bills, mark paid
- [x] Profile page — personal info, bank details, password change
- [x] Bill submission modal — file upload, project selection
- [x] Reusable BillsTable — filter by status, search, approve/pay actions
- [x] Chart components — Area, Bar, Donut with Recharts
- [x] Design system — CSS variables, dark sidebar, DM Sans font
- [x] Demo mock data — realistic bills, users, projects

## 🔲 To Be Built (Next Session)

- [ ] Node.js + Express backend (full CRUD)
- [ ] MongoDB schemas & seed data
- [ ] JWT middleware
- [ ] Nodemailer email service
- [ ] Receipt upload to Cloudinary
- [ ] More sub-pages: Manager Reports, Admin Departments, Employee Projects
- [ ] Bill detail view page
- [ ] Notification bell component
- [ ] Mobile responsiveness polish
