# Acorn Globus - Badminton Court Booking System

A full-stack application for managing sports facility scheduling with dynamic pricing and multi-resource booking.

## Features

- **Multi-Resource Scheduling:** Book courts and coaches in a single transaction.
- **Dynamic Pricing Engine:** Calculates costs based on Peak Hours, Weekends, and Court Type.
- **Concurrency Handling:** Prevents double bookings using MongoDB Transactions.
- **Visual Grid:** Interactive UI to view available slots.

## Tech Stack

- **Frontend:** React, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
# Create a .env file with: MONGO_URI=your_mongodb_connection_string
npm run seed  # Populates the database with 4 Courts & 3 Coaches
npm start
```
