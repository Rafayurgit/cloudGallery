const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    provider: { type: String, required: true, enum: ["google"] },
    providerFileId: { type: String, required: true },
    size: { type: Number, default: 0 },
    mimeType: { type: String, default: "application/octet-stream" }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const File = mongoose.model("File", fileSchema);
module.exports = File;
