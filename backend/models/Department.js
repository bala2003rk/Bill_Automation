const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, unique: true, trim: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    budget:  { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", DepartmentSchema);
