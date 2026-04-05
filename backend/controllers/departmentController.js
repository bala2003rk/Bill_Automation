const Department = require("../models/Department");

exports.getAll = async (req, res) => {
  try {
    const depts = await Department.find().populate("manager", "name email").sort({ name: 1 });
    res.json({ departments: depts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, manager, budget } = req.body;
    if (!name) return res.status(400).json({ message: "Department name is required" });
    const dept = await Department.create({ name, manager, budget });
    res.status(201).json(dept);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Department already exists" });
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, manager, budget } = req.body;
    const dept = await Department.findByIdAndUpdate(
      req.params.id, { name, manager, budget }, { new: true }
    );
    if (!dept) return res.status(404).json({ message: "Department not found" });
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
