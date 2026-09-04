const Assessment = require("../models/Assessment");
const AssessmentResult = require("../models/AssessmentResult");

// Create assessment
const createAssessment = async (req, res) => {
  try {
    const {
      courseId,
      type,
      title,
      questions,
    } = req.body;

    const assessment = await Assessment.create({
      courseId,
      type,
      title,
      questions,
    });

    res.status(201).json({
      message: "Assessment created successfully",
      assessment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create assessment",
      error: error.message,
    });
  }
};

// Get assessment
const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        message: "Assessment not found",
      });
    }

    res.status(200).json(assessment);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assessment",
      error: error.message,
    });
  }
};

// Get assessments for course
const getCourseAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({
      courseId: req.params.courseId,
    });

    res.status(200).json({
      count: assessments.length,
      assessments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assessments",
      error: error.message,
    });
  }
};

// Submit assessment result
const submitAssessment = async (req, res) => {
  try {
    const {
      userId,
      assessmentId,
      score,
    } = req.body;

    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      return res.status(404).json({
        message: "Assessment not found",
      });
    }

    const result = await AssessmentResult.create({
      userId,
      assessmentId,
      score,
    });

    res.status(201).json({
      message: "Assessment submitted successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit assessment",
      error: error.message,
    });
  }
};

// Get user's assessment results
const getUserAssessmentResults = async (req, res) => {
  try {
    const results = await AssessmentResult.find({
      userId: req.params.userId,
    }).populate("assessmentId");

    res.status(200).json({
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch assessment results",
      error: error.message,
    });
  }
};

module.exports = {
  createAssessment,
  getAssessmentById,
  getCourseAssessments,
  submitAssessment,
  getUserAssessmentResults,
};