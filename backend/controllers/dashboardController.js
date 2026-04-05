const Bill    = require("../models/Bill");
const User    = require("../models/User");
const Project = require("../models/Project");

// Helper: last 6 months monthly data
const last6MonthsData = async (matchFilter = {}) => {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString("default", { month: "short" }),
      year:  d.getFullYear(),
      month: d.getMonth() + 1,
      start: new Date(d.getFullYear(), d.getMonth(), 1),
      end:   new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
    });
  }
  return Promise.all(
    months.map(async ({ label, start, end }) => {
      const agg = await Bill.aggregate([
        { $match: { ...matchFilter, createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: "$type", total: { $sum: "$amount" } } },
      ]);
      const obj = { month: label, travel: 0, food: 0, accommodation: 0, miscellaneous: 0, total: 0 };
      agg.forEach(({ _id, total }) => {
        obj[_id.toLowerCase()] = total;
        obj.total += total;
      });
      return obj;
    })
  );
};

// GET /api/dashboard/admin
exports.adminStats = async (req, res) => {
  try {
    const [totalBills, totalUsers, pending, paid, deptAgg, monthlyData] = await Promise.all([
      Bill.countDocuments(),
      User.countDocuments({ isActive: true }),
      Bill.countDocuments({ status: "PENDING" }),
      Bill.aggregate([{ $match: { status: "PAID" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Bill.aggregate([
        { $group: { _id: "$department", value: { $sum: "$amount" } } },
        { $sort: { value: -1 } },
      ]),
      last6MonthsData(),
    ]);
    const deptData = deptAgg.map(({ _id, value }) => ({ name: _id || "Uncategorised", value }));
    const totalPaid = paid[0]?.total || 0;
    res.json({ totalBills, totalUsers, pending, totalPaid, deptData, monthlyData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/manager
exports.managerStats = async (req, res) => {
  try {
    const dept = req.user.department;
    const filter = dept ? { department: dept } : {};
    const [teamBills, pendingCount, approvedCount, teamCount, monthlyData] = await Promise.all([
      Bill.countDocuments(filter),
      Bill.countDocuments({ ...filter, status: "PENDING"  }),
      Bill.countDocuments({ ...filter, status: "APPROVED" }),
      User.countDocuments({ department: dept, isActive: true }),
      last6MonthsData(filter),
    ]);
    const totalAgg = await Bill.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    res.json({ teamBills, pendingCount, approvedCount, teamCount, totalAmount: totalAgg[0]?.total || 0, monthlyData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/teamlead
exports.teamLeadStats = async (req, res) => {
  try {
    const dept = req.user.department;
    const filter = dept ? { department: dept } : {};
    const [teamBills, pendingCount, memberCount, monthlyData] = await Promise.all([
      Bill.countDocuments(filter),
      Bill.countDocuments({ ...filter, status: "PENDING" }),
      User.countDocuments({ department: dept, isActive: true }),
      last6MonthsData(filter),
    ]);
    res.json({ teamBills, pendingCount, memberCount, monthlyData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/employee
exports.employeeStats = async (req, res) => {
  try {
    const filter = { submittedBy: req.user._id };
    const [myBills, pendingCount, approvedCount, paidCount] = await Promise.all([
      Bill.countDocuments(filter),
      Bill.countDocuments({ ...filter, status: "PENDING"  }),
      Bill.countDocuments({ ...filter, status: "APPROVED" }),
      Bill.countDocuments({ ...filter, status: "PAID"     }),
    ]);
    const totalAgg = await Bill.aggregate([
      { $match: { ...filter, status: { $in: ["APPROVED", "PAID"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const recentBills = await Bill.find(filter)
      .populate("project", "name")
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({ myBills, pendingCount, approvedCount, paidCount, totalApproved: totalAgg[0]?.total || 0, recentBills });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/dashboard/payment
exports.paymentStats = async (req, res) => {
  try {
    const [pendingPayments, processedCount, totalPaidAgg] = await Promise.all([
      Bill.find({ status: "APPROVED" })
        .populate("submittedBy", "name email employeeId upiId bankAccount bankName")
        .sort({ approvedAt: 1 })
        .limit(20),
      Bill.countDocuments({ status: "PAID" }),
      Bill.aggregate([
        { $match: { status: "PAID" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);
    const monthlyData = await last6MonthsData({ status: "PAID" });
    res.json({
      pendingPayments,
      pendingCount: pendingPayments.length,
      processedCount,
      totalPaid: totalPaidAgg[0]?.total || 0,
      monthlyData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
