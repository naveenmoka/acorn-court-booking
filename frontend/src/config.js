// frontend/src/config.js
// If we are in production (Vite handles this), use the Render URL.
// Otherwise, use localhost.

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
