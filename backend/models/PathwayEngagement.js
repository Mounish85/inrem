const mongoose = require("mongoose");

const pathwayEngagementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    pathway: {
      type: String,
      enum: ["saathi", "guided_mentoring", "trainer"],
      required: true,
    },

    status: {
      type: String,
      enum: ["interested", "active", "completed"],
      default: "interested",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PathwayEngagement",
  pathwayEngagementSchema
);