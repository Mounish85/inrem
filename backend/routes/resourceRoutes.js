const express = require("express");

const {
  createResource,
  getSessionResources,
  getResourceById,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");

const router = express.Router();

router.post("/", createResource);

router.get(
  "/session/:sessionId",
  getSessionResources
);

router.get("/:id", getResourceById);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);

module.exports = router;