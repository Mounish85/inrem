const express = require("express");

const {
  createSession,
  getCourseSessions,
  getSessionById,
  updateSession,
  deleteSession,
} = require("../controllers/sessionController");
const {
  startSession,
  completeSession,
} = require("../controllers/progressController");

const router = express.Router();

router.post("/", createSession);
router.post("/start", startSession);
router.post("/complete", completeSession);

router.get(
  "/course/:courseId",
  getCourseSessions
);

router.get("/:id", getSessionById);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

module.exports = router;