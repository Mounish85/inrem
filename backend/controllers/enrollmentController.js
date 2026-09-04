const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const Course = require("../models/Course");

// Enroll WQC
const createEnrollment = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) {
      return res.status(404).json({
        message: "WQC not found",
      });
    }

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      userId,
      courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "WQC is already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      userId,
      courseId,
    });

    res.status(201).json({
      message: "Enrollment created successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create enrollment",
      error: error.message,
    });
  }
};

// Get enrollments of WQC
const getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      userId: req.params.userId,
    })
      .populate("courseId");

    res.status(200).json({
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch enrollments",
      error: error.message,
    });
  }
};

// Update enrollment status
const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    res.status(200).json({
      message: "Enrollment updated successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update enrollment",
      error: error.message,
    });
  }
};

module.exports = {
  createEnrollment,
  getUserEnrollments,
  updateEnrollment,
};