const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:   { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "TEAM_LEAD", "EMPLOYEE", "PAYMENT_ADMIN"],
      default: "EMPLOYEE",
    },
    department:  { type: String, trim: true },
    employeeId:  { type: String, unique: true, sparse: true, trim: true },

    // Payment details
    upiId:       { type: String, trim: true },
    bankAccount: { type: String, trim: true },
    ifsc:        { type: String, trim: true },
    bankName:    { type: String, trim: true },
    qrCodeUrl:   { type: String },

    isActive:  { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password helper
UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Never send password in JSON responses
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
