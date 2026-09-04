const express = require("express");

const {
  createCaseStudy,
  getCaseStudies,
  getCaseStudyById,
  updateCaseStudy,
  deleteCaseStudy,
  addComment,
  getComments,
  createSupportGroup,
  getSupportGroups,
  joinSupportGroup,
} = require("../controllers/caseStudyController");

const router = express.Router();

// --------------------
// Case Studies
// --------------------

router.post("/", createCaseStudy);
router.get("/", getCaseStudies);

// --------------------
// Support Groups
// --------------------

router.post(
  "/support-groups",
  createSupportGroup
);

router.get(
  "/support-groups",
  getSupportGroups
);

router.post(
  "/support-groups/:id/join",
  joinSupportGroup
);

// --------------------
// Comments
// --------------------

router.post(
  "/comments",
  addComment
);

router.get(
  "/:caseStudyId/comments",
  getComments
);

// --------------------
// Case Study by ID
// --------------------

router.get("/:id", getCaseStudyById);
router.put("/:id", updateCaseStudy);
router.delete("/:id", deleteCaseStudy);

module.exports = router;