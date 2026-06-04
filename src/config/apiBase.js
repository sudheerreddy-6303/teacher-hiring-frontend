/** Production backend on Railway (always use this for API calls from the live site) */
const RAILWAY_BACKEND_API = 'https://teacher-hiring-backend-production.up.railway.app/api';

/** API base URL — never use the frontend domain for API requests */
export default function apiBase() {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // Live site: always talk to backend service, not the React static host
    if (host.includes('railway.app') && host.includes('frontend')) {
      return RAILWAY_BACKEND_API;
    }
  }

  let url =
    process.env.REACT_APP_API_URL ||
    (typeof window !== 'undefined' && window.__ACADHR_API_URL__) ||
    'http://localhost:5000/api';

  // Wrong: API URL pointing at frontend returns HTML → "Invalid response from server"
  if (url.includes('frontend') && url.includes('railway.app')) {
    return RAILWAY_BACKEND_API;
  }

  return url;
}

export function apiOrigin() {
  return apiBase().replace(/\/api\/?$/, '');
}
