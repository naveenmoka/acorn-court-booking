System Design & Pricing Engine Approach

1. Database Design Strategy (MongoDB) For this project, I chose MongoDB (NoSQL) instead of a traditional SQL database. The primary reason for this choice was flexibility. In a booking system, business rules often change—for example, a gym might introduce a "Holiday Special" or a new "Premium Court" type next month. A rigid SQL schema would make these changes difficult, whereas MongoDB allows us to adapt easily.

I organized the database into four main collections:

Courts & Coaches: I separated these into their own collections. The Court model specifically includes a type field (Indoor vs. Outdoor). This distinction is critical because it allows the pricing engine to identify "Indoor" courts and automatically apply premium fees.

PricingRules: This is the most important part of my design. Instead of writing "hardcoded" logic in the code (like if day == Saturday), I stored rules as data in the database. Each rule has a condition (e.g., specific days or hours) and a value (e.g., +$50 or x1.5). This allows an administrator to change prices instantly without needing a developer to rewrite the code.

Bookings: This collection records the transaction. Crucially, I designed the schema to store a Pricing Breakdown Object, not just the final total price. This ensures that we have a permanent "receipt" showing exactly why a slot cost $150 (e.g., Base: $100 + Peak: $50) for future auditing.

2. The Dynamic Pricing Engine The assignment required that pricing rules "stack" (layer on top of each other). To solve this, I built a modular calculator utility.

The engine does not calculate randomly; it follows a strict Order of Operations to ensure fairness:

Base Price: It starts by calculating the standard rate for the time duration.

Fixed Additions: It applies flat fees first (e.g., adding +$30 for an Indoor Court).

Multipliers: It applies percentage increases last (e.g., x1.5 for Peak Hours).

I chose this order because it is the most logical way to price services. If we applied the multiplier first and the fixed fee last, the "Peak Hour" surge wouldn't account for the premium nature of the Indoor court.

3. Handling Concurrency (Double Booking) To prevent the common problem where two users book the same slot at the exact same millisecond, I implemented Atomic Transactions.

When a user clicks "Book," the system opens a transaction session. It simultaneously checks three things: is the court free? Is the coach free? Is the inventory available? If all three are "Yes," it saves the booking. If even one check fails, the entire transaction is cancelled. This guarantees that we never end up with a double-booked facility.
