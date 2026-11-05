const mongoose = require("mongoose");
const mentorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  expertise: { type: [String], default: [] },
  organization: { type: String, default: "" },
  availability: { type: String, default: "" },
  bio: { type: String, default: "" },
}, { timestamps: true });
module.exports = mongoose.model("Mentor", mentorSchema);
