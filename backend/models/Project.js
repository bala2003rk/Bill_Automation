const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    clientName: { type: String, trim: true },
    location:   { type: String, trim: true },
    status: {
      type: String,
      enum: ["ACTIVE", "ON_HOLD", "COMPLETED"],
      default: "ACTIVE",
    },
    budget:    { type: Number, default: 0 },
    members:   [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    startDate: { type: Date },
    endDate:   { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
