const express = require("express");

const {
  startSession,
  completeSession,
  getUserProgress,
} = require("../controllers/progressController");

const router = express.Router();

router.post("/start", startSession);
router.post("/complete", completeSession);

router.get(
  "/user/:userId",
  getUserProgress
);

module.exports = router;