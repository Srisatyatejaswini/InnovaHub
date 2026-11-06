
const User = require("../models/User");
const Idea = require("../models/Idea");
const Like = require("../models/Like");
const Collaboration = require("../models/Collaboration");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      skills,
      bio,
      profileImage
    } = req.body || {};

    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // Check case-insensitively so an existing address with different
    // capitalization (for example, User@Email.com) is still recognized.
    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const existingUser = await User.findOne({
      email: { $regex: `^${escapedEmail}$`, $options: "i" }
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists. Please log in instead."
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "student",
      skills: Array.isArray(skills) ? skills : [],
      bio: typeof bio === "string" ? bio : "",
      profileImage: typeof profileImage === "string" ? profileImage : ""
    });

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    // The unique MongoDB index is the final protection against two
    // simultaneous registrations using the same email.
    if (error && error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists. Please log in instead."
      });
    }

    console.error("REGISTRATION ERROR:", error.message);
    return res.status(500).json({
      message: "Registration failed. Please try again."
    });
  }
};


// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};


// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Unable to get user",
      error: error.message
    });
  }
};


// Update profile
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      skills,
      bio,
      profileImage
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (skills !== undefined) {
      user.skills = skills;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Profile update failed",
      error: error.message
    });
  }
};


// Delete current user's account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Find ideas created by this user
    const userIdeas = await Idea.find({
      creator: userId,
    }).select("_id");

    const ideaIds = userIdeas.map((idea) => idea._id);

    // Delete likes made by this user
    await Like.deleteMany({
      user: userId,
    });

    // Delete likes on the user's ideas
    if (ideaIds.length > 0) {
      await Like.deleteMany({
        idea: { $in: ideaIds },
      });
    }

    // Delete user's ideas
    await Idea.deleteMany({
      creator: userId,
    });

    // Delete collaborations involving this user
    await Collaboration.deleteMany({
      $or: [
        { requester: userId },
        { creator: userId },
      ],
    });

    // Delete user's notifications
    await Notification.deleteMany({
      user: userId,
    });

    // Finally delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "Account deleted successfully",
    });

  } catch (error) {
    console.error("Delete account error:", error);

    res.status(500).json({
      message: "Unable to delete account",
      error: error.message,
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  deleteAccount,
};
