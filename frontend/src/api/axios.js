/**
 * Configured Axios Client
 * Handles base URL, authorization headers via Bearer token, and 401 session expiration handling
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If receiving 401 and not on a login/register request, clear invalid session
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Dispatch custom event for AuthContext to sync
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
