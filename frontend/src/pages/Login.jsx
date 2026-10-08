/**
 * User Login Page
 * Handles user authentication with validation, demo autofill, and error messaging
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || '/events';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      const destination = location.state?.from?.pathname || '/events';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Failed to log in. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for evaluation demo
  const handleQuickDemoFill = () => {
    setEmail('demo@community.com');
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', marginBottom: '0.75rem' }}>
            <LogIn size={26} />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account to book and manage events</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-group">
              <Mail size={18} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-group">
              <Lock size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: '1.25rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="quick-demo-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.88rem', color: '#2563eb', marginBottom: '0.4rem' }}>
            <Sparkles size={16} />
            <span>Demo Credentials</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.6rem' }}>
            <strong>demo@community.com</strong> / <strong>password123</strong>
          </p>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="btn btn-secondary btn-sm"
          >
            Fill Demo Credentials
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748b' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: '#2563eb' }}>
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
