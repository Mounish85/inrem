const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// Authentication middleware
const { requireAuth } = require("./middleware/authMiddleware");

// App
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes = require("./routes/progressRoutes");
const attestationRoutes = require("./routes/attestationRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const engagementRoutes = require("./routes/engagementRoutes");
const caseStudyRoutes = require("./routes/caseStudyRoutes");

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to INREM Foundation",
  });
});

// Authentication routes
// These must remain public
app.use("/api/auth", authRoutes);

// Protect all routes below this point
app.use(requireAuth);

// Protected API routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/attestations", attestationRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/engagements", engagementRoutes);
app.use("/api/case-studies", caseStudyRoutes);

// Connect to MongoDB
const mongoUri = (process.env.MONGO_URI || "").trim().replace(/;+$/, "");
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server running on the port ${process.env.PORT || 3000}`
      );
    });
  })
  .catch((err) => {
    console.log(
      "MongoDB connection failed:",
      err.message
    );
  });