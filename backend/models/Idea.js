const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    technologies: {
      type: [String],
      default: [],
    },

    problem: {
      type: String,
      default: "",
    },

    solution: {
      type: String,
      default: "",
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "submitted", "approved", "rejected"],
      default: "submitted",
    },

    likes: {
     type: Number,
     default: 0,
    },

    likedBy: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
    },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Idea", ideaSchema);