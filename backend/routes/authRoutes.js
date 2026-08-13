const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  deleteAccount,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getCurrentUser);

router.put("/profile", protect, updateProfile);

router.delete("/account", protect, deleteAccount);

module.exports = router;