const express = require("express");

const {
  createIdea,
  getIdeas,
  getIdeaById,
  getMyIdeas,
  likeIdea,
  updateIdea,
  deleteIdea,
} = require("../controllers/ideaController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all ideas - PUBLIC
router.get("/", getIdeas);

// Get my ideas - LOGIN REQUIRED
router.get(
  "/my",
  authMiddleware,
  getMyIdeas
);

// Get one idea - PUBLIC
router.get(
  "/:id",
  getIdeaById
);

// Create idea - LOGIN REQUIRED
router.post(
  "/",
  authMiddleware,
  createIdea
);

// Like / Unlike - LOGIN REQUIRED
router.post(
  "/:id/like",
  authMiddleware,
  likeIdea
);

// Update idea - LOGIN REQUIRED
router.put(
  "/:id",
  authMiddleware,
  updateIdea
);

// Delete idea - LOGIN REQUIRED
router.delete(
  "/:id",
  authMiddleware,
  deleteIdea
);

module.exports = router;