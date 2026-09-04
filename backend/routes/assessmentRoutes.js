const express = require("express");

const {
  createAssessment,
  getAssessmentById,
  getCourseAssessments,
  submitAssessment,
  getUserAssessmentResults,
} = require("../controllers/assessmentController");

const router = express.Router();

router.post("/", createAssessment);

router.get(
  "/course/:courseId",
  getCourseAssessments
);

router.get("/:id", getAssessmentById);

router.post(
  "/submit",
  submitAssessment
);

router.get(
  "/results/user/:userId",
  getUserAssessmentResults
);

module.exports = router;