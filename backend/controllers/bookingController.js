const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Court = require("../models/Court");
const Coach = require("../models/Coach");
const calculatePrice = require("../utils/priceCalculator");

const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // START ATOMIC TRANSACTION

  try {
    const { courtId, coachId, date, startTime, endTime, userEmail } = req.body;

    // 1. Validate Inputs
    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }

    // 2. Fetch Resources
    const court = await Court.findById(courtId).session(session);
    if (!court) throw new Error("Court not found");

    let coach = null;
    if (coachId) {
      coach = await Coach.findById(coachId).session(session);
      if (!coach) throw new Error("Coach not found");
    }

    // 3. CHECK COURT AVAILABILITY (The Overlap Check)
    // Logic: A booking overlaps if (StartA < EndB) and (EndA > StartB)
    const existingCourtBooking = await Booking.findOne({
      court: courtId,
      date: date,
      status: "confirmed",
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    }).session(session);

    if (existingCourtBooking) {
      throw new Error("Court is already booked for this time slot.");
    }

    // 4. CHECK COACH AVAILABILITY (If coach selected)
    if (coachId) {
      const existingCoachBooking = await Booking.findOne({
        coach: coachId,
        date: date,
        status: "confirmed",
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
      }).session(session);

      if (existingCoachBooking) {
        throw new Error("Coach is unavailable for this time slot.");
      }
    }

    // 5. CALCULATE PRICE
    // Note: We run this outside the session usually, but since it's read-only it's fine.
    const { total, breakdown } = await calculatePrice(
      court,
      coach,
      date,
      startTime,
      endTime
    );

    // 6. CREATE BOOKING
    const newBooking = new Booking({
      court: courtId,
      coach: coachId || null,
      userEmail,
      date,
      startTime,
      endTime,
      totalPrice: total,
      pricingBreakdown: breakdown,
    });

    await newBooking.save({ session });

    // 7. COMMIT TRANSACTION
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      data: newBooking,
      message: "Booking confirmed successfully!",
    });
  } catch (error) {
    // 8. ROLLBACK IF ANYTHING FAILS
    await session.abortTransaction();
    res.status(400).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Get all bookings (for the grid)
// @route   GET /api/bookings
const getBookings = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const bookings = await Booking.find({
      date: date,
      status: "confirmed",
    }).select("court startTime endTime userEmail"); // Send only necessary data to frontend

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBookings };
