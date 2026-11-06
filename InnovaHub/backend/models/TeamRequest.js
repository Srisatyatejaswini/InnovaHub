const mongoose = require("mongoose");
const teamRequestSchema = new mongoose.Schema({
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
}, { timestamps: true });
teamRequestSchema.index({ team: 1, requester: 1 }, { unique: true });
module.exports = mongoose.model("TeamRequest", teamRequestSchema);
