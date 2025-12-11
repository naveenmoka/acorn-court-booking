# Acorn Globus - Badminton Court Booking System

A full-stack resource management application for a sports facility. This system handles complex **Multi-Resource Scheduling** (Courts + Coaches + Inventory) and features a **Dynamic Pricing Engine** that calculates costs in real-time based on configurable business rules.

## 🚀 Live Demo

[View Live Application](YOUR_VERCEL_LINK_HERE)

---

## 🌟 Key Features

### 1. Multi-Resource Booking

- **Unified Transaction:** Users can book a Court, rent Equipment, and hire a Coach in a single flow.
- **Atomic Consistency:** Uses MongoDB Sessions (`startTransaction`) to ensure that if any resource (e.g., the Coach) is unavailable, the entire booking fails, preventing partial data corruption.

### 2. Dynamic Pricing Engine

- **Stacking Logic:** The system applies pricing rules in a specific order:
  1.  **Base Price:** Standard hourly rate ($100/hr).
  2.  **Fixed Modifiers:** Adds premiums (e.g., +$30 for Indoor Courts).
  3.  **Multipliers:** Applies surges (e.g., x1.5 for Peak Hours).
- **Real-Time Calculation:** The frontend updates the receipt instantly as users select slots or add resources.

### 3. Concurrency Handling

- Implements optimistic concurrency controls to prevent **Double Bookings**.
- If two users try to book the exact same slot simultaneously, the database transaction ensures only one succeeds.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), Redux Toolkit, Tailwind CSS, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose) with Transaction support.

---

## 📂 Project Structure

```bash
/root
  ├── /backend            # Server-side logic
  │    ├── /config        # DB connection
  │    ├── /controllers   # Booking logic & transactions
  │    ├── /models        # Database Schemas (Court, Booking, PricingRule)
  │    ├── /routes        # API Endpoints
  │    ├── /utils         # Pricing Engine Logic
  │    ├── seed.js        # Data population script
  │    └── server.js      # Entry point
  │
  └── /frontend           # Client-side UI
       ├── /src
       │    ├── /components
       │    ├── /pages
       │    └── /redux    # State Management
       └── tailwind.config.js
```

⚙️ Setup Instructions
Follow these steps to run the project locally.

Prerequisites
Node.js (v14+)

MongoDB Atlas URI (Required for Transactions; local standalone Mongo may not support sessions).

Step 1: Clone the Repository
Bash

git clone [https://github.com/YOUR_USERNAME/acorn-court-booking.git](https://github.com/YOUR_USERNAME/acorn-court-booking.git)
cd acorn-court-booking
Step 2: Backend Setup
Navigate to the backend:

Bash

cd backend
Install dependencies:

Bash

npm install
Configure Environment: Create a .env file in backend/ and add:

Code snippet

PORT=5000
MONGO_URI=your_mongodb_connection_string
Seed the Database (Required): Populate the 4 Courts, 3 Coaches, and Pricing Rules.

Bash

npm run seed
Start the Server:

Bash

npm start
Step 3: Frontend Setup
Open a new terminal.

Navigate to the frontend:

Bash

cd frontend
Install dependencies:

Bash

npm install
Start React:

Bash

npm run dev
Visit http://localhost:5173.

🧠 Assumptions Made
Pricing Order: Fixed costs (Indoor Premium) are added before Multipliers (Peak Hour) to ensure the premium nature of the court is accounted for in the surge pricing.

Coach Fees: Coach fees are treated as flat hourly additions and are not subject to the Peak Hour multiplier.

Booking Window: Bookings are restricted to 1-hour slots for the MVP.

📝 System Design & Pricing Approach (Deliverable Write-Up)

1. Database Design Strategy (MongoDB)
   For this project, I chose MongoDB (NoSQL) to handle the flexible nature of the "Pricing Rules." Unlike a rigid SQL schema, MongoDB allows the admin to define complex rules (e.g., specific days, time ranges, or court types) without altering the database structure.

I organized the database into four main collections:

Courts & Coaches: Separated into distinct collections. The Court model includes a type field (Indoor vs. Outdoor), which is critical for the pricing engine to identify premium facilities.

PricingRules: Instead of hardcoding logic (e.g., if (Saturday) price += 50), I stored rules as data. This allows business logic to be updated dynamically without code deployment.

Bookings: This collection records the transaction. Crucially, I designed the schema to store a Pricing Breakdown Object, not just the final total. This ensures we have a permanent audit trail showing exactly why a slot cost $150 (e.g., Base: $100 + Peak: $50).

2. The Dynamic Pricing Engine
   The assignment required that pricing rules "stack." I implemented a modular calculator that follows a strict Order of Operations:

Base Price: Calculates the standard rate for the duration.

Fixed Additions: Applies flat fees first (e.g., +$30 for Indoor).

Multipliers: Applies percentage surges last (e.g., x1.5 for Peak Hours).

This ensures fairness; a 50% surge applies to the total value of the court, including its premium status.

3. Concurrency & Atomicity
   To prevent the "Double Booking" problem, I implemented Atomic Transactions using Mongoose Sessions. When a booking request is made, the system simultaneously validates the availability of the Court, the Coach, and the Inventory. If any check fails, the transaction aborts, ensuring data consistency and preventing race conditions.
