const CaseStudy = require("../models/CaseStudy");
const Comment = require("../models/Comment");
const SupportGroup = require("../models/SupportGroup");


// Create case study
const createCaseStudy = async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      tags,
      status,
    } = req.body;

    const caseStudy = await CaseStudy.create({
      userId,
      title,
      description,
      tags,
      status,
    });

    res.status(201).json({
      message: "Case study created successfully",
      caseStudy,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create case study",
      error: error.message,
    });
  }
};

// Get all case studies
const getCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find()
      .populate("userId");

    res.status(200).json({
      count: caseStudies.length,
      caseStudies,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch case studies",
      error: error.message,
    });
  }
};

// Get case study
const getCaseStudyById = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(
      req.params.id
    ).populate("userId");

    if (!caseStudy) {
      return res.status(404).json({
        message: "Case study not found",
      });
    }

    res.status(200).json(caseStudy);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch case study",
      error: error.message,
    });
  }
};

// Update case study
const updateCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!caseStudy) {
      return res.status(404).json({
        message: "Case study not found",
      });
    }

    res.status(200).json({
      message: "Case study updated successfully",
      caseStudy,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update case study",
      error: error.message,
    });
  }
};

// Delete case study
const deleteCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndDelete(
      req.params.id
    );

    if (!caseStudy) {
      return res.status(404).json({
        message: "Case study not found",
      });
    }

    res.status(200).json({
      message: "Case study deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete case study",
      error: error.message,
    });
  }
};

// ==========================
// COMMENTS
// ==========================

// Add comment
const addComment = async (req, res) => {
  try {
    const {
      caseStudyId,
      userId,
      content,
    } = req.body;

    const caseStudy = await CaseStudy.findById(
      caseStudyId
    );

    if (!caseStudy) {
      return res.status(404).json({
        message: "Case study not found",
      });
    }

    const comment = await Comment.create({
      caseStudyId,
      userId,
      content,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

// Get comments
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      caseStudyId: req.params.caseStudyId,
    })
      .populate("userId")
      .sort({ createdAt: 1 });

    res.status(200).json({
      count: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};

// ==========================
// SUPPORT GROUPS
// ==========================

// Create support group
const createSupportGroup = async (req, res) => {
  try {
    const {
      name,
      description,
      caseStudyId,
    } = req.body;

    const supportGroup = await SupportGroup.create({
      name,
      description,
      caseStudyId,
    });

    res.status(201).json({
      message: "Support group created successfully",
      supportGroup,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create support group",
      error: error.message,
    });
  }
};

// Get support groups
const getSupportGroups = async (req, res) => {
  try {
    const supportGroups = await SupportGroup.find()
      .populate("caseStudyId")
      .populate("members");

    res.status(200).json({
      count: supportGroups.length,
      supportGroups,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch support groups",
      error: error.message,
    });
  }
};

// Join support group
const joinSupportGroup = async (req, res) => {
  try {
    const { userId } = req.body;

    const supportGroup = await SupportGroup.findById(
      req.params.id
    );

    if (!supportGroup) {
      return res.status(404).json({
        message: "Support group not found",
      });
    }

    if (supportGroup.members.includes(userId)) {
      return res.status(400).json({
        message: "User already belongs to this support group",
      });
    }

    supportGroup.members.push(userId);

    await supportGroup.save();

    res.status(200).json({
      message: "Joined support group successfully",
      supportGroup,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to join support group",
      error: error.message,
    });
  }
};

module.exports = {
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
};