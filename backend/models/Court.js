const mongoose = require("mongoose");

const CourtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Indoor", "Outdoor"], // Restricts values to only these two
    required: true,
  },
  // We store a base price here (e.g., 100 Rs) so we can change it later without changing code
  basePrice: {
    type: Number,
    required: true,
    default: 100,
  },
});

module.exports = mongoose.model("Court", CourtSchema);
