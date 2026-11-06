const Idea = require("../models/Idea");
const Like = require("../models/Like");
const Collaboration = require("../models/Collaboration");
const Notification = require("../models/Notification");

// Create a new idea
const createIdea = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      technologies,
      problem,
      solution,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message:
          "Title, description and category are required",
      });
    }

    const idea = await Idea.create({
      title,
      description,
      category,
      technologies: technologies || [],
      problem: problem || "",
      solution: solution || "",
      creator: req.user.id,
    });

    res.status(201).json({
      message: "Idea submitted successfully",
      idea,
    });
  } catch (error) {
    console.error("Create idea error:", error);

    res.status(500).json({
      message: "Server error while creating idea",
    });
  }
};

// Get all ideas
const getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find()
      .populate(
        "creator",
        "name email role skills"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      ideas,
    });
  } catch (error) {
    console.error("Get ideas error:", error);

    res.status(500).json({
      message:
        "Server error while fetching ideas",
    });
  }
};

// Get one idea
const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(
      req.params.id
    ).populate(
      "creator",
      "name email role skills bio"
    );

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    res.status(200).json({
      idea,
    });
  } catch (error) {
    console.error("Get idea error:", error);

    res.status(500).json({
      message:
        "Server error while fetching idea",
    });
  }
};

// Get ideas created by logged-in user
const getMyIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({
      creator: req.user.id,
    })
      .populate(
        "creator",
        "name email role skills"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      ideas,
    });
  } catch (error) {
    console.error(
      "Get my ideas error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching my ideas",
    });
  }
};

// Like / Unlike an idea
const likeIdea = async (req, res) => {
  try {
    const ideaId = req.params.id;
    const userId = req.user.id;

    const idea = await Idea.findById(ideaId);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    const existingLike = await Like.findOne({
      idea: ideaId,
      user: userId,
    });

    // Unlike
    if (existingLike) {
      await Like.deleteOne({
        _id: existingLike._id,
      });

      const likesCount =
        await Like.countDocuments({
          idea: ideaId,
        });

      idea.likes = likesCount;

      await idea.save();

      return res.status(200).json({
        message:
          "Idea unliked successfully",
        liked: false,
        likes: likesCount,
      });
    }

    // Like
    await Like.create({
      idea: ideaId,
      user: userId,
    });

    const likesCount =
      await Like.countDocuments({
        idea: ideaId,
      });

    idea.likes = likesCount;

    await idea.save();

    res.status(200).json({
      message: "Idea liked successfully",
      liked: true,
      likes: likesCount,
    });
  } catch (error) {
    console.error(
      "Like idea error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while liking idea",
      error: error.message,
    });
  }
};

// Update an idea
const updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(
      req.params.id
    );

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    // Only creator can edit
    if (
      idea.creator.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to edit this idea",
      });
    }

    const {
      title,
      description,
      category,
      technologies,
      problem,
      solution,
    } = req.body;

    // Update only fields provided
    idea.title =
      title ?? idea.title;

    idea.description =
      description ?? idea.description;

    idea.category =
      category ?? idea.category;

    idea.technologies =
      technologies ?? idea.technologies;

    idea.problem =
      problem ?? idea.problem;

    idea.solution =
      solution ?? idea.solution;

    await idea.save();

    res.status(200).json({
      message:
        "Idea updated successfully",
      idea,
    });
  } catch (error) {
    console.error(
      "Update idea error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating idea",
    });
  }
};

// Delete an idea
const deleteIdea = async (req, res) => {
  try {
    const ideaId = req.params.id;
    const userId = req.user.id;

    // Find the idea
    const idea = await Idea.findById(
      ideaId
    );

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    // Only creator can delete
    if (
      idea.creator.toString() !== userId
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to delete this idea",
      });
    }

    // Delete likes
    await Like.deleteMany({
      idea: ideaId,
    });

    // Find collaborations
    const collaborations =
      await Collaboration.find({
        idea: ideaId,
      });

    // Delete collaborations
    await Collaboration.deleteMany({
      idea: ideaId,
    });

    // Delete collaboration notifications
    const userIds = [];

    collaborations.forEach(
      (collaboration) => {
        userIds.push(
          collaboration.requester,
          collaboration.creator
        );
      }
    );

    if (userIds.length > 0) {
      await Notification.deleteMany({
        user: {
          $in: userIds,
        },
        type: "collaboration",
      });
    }

    // Delete the idea
    await Idea.deleteOne({
      _id: ideaId,
    });

    res.status(200).json({
      message:
        "Idea deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete idea error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while deleting idea",
    });
  }
};

module.exports = {
  createIdea,
  getIdeas,
  getIdeaById,
  getMyIdeas,
  likeIdea,
  updateIdea,
  deleteIdea,
};