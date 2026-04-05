# BillTrack — Backend API

Node.js + Express + MongoDB backend for the BillTrack Bill Reimbursement App.

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and fill in your values:
- **MongoDB**: change `MONGODB_URI` if your Mongo runs elsewhere
- **JWT_SECRET**: set any long random string
- **Gmail SMTP**: use a [Gmail App Password](https://myaccount.google.com/apppasswords) (not your real password)
- **Cloudinary**: sign up free at [cloudinary.com](https://cloudinary.com) and copy your cloud name, API key, and secret

### 3. Seed demo data
```bash
npm run seed
```
This creates 5 demo users, 3 projects, 3 departments, and 6 sample bills.

### 4. Start the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server runs at **http://localhost:5000**

---

## 🔑 Demo Credentials (password: `demo123`)

| Role | Email |
|------|-------|
| Admin (CEO) | admin@company.com |
| Manager | manager@company.com |
| Team Lead | tl@company.com |
| Employee | emp@company.com |
| Payment Admin | accounts@company.com |

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login → `{ token, user }` |
| GET | `/auth/me` | Get current user |
| PUT | `/auth/me` | Update profile |
| PUT | `/auth/me/password` | Change password |
| POST | `/auth/me/qr-upload` | Upload UPI QR code |

### Bills
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/bills` | Role-filtered list |
| GET | `/bills/my` | Own bills |
| GET | `/bills/stats` | Status counts |
| GET | `/bills/:id` | Single bill |
| POST | `/bills` | Submit (multipart) |
| PUT | `/bills/:id` | Edit (PENDING only) |
| POST | `/bills/:id/approve` | Manager/TL/Admin |
| POST | `/bills/:id/reject` | Manager/TL/Admin |
| POST | `/bills/:id/pay` | Payment Admin/Admin |

### Users (Admin)
| Method | Endpoint |
|--------|----------|
| GET | `/users` |
| POST | `/users` |
| PUT | `/users/:id` |
| DELETE | `/users/:id` |
| PATCH | `/users/:id/toggle` |

### Projects
| Method | Endpoint |
|--------|----------|
| GET | `/projects` |
| POST | `/projects` |
| PUT | `/projects/:id` |
| POST | `/projects/:id/members` |

### Departments
| Method | Endpoint |
|--------|----------|
| GET | `/departments` |
| POST | `/departments` |
| PUT | `/departments/:id` |

### Dashboard Stats
| Method | Endpoint | Role |
|--------|----------|------|
| GET | `/dashboard/admin` | ADMIN |
| GET | `/dashboard/manager` | MANAGER |
| GET | `/dashboard/teamlead` | TEAM_LEAD |
| GET | `/dashboard/employee` | EMPLOYEE |
| GET | `/dashboard/payment` | PAYMENT_ADMIN |

---

## 📁 Project Structure

```
backend/
├── server.js                   # Entry point
├── .env.example                # Environment template
├── config/
│   ├── db.js                   # Mongoose connection
│   └── cloudinary.js           # Multer + Cloudinary storage
├── middleware/
│   └── auth.js                 # JWT verify + roleGuard()
├── models/
│   ├── User.js
│   ├── Bill.js
│   ├── Project.js
│   └── Department.js
├── controllers/
│   ├── authController.js
│   ├── billController.js
│   ├── userController.js
│   ├── projectController.js
│   ├── departmentController.js
│   └── dashboardController.js
├── routes/
│   ├── auth.js
│   ├── bills.js
│   ├── users.js
│   ├── projects.js
│   ├── departments.js
│   └── dashboard.js
├── services/
│   └── emailService.js         # 4 Nodemailer HTML templates
└── scripts/
    └── seed.js                 # Demo data seeder
```

---

## 📧 Email Notifications

Emails are sent automatically at these events:

| Event | Recipients |
|-------|-----------|
| Bill submitted | Manager / Team Lead of same department |
| Bill approved | Employee (CC: Payment Admin) |
| Bill rejected | Employee (with reason) |
| Bill paid | Employee (with transaction ref) |

> Email silently skips if `SMTP_USER` / `SMTP_PASS` are not set in `.env` — the API still works normally.

---

## ☁️ File Uploads

- Receipts are uploaded to **Cloudinary** under `billtrack/receipts/`
- QR codes uploaded under `billtrack/qr-codes/`
- Falls back to in-memory storage if Cloudinary env vars are missing (files won't persist — configure Cloudinary for production)

---

## 🗄️ MongoDB Notes

- Default: `mongodb://localhost:27017/billtrack`
- For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
- Indexes are created on `Bill` for `submittedBy + status` and `status + createdAt`
