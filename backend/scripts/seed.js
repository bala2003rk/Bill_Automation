require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose   = require("mongoose");
const bcrypt     = require("bcryptjs");
const User       = require("../models/User");
const Bill       = require("../models/Bill");
const Project    = require("../models/Project");
const Department = require("../models/Department");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/billtrack";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // ── Wipe existing data ──────────────────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Bill.deleteMany({}),
    Project.deleteMany({}),
    Department.deleteMany({}),
  ]);
  console.log("🗑  Cleared existing data");

  const pw = await bcrypt.hash("demo123", 12);

  // ── Users ───────────────────────────────────────────────────────────────────
  const [admin, manager, tl, emp, accounts] = await User.insertMany([
    {
      name: "Rajesh Kumar", email: "admin@company.com", password: pw,
      role: "ADMIN", department: "Corporate", employeeId: "EMP001",
    },
    {
      name: "Priya Sharma", email: "manager@company.com", password: pw,
      role: "MANAGER", department: "Engineering", employeeId: "EMP002",
    },
    {
      name: "Arun Patel", email: "tl@company.com", password: pw,
      role: "TEAM_LEAD", department: "Engineering", employeeId: "EMP003",
      upiId: "arun@upi",
    },
    {
      name: "Sneha Reddy", email: "emp@company.com", password: pw,
      role: "EMPLOYEE", department: "Engineering", employeeId: "EMP004",
      upiId: "sneha@upi", bankAccount: "9876543210", ifsc: "HDFC0001234", bankName: "HDFC Bank",
    },
    {
      name: "Vikram Nair", email: "accounts@company.com", password: pw,
      role: "PAYMENT_ADMIN", department: "Finance", employeeId: "EMP005",
    },
  ]);
  console.log("👤 Created 5 users");

  // ── Departments ─────────────────────────────────────────────────────────────
  await Department.insertMany([
    { name: "Engineering", manager: manager._id, budget: 200000 },
    { name: "Finance",     manager: admin._id,   budget:  80000 },
    { name: "Corporate",   manager: admin._id,   budget: 150000 },
  ]);
  console.log("🏢 Created 3 departments");

  // ── Projects ────────────────────────────────────────────────────────────────
  const [p1, p2, p3] = await Project.insertMany([
    {
      name: "Infosys Integration", clientName: "Infosys Ltd",
      location: "Chennai", status: "ACTIVE", budget: 50000,
      members: [emp._id, tl._id, manager._id],
      startDate: new Date("2026-01-15"), createdBy: admin._id,
    },
    {
      name: "TCS Portal", clientName: "TCS",
      location: "Hyderabad", status: "ACTIVE", budget: 80000,
      members: [emp._id, tl._id],
      startDate: new Date("2026-02-01"), createdBy: admin._id,
    },
    {
      name: "Wipro Analytics", clientName: "Wipro Technologies",
      location: "Bangalore", status: "ON_HOLD", budget: 35000,
      members: [tl._id],
      startDate: new Date("2026-01-20"), createdBy: admin._id,
    },
  ]);
  console.log("📁 Created 3 projects");

  // ── Bills ───────────────────────────────────────────────────────────────────
  const bankSnap = {
    upiId: emp.upiId, bankAccount: emp.bankAccount,
    ifsc: emp.ifsc,   bankName: emp.bankName,
  };

  await Bill.insertMany([
    {
      title: "Client site travel - Chennai", type: "TRAVEL", amount: 2850,
      status: "PENDING", submittedBy: emp._id, project: p1._id,
      department: "Engineering", date: new Date("2026-03-20"),
      description: "Flight + cab to client location", bankDetails: bankSnap,
    },
    {
      title: "Team lunch - project kickoff", type: "FOOD", amount: 1200,
      status: "APPROVED", submittedBy: emp._id, project: p1._id,
      department: "Engineering", date: new Date("2026-03-18"),
      description: "Team of 4 members, kickoff meeting", bankDetails: bankSnap,
      approvedBy: manager._id, approvedAt: new Date("2026-03-19"),
      approvalNote: "Verified with receipts",
    },
    {
      title: "Taxi - weekly office visits", type: "TRAVEL", amount: 640,
      status: "PAID", submittedBy: emp._id, project: p2._id,
      department: "Engineering", date: new Date("2026-03-10"),
      description: "Cab receipts attached", bankDetails: bankSnap,
      approvedBy: manager._id, approvedAt: new Date("2026-03-11"),
      paidBy: accounts._id, paidAt: new Date("2026-03-12"), txRef: "TXN20260312001",
    },
    {
      title: "Hotel stay Hyderabad", type: "ACCOMMODATION", amount: 4500,
      status: "REJECTED", submittedBy: emp._id, project: p2._id,
      department: "Engineering", date: new Date("2026-03-05"),
      description: "2 nights stay", bankDetails: bankSnap,
      rejectedBy: manager._id, rejectedAt: new Date("2026-03-06"),
      rejectionReason: "Receipt missing GST details",
    },
    {
      title: "Working dinner", type: "FOOD", amount: 890,
      status: "PENDING", submittedBy: tl._id, project: p1._id,
      department: "Engineering", date: new Date("2026-03-22"),
      description: "Client dinner meeting",
      bankDetails: { upiId: tl.upiId },
    },
    {
      title: "Bangalore visit", type: "TRAVEL", amount: 5200,
      status: "APPROVED", submittedBy: tl._id, project: p3._id,
      department: "Engineering", date: new Date("2026-03-15"),
      description: "2-day client visit",
      bankDetails: { upiId: tl.upiId },
      approvedBy: manager._id, approvedAt: new Date("2026-03-16"),
    },
  ]);
  console.log("🧾 Created 6 sample bills");

  console.log("\n🎉 Seed complete! Demo credentials (password: demo123):");
  console.log("   admin@company.com    → ADMIN");
  console.log("   manager@company.com  → MANAGER");
  console.log("   tl@company.com       → TEAM_LEAD");
  console.log("   emp@company.com      → EMPLOYEE");
  console.log("   accounts@company.com → PAYMENT_ADMIN");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
