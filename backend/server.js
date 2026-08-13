const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const ideaRoutes = require("./routes/ideaRoutes");
const collaborationRoutes = require("./routes/collaborationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "InnovaHub Backend is running" });
});

// Reuse the MongoDB connection in Vercel/serverless invocations.
let mongoConnectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not configured");
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose.connect(process.env.MONGO_URI);
  }

  try {
    await mongoConnectionPromise;
    console.log("MongoDB connected successfully");
  } catch (error) {
    mongoConnectionPromise = undefined;
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }

  return mongoose.connection;
};

// Ensure the database is connected before handling an API request.
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({ message: "Database connection unavailable" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/collaborations", collaborationRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  connectDB().catch(() => {});
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
