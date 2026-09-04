const Resource = require("../models/Resource");
const Session = require("../models/Session");

// Create resource
const createResource = async (req, res) => {
  try {
    const {
      sessionId,
      title,
      description,
      resourceUrl,
      resourceType,
    } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    const resource = await Resource.create({
      sessionId,
      title,
      description,
      resourceUrl,
      resourceType,
    });

    res.status(201).json({
      message: "Resource created successfully",
      resource,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create resource",
      error: error.message,
    });
  }
};

// Get resources for session
const getSessionResources = async (req, res) => {
  try {
    const resources = await Resource.find({
      sessionId: req.params.sessionId,
    });

    res.status(200).json({
      count: resources.length,
      resources,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch resources",
      error: error.message,
    });
  }
};

// Get resource
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("sessionId");

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch resource",
      error: error.message,
    });
  }
};

// Update resource
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(200).json({
      message: "Resource updated successfully",
      resource,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update resource",
      error: error.message,
    });
  }
};

// Delete resource
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(200).json({
      message: "Resource deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete resource",
      error: error.message,
    });
  }
};

module.exports = {
  createResource,
  getSessionResources,
  getResourceById,
  updateResource,
  deleteResource,
};