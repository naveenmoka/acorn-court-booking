const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    // Links to other tables
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: true,
    },
    coach: { type: mongoose.Schema.Types.ObjectId, ref: "Coach" },
    userEmail: { type: String, required: true },

    // Time Details
    date: { type: Date, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },

    // Resources
    equipment: {
      rackets: { type: Number, default: 0 },
      shoes: { type: Number, default: 0 },
    },

    // MONEY (The Receipt)
    totalPrice: { type: Number, required: true },
    pricingBreakdown: {
      basePrice: { type: Number },
      rulesApplied: [
        // List of rules that triggered (e.g. "Weekend Surge: +50")
        {
          ruleName: { type: String },
          amountAdded: { type: Number },
        },
      ],
      coachFee: { type: Number },
      equipmentFee: { type: Number },
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
