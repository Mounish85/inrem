const Attestation = require("../models/Attestation");

// Start attestation
const startAttestation = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    const attestation = await Attestation.findOneAndUpdate(
      {
        userId,
        sessionId,
      },
      {
        userId,
        sessionId,
        startAttestedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Session start attested",
      attestation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to start attestation",
      error: error.message,
    });
  }
};

// Record content access
const recordContentAccess = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    const attestation = await Attestation.findOneAndUpdate(
      {
        userId,
        sessionId,
      },
      {
        contentAccessedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!attestation) {
      return res.status(404).json({
        message: "Attestation not found",
      });
    }

    res.status(200).json({
      message: "Course content access recorded",
      attestation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to record content access",
      error: error.message,
    });
  }
};

// End attestation
const endAttestation = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    const attestation = await Attestation.findOneAndUpdate(
      {
        userId,
        sessionId,
      },
      {
        endAttestedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!attestation) {
      return res.status(404).json({
        message: "Attestation not found",
      });
    }

    res.status(200).json({
      message: "Session end attested",
      attestation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to end attestation",
      error: error.message,
    });
  }
};

module.exports = {
  startAttestation,
  recordContentAccess,
  endAttestation,
};