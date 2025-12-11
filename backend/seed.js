// backend/seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

// Import Models
const Court = require("./models/Court");
const Coach = require("./models/Coach");
const PricingRule = require("./models/PricingRule");

// Data to Insert
const courts = [
  { name: "Court 1 (Indoor)", type: "Indoor", basePrice: 100 },
  { name: "Court 2 (Indoor)", type: "Indoor", basePrice: 100 },
  { name: "Court 3 (Outdoor)", type: "Outdoor", basePrice: 80 }, // Cheaper base price
  { name: "Court 4 (Outdoor)", type: "Outdoor", basePrice: 80 },
];

const coaches = [
  { name: "Coach John Doe", specialization: "Badminton Pro", hourlyRate: 200 },
  {
    name: "Coach Sarah Smith",
    specialization: "Fitness Expert",
    hourlyRate: 150,
  },
  {
    name: "Coach Mike Tyson",
    specialization: "Strength Training",
    hourlyRate: 250,
  },
];

const rules = [
  // Rule 1: Weekend Surge (+50 Rs)
  {
    name: "Weekend Surge",
    type: "fixed",
    value: 50,
    conditions: { days: [0, 6] }, // Sunday (0) and Saturday (6)
  },
  // Rule 2: Peak Hours (x1.5 Multiplier) - 6 PM to 9 PM
  {
    name: "Peak Hour Premium",
    type: "multiplier",
    value: 1.5,
    conditions: { startHour: 18, endHour: 21 },
  },
  // Rule 3: Indoor Premium (+30 Rs)
  {
    name: "Indoor Court Fee",
    type: "fixed",
    value: 30,
    conditions: { courtType: "Indoor" },
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔌 Connected to MongoDB...");

    // 1. Clear existing data
    await Court.deleteMany({});
    await Coach.deleteMany({});
    await PricingRule.deleteMany({});
    console.log("🧹 Cleared existing data...");

    // 2. Insert new data
    await Court.insertMany(courts);
    await Coach.insertMany(coaches);
    await PricingRule.insertMany(rules);

    console.log("✅ Seed Data Imported Successfully!");
    console.log("-----------------------------------");
    console.log(`Added ${courts.length} Courts`);
    console.log(`Added ${coaches.length} Coaches`);
    console.log(`Added ${rules.length} Pricing Rules`);

    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
