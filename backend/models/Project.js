const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  idea: { type: mongoose.Schema.Types.ObjectId, ref: "Idea" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  progress: { type: Number, min: 0, max: 100, default: 0 },
  status: { type: String, enum: ["planning", "in-progress", "completed"], default: "planning" },
  deadline: { type: Date },
}, { timestamps: true });
module.exports = mongoose.model("Project", projectSchema);
