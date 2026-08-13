const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    idea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user can like one idea only once
likeSchema.index(
  { idea: 1, user: 1 },
  { unique: true }
);

module.exports = mongoose.model("Like", likeSchema);