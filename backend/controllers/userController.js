const User = require("../models/User");

// Create WQC
const createUser = async (req, res) => {
  try {
    const { name, email, phone, organization, designation, location } =
      req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      organization,
      designation,
      location,
    });

    res.status(201).json({
      message: "WQC created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create WQC",
      error: error.message,
    });
  }
};

// Get all WQCs
const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch WQCs",
      error: error.message,
    });
  }
};

// Get one WQC
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "WQC not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch WQC",
      error: error.message,
    });
  }
};

// Update WQC
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "WQC not found",
      });
    }

    res.status(200).json({
      message: "WQC updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update WQC",
      error: error.message,
    });
  }
};

// Delete WQC
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "WQC not found",
      });
    }

    res.status(200).json({
      message: "WQC deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete WQC",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};