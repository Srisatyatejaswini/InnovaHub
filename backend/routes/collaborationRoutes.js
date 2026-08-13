const express = require("express");

const router = express.Router();

const {
  requestCollaboration,
  getReceivedCollaborations,
  getSentCollaborations,
  acceptCollaboration,
  rejectCollaboration,
  getMyTeams,
} = require("../controllers/collaborationController");

const authMiddleware = require("../middleware/authMiddleware");


// Send collaboration request
router.post(
  "/request",
  authMiddleware,
  requestCollaboration
);


// Requests received by current user
router.get(
  "/received",
  authMiddleware,
  getReceivedCollaborations
);


// Requests sent by current user
router.get(
  "/sent",
  authMiddleware,
  getSentCollaborations
);


// Accept request
router.put(
  "/:id/accept",
  authMiddleware,
  acceptCollaboration
);


// Reject request
router.put(
  "/:id/reject",
  authMiddleware,
  rejectCollaboration
);

router.get(
  "/teams",
  authMiddleware,
  getMyTeams
);

module.exports = router;