/**
 * Authentication Context Provider
 * Manages user authentication state, token persistence, and login/register/logout actions
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and restore auth state from localStorage on startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));

          // Optionally verify token validity with backend
          try {
            const res = await api.get('/auth/me');
            if (res.data.success && res.data.user) {
              setUser(res.data.user);
              localStorage.setItem('user', JSON.stringify(res.data.user));
            }
          } catch (verifyErr) {
            console.warn('Session verification failed, resetting auth state.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Error initializing auth state:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for unauthorized events emitted by Axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // Login handler
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    return response.data;
  };

  // Register handler
  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    return response.data;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook for consuming Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
