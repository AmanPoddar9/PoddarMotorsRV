// API Configuration
// This file provides the correct API URL for both development and production

// Config for API URL
// Always resolve the API URL from the environment or fall back to the backend host
// to ensure client and server requests target the API service directly.

const BACKEND_URL = 'https://poddar-motors-rv-hkxu.vercel.app';

const API_URL = process.env.NEXT_PUBLIC_API_URL || BACKEND_URL;

export default API_URL;
