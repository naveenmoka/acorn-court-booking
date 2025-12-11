const mongoose = require("mongoose");

const CoachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Different coaches might have different rates (e.g., Level 1 vs Level 2)
  hourlyRate: { type: Number, default: 200 },
});

module.exports = mongoose.model("Coach", CoachSchema);
