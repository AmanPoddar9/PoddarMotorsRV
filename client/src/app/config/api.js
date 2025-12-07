// API Configuration
// This file provides the correct API URL for both development and production

// Prefer an explicit NEXT_PUBLIC_API_URL. If it's missing (e.g., production builds
// that should talk to the same origin), fall back to the current window origin on
// the client. This keeps admin auth requests same-site so cookies are preserved.
// During SSR/build we can't read window, so default to the primary site origin.
let API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL && typeof window !== 'undefined') {
  API_URL = window.location.origin;
}

if (!API_URL) {
  API_URL = 'https://www.poddarmotors.com';
}

export default API_URL;
