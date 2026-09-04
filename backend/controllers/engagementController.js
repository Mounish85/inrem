const PathwayEngagement = require("../models/PathwayEngagement");
const axios = require("axios");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://localhost:8000";

// Join/choose pathway
const createEngagement = async (req, res) => {
  try {
    const {
      userId,
      pathway,
      status,
    } = req.body;

    const validPathways = [
      "saathi",
      "guided_mentoring",
      "trainer",
    ];

    if (!validPathways.includes(pathway)) {
      return res.status(400).json({
        message: "Invalid pathway",
      });
    }

    const engagement = await PathwayEngagement.create({
      userId,
      pathway,
      status,
    });

    res.status(201).json({
      message: "Pathway engagement created successfully",
      engagement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create pathway engagement",
      error: error.message,
    });
  }
};

// Get user's pathways
const getUserEngagements = async (req, res) => {
  try {
    const engagements = await PathwayEngagement.find({
      userId: req.params.userId,
    });

    res.status(200).json({
      count: engagements.length,
      engagements,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pathway engagements",
      error: error.message,
    });
  }
};

// Update pathway
const updateEngagement = async (req, res) => {
  try {
    const engagement =
      await PathwayEngagement.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!engagement) {
      return res.status(404).json({
        message: "Pathway engagement not found",
      });
    }

    res.status(200).json({
      message: "Pathway engagement updated successfully",
      engagement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update pathway engagement",
      error: error.message,
    });
  }
};

const getJourneyRecommendation = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const response = await axios.get(
            `${ML_SERVICE_URL}/recommend/${userId}`,
            {
                timeout: 10000
            }
        );

        return res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {

        console.error(
            "ML Service Error:",
            error.message
        );

        if (error.response) {
            return res.status(error.response.status).json({
                success: false,
                message: "ML service returned an error",
                error: error.response.data
            });
        }

        return res.status(503).json({
            success: false,
            message: "ML service is currently unavailable"
        });
    }
};

module.exports = {
  createEngagement,
  getUserEngagements,
  updateEngagement,
  getJourneyRecommendation
};