const express = require("express");

const {
  createEngagement,
  getUserEngagements,
  updateEngagement,
  getJourneyRecommendation,
} = require("../controllers/engagementController");

const router = express.Router();

router.post("/", createEngagement);

router.get(
  "/user/:userId",
  getUserEngagements
);

router.get(
  "/user/:userId/recommendation",
  getJourneyRecommendation
);

router.put("/:id", updateEngagement);

module.exports = router;