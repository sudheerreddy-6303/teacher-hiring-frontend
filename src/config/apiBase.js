/** API base URL — build-time env + runtime config.js fallback */
export default function apiBase() {
  return (
    process.env.REACT_APP_API_URL ||
    (typeof window !== 'undefined' && window.__ACADHR_API_URL__) ||
    'http://localhost:5000/api'
  );
}

export function apiOrigin() {
  return apiBase().replace(/\/api\/?$/, '');
}
