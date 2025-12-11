const PricingRule = require("../models/PricingRule");

/**
 * Calculates the total price based on rules and resources.
 */
const calculatePrice = async (court, coach, date, startTime, endTime) => {
  // 1. Calculate Duration
  const duration = endTime - startTime;

  // 2. Start with Base Price
  let currentPrice = court.basePrice * duration;

  let breakdown = {
    basePrice: currentPrice,
    rulesApplied: [],
    coachFee: 0,
    equipmentFee: 0,
  };

  // 3. Fetch Active Rules
  const rules = await PricingRule.find({});

  const fixedRules = [];
  const multiplierRules = [];

  // 4. Filter Rules
  rules.forEach((rule) => {
    let applies = false;

    // Condition A: Day of Week
    const dayOfWeek = new Date(date).getDay();
    if (rule.conditions.days && rule.conditions.days.includes(dayOfWeek)) {
      applies = true;
    }

    // Condition B: Time Range
    if (rule.conditions.startHour && rule.conditions.endHour) {
      if (
        startTime >= rule.conditions.startHour &&
        startTime < rule.conditions.endHour
      ) {
        applies = true;
      }
    }

    // Condition C: Court Type
    if (rule.conditions.courtType && rule.conditions.courtType === court.type) {
      applies = true;
    }

    if (applies) {
      if (rule.type === "fixed") fixedRules.push(rule);
      if (rule.type === "multiplier") multiplierRules.push(rule);
    }
  });

  // 5. Apply Fixed Additions
  fixedRules.forEach((rule) => {
    currentPrice += rule.value;

    breakdown.rulesApplied.push({
      ruleName: rule.name,
      amountAdded: rule.value,
    });
  });

  // 6. Apply Multipliers
  multiplierRules.forEach((rule) => {
    const increase = currentPrice * rule.value - currentPrice;
    currentPrice = currentPrice * rule.value;

    breakdown.rulesApplied.push({
      ruleName: rule.name,
      amountAdded: Math.round(increase),
    });
  });

  // 7. Add Coach Fee
  if (coach) {
    const coachCost = coach.hourlyRate * duration;
    currentPrice += coachCost;
    breakdown.coachFee = coachCost;
  }

  return { total: Math.round(currentPrice), breakdown };
};

module.exports = calculatePrice;
