// backend/routes/resourceRoutes.js
const express = require("express");
const router = express.Router();
const Court = require("../models/Court");
const Coach = require("../models/Coach");

// @desc    Get all courts
// @route   GET /api/courts
router.get("/courts", async (req, res) => {
  try {
    const courts = await Court.find({});
    res.json(courts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all coaches
// @route   GET /api/coaches
router.get("/coaches", async (req, res) => {
  try {
    const coaches = await Coach.find({});
    res.json(coaches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
