const express = require("express");

const {
  createEnrollment,
  getUserEnrollments,
  updateEnrollment,
} = require("../controllers/enrollmentController");

const router = express.Router();

router.post("/", createEnrollment);

router.get(
  "/user/:userId",
  getUserEnrollments
);

router.put("/:id", updateEnrollment);

module.exports = router;