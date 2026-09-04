const mongoose = require("mongoose");

const attestationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    startAttestedAt: {
      type: Date,
    },

    contentAccessedAt: {
      type: Date,
    },

    endAttestedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

attestationSchema.index(
  { userId: 1, sessionId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attestation", attestationSchema);