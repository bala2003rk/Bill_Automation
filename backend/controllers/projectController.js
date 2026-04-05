const Project = require("../models/Project");

// GET /api/projects
exports.getAll = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    // Non-admin roles see only projects they are members of
    if (!["ADMIN", "MANAGER", "PAYMENT_ADMIN"].includes(req.user.role)) {
      filter.members = req.user._id;
    }

    const projects = await Project.find(filter)
      .populate("members",   "name email employeeId")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    // Append computed spent amount per project
    const Bill = require("../models/Bill");
    const withSpent = await Promise.all(
      projects.map(async (p) => {
        const agg = await Bill.aggregate([
          { $match: { project: p._id, status: { $in: ["APPROVED", "PAID"] } } },
          { $group: { _id: null, spent: { $sum: "$amount" } } },
        ]);
        const obj = p.toObject();
        obj.spent = agg[0]?.spent || 0;
        return obj;
      })
    );
    res.json({ projects: withSpent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/:id
exports.getById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members",   "name email employeeId department")
      .populate("createdBy", "name");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects
exports.create = async (req, res) => {
  try {
    const { name, clientName, location, status, budget, startDate, endDate } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });

    const project = await Project.create({
      name, clientName, location, status, budget, startDate, endDate,
      createdBy: req.user._id,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/projects/:id
exports.update = async (req, res) => {
  try {
    const allowed = ["name", "clientName", "location", "status", "budget", "startDate", "endDate"];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const project = await Project.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects/:id/members
exports.assignMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.members.map(String).includes(String(userId))) {
      project.members.push(userId);
      await project.save();
    }
    await project.populate("members", "name email employeeId");
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
