const mongoose = require("mongoose");

const supportGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    caseStudyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaseStudy",
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupportGroup", supportGroupSchema);