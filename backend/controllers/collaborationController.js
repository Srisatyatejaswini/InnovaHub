const Collaboration = require("../models/Collaboration");
const Notification = require("../models/Notification");
const Idea = require("../models/Idea");

// Send collaboration request
const requestCollaboration = async (req, res) => {
  try {
    const { ideaId, message } = req.body;
    const requesterId = req.user.id;

    const idea = await Idea.findById(ideaId);

    if (!idea) {
      return res.status(404).json({
        message: "Idea not found",
      });
    }

    if (idea.creator.toString() === requesterId) {
      return res.status(400).json({
        message: "You cannot request collaboration on your own idea",
      });
    }

    const existingRequest = await Collaboration.findOne({
      idea: ideaId,
      requester: requesterId,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You have already requested collaboration for this idea",
      });
    }

    const collaboration = await Collaboration.create({
      idea: ideaId,
      requester: requesterId,
      creator: idea.creator,
      message: message || "",
    });

    await Notification.create({
      user: idea.creator,
      title: "New Collaboration Request 🤝",
      message: "Someone is interested in collaborating on your idea.",
      type: "collaboration",
    });

    res.status(201).json({
      message: "Collaboration request sent successfully",
      collaboration,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get collaboration requests received by logged-in user
const getReceivedCollaborations = async (req, res) => {
  try {
    const collaborations = await Collaboration.find({
      creator: req.user.id,
    })
      .populate("requester", "name email role skills bio")
      .populate("idea", "title description category technologies")
      .sort({ createdAt: -1 });

    res.status(200).json({
      collaborations,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get collaboration requests sent by logged-in user
const getSentCollaborations = async (req, res) => {
  try {
    const collaborations = await Collaboration.find({
      requester: req.user.id,
    })
      .populate("creator", "name email role skills bio")
      .populate("idea", "title description category technologies")
      .sort({ createdAt: -1 });

    res.status(200).json({
      collaborations,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Accept collaboration request
const acceptCollaboration = async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(
      req.params.id
    );

    if (!collaboration) {
      return res.status(404).json({
        message: "Collaboration request not found",
      });
    }

    if (
      collaboration.creator.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    collaboration.status = "accepted";

    await collaboration.save();

    await Notification.create({
      user: collaboration.requester,
      title: "Collaboration Accepted 🎉",
      message:
        "Your collaboration request has been accepted.",
      type: "collaboration",
    });

    res.status(200).json({
      message: "Collaboration request accepted",
      collaboration,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Reject collaboration request
const rejectCollaboration = async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(
      req.params.id
    );

    if (!collaboration) {
      return res.status(404).json({
        message: "Collaboration request not found",
      });
    }

    if (
      collaboration.creator.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    collaboration.status = "rejected";

    await collaboration.save();

    await Notification.create({
      user: collaboration.requester,
      title: "Collaboration Request Rejected",
      message:
        "Your collaboration request was rejected.",
      type: "collaboration",
    });

    res.status(200).json({
      message: "Collaboration request rejected",
      collaboration,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getMyTeams = async (req, res) => {
  try {
    const userId = req.user.id;

    const teams = await Collaboration.find({
      status: "accepted",
      $or: [
        { creator: userId },
        { requester: userId },
      ],
    })
      .populate(
        "creator",
        "name email role skills bio"
      )
      .populate(
        "requester",
        "name email role skills bio"
      )
      .populate(
        "idea",
        "title description category technologies"
      )
      .sort({ updatedAt: -1 });

    res.status(200).json({
      teams,
    });
  } catch (error) {
    console.error("Get teams error:", error);

    res.status(500).json({
      message: "Unable to load teams",
    });
  }
};


module.exports = {
  requestCollaboration,
  getReceivedCollaborations,
  getSentCollaborations,
  acceptCollaboration,
  rejectCollaboration,
  getMyTeams,
};