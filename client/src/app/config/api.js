// API Configuration
// This file provides the correct API URL for both development and production

// Config for API URL
// Always point to the backend service; do not fall back to the frontend origin
// so that production requests consistently reach the API (important when the
// frontend and backend are deployed on different domains).

const BACKEND_URL = 'https://poddar-motors-rv-hkxu.vercel.app';

const API_URL = process.env.NEXT_PUBLIC_API_URL || BACKEND_URL;

export default API_URL;
