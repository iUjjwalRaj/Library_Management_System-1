// Consistent API base URL for backend communication.
// Defaults to http://localhost:5001/api in local development.
// In production (Vercel / Cloudflare), configure VITE_API_URL in your hosting dashboard.
const envUrl = (import.meta.env.VITE_API_URL || '').trim();
const rawUrl = (envUrl || 'http://localhost:5001/api').replace(/\/+$/, '');

// Ensure /api is appended if omitted, preventing double /api or missing endpoints.
export const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;
