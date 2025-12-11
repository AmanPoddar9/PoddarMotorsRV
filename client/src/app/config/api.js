// API Configuration
// This file provides the correct API URL for both development and production

const BACKEND_URL = 'https://poddar-motors-rv-hkxu.vercel.app';

// IMPORTANT: This exports the actual function, not the result
// Components should call getAPIURL() to get the correct URL at runtime
export function getAPIURL() {
  // Server-side rendering or build time
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || BACKEND_URL;
  }
  
  // Client-side runtime
  // Check for env variable first
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // For localhost, use production backend (since local server may not be running)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return BACKEND_URL;
  }
  
  // For production, use current origin (for Vercel deployment)
  return window.location.origin;
}

// For backward compatibility, default export calls the function
// But components should preferably use named export
const API_URL = getAPIURL();
export default API_URL;
