const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  idea: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, default: "" },
  status: { type: String, enum: ["submitted", "published"], default: "published" },
}, { timestamps: true });
module.exports = mongoose.model("Review", reviewSchema);
