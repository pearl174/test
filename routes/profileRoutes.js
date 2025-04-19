const express = require("express");
const auth = require("../middleware/auth");
const { getProfile, updateProfile } = require("../controllers/profileController");

const router = express.Router();

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get("/", auth, getProfile);

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put("/", auth, updateProfile);

module.exports = router;
