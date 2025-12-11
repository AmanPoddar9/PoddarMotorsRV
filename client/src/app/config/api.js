// API Configuration
// This file provides the correct API URL for both development and production

// Config for API URL
// Always point to the backend service; do not fall back to the frontend origin
// so that production requests consistently reach the API (important when the
// frontend and backend are deployed on different domains).

// Use the production domain instead of the old Vercel preview URL to avoid
// 403s that prevent the listings (and other API-driven sections) from
// loading on poddarmotors.com.
const BACKEND_URL = 'https://www.poddarmotors.com';

// Prefer an explicit environment override when available so server components
// (which do not see NEXT_PUBLIC_*) and client components stay in sync.
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : BACKEND_URL);

export default API_URL;
