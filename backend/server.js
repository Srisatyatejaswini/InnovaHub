const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const collaborationRoutes = require("./routes/collaborationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const projectRoutes = require("./routes/projectRoutes");
const adminRoutes = require("./routes/adminRoutes");
const teamRoutes = require("./routes/teamRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/collaborations", collaborationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teams", teamRoutes);

// Serve the React app when running as a normal Node server (Render/local production).
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  const frontendPath = path.join(__dirname, "..", "frontend", "dist");
  app.use(express.static(frontendPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "InnovaHub API" });
});

app.get("/", (req, res) => {
  if (process.env.VERCEL) {
    return res.json({ message: "InnovaHub API is running" });
  }
  res.json({ message: "InnovaHub Backend is running" });
});

// Connect once and reuse the connection in serverless invocations.
let mongoPromise;
function connectMongo() {
  if (!process.env.MONGO_URI) {
    return Promise.reject(new Error("MONGO_URI environment variable is not set"));
  }
  if (!mongoPromise) {
    mongoPromise = mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB connected successfully");
      return mongoose.connection;
    }).catch((error) => {
      mongoPromise = undefined;
      console.error("MongoDB connection failed:", error.message);
      throw error;
    });
  }
  return mongoPromise;
}

// Vercel waits for the returned promise before invoking the handler.
async function handler(req, res) {
  try {
    await connectMongo();
    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Database connection failed",
      error: process.env.NODE_ENV === "production" ? "Database unavailable" : error.message
    });
  }
}

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectMongo().catch(() => {});
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = process.env.VERCEL ? handler : app;
