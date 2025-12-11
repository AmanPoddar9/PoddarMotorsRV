// API Configuration
// This file provides the correct API URL for both development and production

// Config for API URL
// In production, we want to hit the Next.js proxy (same origin) to handle cookies correctly.
// But during BUILD time or SSR, we should hit the backend directly to avoid circular dependencies and timeouts.

const BACKEND_URL = 'https://poddar-motors-rv-hkxu.vercel.app';

let API_URL = process.env.NEXT_PUBLIC_API_URL;

// Client-side: Use current origin (Proxy)
if (typeof window !== 'undefined') {
  if (!API_URL) {
    API_URL = window.location.origin;
  }
} else {
  // Server-side / Build-time: Use backend directly
  // This prevents build errors where the build tries to fetch from the (possibly broken) live site
  if (!API_URL) {
    API_URL = BACKEND_URL;
  }
}

export default API_URL;
