const SessionProgress = require("../models/SessionProgress");
const User = require("../models/User");
const Course = require("../models/Course");
const Session = require("../models/Session");

// Start session
const startSession = async (req, res) => {
  try {
    const { userId, courseId, sessionId } = req.body;

    const progress = await SessionProgress.findOneAndUpdate(
      {
        userId,
        sessionId,
      },
      {
        userId,
        courseId,
        sessionId,
        status: "in_progress",
        startedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Session started",
      progress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to start session",
      error: error.message,
    });
  }
};

// Complete session
const completeSession = async (req, res) => {
  try {
    const progress = await SessionProgress.findOneAndUpdate(
      {
        userId: req.body.userId,
        sessionId: req.body.sessionId,
      },
      {
        status: "completed",
        completedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!progress) {
      return res.status(404).json({
        message: "Session progress not found",
      });
    }

    res.status(200).json({
      message: "Session completed",
      progress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to complete session",
      error: error.message,
    });
  }
};

// Get WQC progress
const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    const progress = await SessionProgress.find({
      userId,
    })
      .populate("courseId")
      .populate("sessionId")
      .sort({ "sessionId.sessionNumber": 1 });

    const completedSessions = progress.filter(
      (item) => item.status === "completed"
    ).length;

    const totalSessions = progress.length;

    const percentage =
      totalSessions > 0
        ? ((completedSessions / totalSessions) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      userId,
      completedSessions,
      totalSessions,
      progressPercentage: Number(percentage),
      progress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch progress",
      error: error.message,
    });
  }
};

module.exports = {
  startSession,
  completeSession,
  getUserProgress,
};