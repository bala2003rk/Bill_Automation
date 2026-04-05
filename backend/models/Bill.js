const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["TRAVEL", "FOOD", "ACCOMMODATION", "MISCELLANEOUS"],
      required: true,
    },
    amount:      { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    date:        { type: Date, required: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "PAID"],
      default: "PENDING",
    },

    // Relations
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project:     { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    department:  { type: String, trim: true },

    // Receipt
    receiptUrl:      { type: String },
    receiptPublicId: { type: String }, // Cloudinary public_id for deletion

    // Snapshot of user bank details at time of submission
    bankDetails: {
      upiId:       String,
      bankAccount: String,
      ifsc:        String,
      bankName:    String,
    },

    // Approval
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    approvalNote: { type: String },

    // Rejection
    rejectedBy:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rejectedAt:      { type: Date },
    rejectionReason: { type: String },

    // Payment
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paidAt: { type: Date },
    txRef:  { type: String, trim: true },
  },
  { timestamps: true }
);

// Index for common queries
BillSchema.index({ submittedBy: 1, status: 1 });
BillSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Bill", BillSchema);
