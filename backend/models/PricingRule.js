const mongoose = require("mongoose");

const PricingRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // LOGIC TYPE:
  // 'fixed': Add a flat amount (e.g., +50)
  // 'multiplier': Multiply the total (e.g., x1.5)
  type: {
    type: String,
    enum: ["fixed", "multiplier"],
    required: true,
  },

  value: { type: Number, required: true },

  // CONDITIONS (When does this rule apply?)
  // We use objects to store specific conditions. If a field is null, it doesn't apply.
  conditions: {
    days: [{ type: Number }],

    startHour: { type: Number },
    endHour: { type: Number },

    courtType: { type: String, enum: ["Indoor", "Outdoor"] },
  },
});

module.exports = mongoose.model("PricingRule", PricingRuleSchema);
