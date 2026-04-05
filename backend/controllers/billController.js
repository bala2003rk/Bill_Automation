const Bill    = require("../models/Bill");
const User    = require("../models/User");
const Project = require("../models/Project");
const {
  sendSubmittedEmail,
  sendApprovedEmail,
  sendRejectedEmail,
  sendPaidEmail,
} = require("../services/emailService");

// ── Helper: build role-based filter ──────────────────────────────────────────
const roleFilter = (user) => {
  switch (user.role) {
    case "ADMIN":
    case "PAYMENT_ADMIN":
      return {};                                // see everything
    case "MANAGER":
      return { department: user.department };   // own department
    case "TEAM_LEAD":
      return { department: user.department };
    case "EMPLOYEE":
      return { submittedBy: user._id };         // own bills only
    default:
      return { submittedBy: user._id };
  }
};

// GET /api/bills
exports.getAll = async (req, res) => {
  try {
    const filter = roleFilter(req.user);
    const { status, type, page = 1, limit = 50 } = req.query;
    if (status) filter.status = status;
    if (type)   filter.type   = type;

    const bills = await Bill.find(filter)
      .populate("submittedBy", "name email employeeId department")
      .populate("project",     "name clientName")
      .populate("approvedBy",  "name")
      .populate("paidBy",      "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Bill.countDocuments(filter);
    res.json({ bills, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bills/my
exports.getMyBills = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { submittedBy: req.user._id };
    if (status) filter.status = status;

    const bills = await Bill.find(filter)
      .populate("project", "name clientName")
      .sort({ createdAt: -1 });
    res.json({ bills });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bills/stats  — quick counts for the logged-in user's scope
exports.getStats = async (req, res) => {
  try {
    const filter = roleFilter(req.user);
    const [pending, approved, rejected, paid] = await Promise.all([
      Bill.countDocuments({ ...filter, status: "PENDING"  }),
      Bill.countDocuments({ ...filter, status: "APPROVED" }),
      Bill.countDocuments({ ...filter, status: "REJECTED" }),
      Bill.countDocuments({ ...filter, status: "PAID"     }),
    ]);
    const totalAgg = await Bill.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    res.json({ pending, approved, rejected, paid, total: totalAgg[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bills/:id
exports.getById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate("submittedBy", "name email employeeId department upiId bankAccount ifsc bankName")
      .populate("project",    "name clientName location")
      .populate("approvedBy", "name email")
      .populate("rejectedBy", "name email")
      .populate("paidBy",     "name email");
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/bills  (multipart — file handled by Multer in route)
exports.create = async (req, res) => {
  try {
    const { title, type, amount, description, date, projectId } = req.body;
    if (!title || !type || !amount || !date)
      return res.status(400).json({ message: "title, type, amount and date are required" });

    const submitter = req.user;
    const bill = await Bill.create({
      title,
      type,
      amount: Number(amount),
      description,
      date: new Date(date),
      submittedBy: submitter._id,
      department:  submitter.department,
      project:     projectId || undefined,
      receiptUrl:  req.file?.path || req.file?.location || undefined,
      receiptPublicId: req.file?.filename || undefined,
      bankDetails: {
        upiId:       submitter.upiId,
        bankAccount: submitter.bankAccount,
        ifsc:        submitter.ifsc,
        bankName:    submitter.bankName,
      },
    });

    // Notify manager / team lead
    const approver = await User.findOne({
      role:       { $in: ["MANAGER", "TEAM_LEAD"] },
      department: submitter.department,
      isActive:   true,
    });
    if (approver) sendSubmittedEmail(bill, submitter, approver.email);

    const populated = await bill.populate("project", "name");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/bills/:id
exports.update = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    // Only submitter or admin can edit; only PENDING bills
    const isOwner = bill.submittedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "ADMIN";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "Forbidden" });
    if (bill.status !== "PENDING")
      return res.status(400).json({ message: "Only PENDING bills can be edited" });

    const allowed = ["title", "type", "amount", "description", "date", "project"];
    allowed.forEach((f) => { if (req.body[f] !== undefined) bill[f] = req.body[f]; });
    await bill.save();
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/bills/:id/approve
exports.approve = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate("submittedBy");
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    if (bill.status !== "PENDING")
      return res.status(400).json({ message: "Only PENDING bills can be approved" });

    bill.status     = "APPROVED";
    bill.approvedBy = req.user._id;
    bill.approvedAt = new Date();
    bill.approvalNote = req.body.note || "";
    await bill.save();

    // Email employee + CC payment admin
    const paymentAdmin = await User.findOne({ role: "PAYMENT_ADMIN", isActive: true });
    sendApprovedEmail(bill, bill.submittedBy, paymentAdmin?.email);

    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/bills/:id/reject
exports.reject = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: "Rejection reason is required" });

    const bill = await Bill.findById(req.params.id).populate("submittedBy");
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    if (bill.status !== "PENDING")
      return res.status(400).json({ message: "Only PENDING bills can be rejected" });

    bill.status          = "REJECTED";
    bill.rejectedBy      = req.user._id;
    bill.rejectedAt      = new Date();
    bill.rejectionReason = reason;
    await bill.save();

    sendRejectedEmail(bill, bill.submittedBy);
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/bills/:id/pay
exports.pay = async (req, res) => {
  try {
    const { txRef } = req.body;

    const bill = await Bill.findById(req.params.id).populate("submittedBy");
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    if (bill.status !== "APPROVED")
      return res.status(400).json({ message: "Only APPROVED bills can be marked paid" });

    bill.status = "PAID";
    bill.paidBy = req.user._id;
    bill.paidAt = new Date();
    bill.txRef  = txRef || "";
    await bill.save();

    sendPaidEmail(bill, bill.submittedBy);
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
