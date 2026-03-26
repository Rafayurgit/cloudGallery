const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tenantId: { type: String, required: true, index: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    plan: { type: String, default: "free", enum: ["free", "pro", "enterprise"] }
  },
  { timestamps: true }
);

// Ensure email uniqueness per tenant (not globally).
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
