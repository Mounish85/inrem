const express = require("express");

const {
  startAttestation,
  recordContentAccess,
  endAttestation,
} = require("../controllers/attestationController");

const router = express.Router();

router.post("/start", startAttestation);
router.post("/content", recordContentAccess);
router.post("/end", endAttestation);

module.exports = router;