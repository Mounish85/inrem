const Session = require("../models/Session");
const Course = require("../models/Course");

// Create session
const createSession = async (req, res) => {
  try {
    const {
      courseId,
      sessionNumber,
      title,
      description,
      scheduledAt,
      status,
    } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const session = await Session.create({
      courseId,
      sessionNumber,
      title,
      description,
      scheduledAt,
      status,
    });

    res.status(201).json({
      message: "Session created successfully",
      session,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create session",
      error: error.message,
    });
  }
};

// Get all sessions for a course
const getCourseSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      courseId: req.params.courseId,
    }).sort({ sessionNumber: 1 });

    res.status(200).json({
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
};

// Get session by ID
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("courseId");

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch session",
      error: error.message,
    });
  }
};

// Update session
const updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    res.status(200).json({
      message: "Session updated successfully",
      session,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update session",
      error: error.message,
    });
  }
};

// Delete session
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    res.status(200).json({
      message: "Session deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete session",
      error: error.message,
    });
  }
};

module.exports = {
  createSession,
  getCourseSessions,
  getSessionById,
  updateSession,
  deleteSession,
};