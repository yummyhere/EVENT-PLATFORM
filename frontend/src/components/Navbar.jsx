/**
 * Navigation Bar Component
 * Matches the CommuniVibe mockup design
 */
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Ticket, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/events" className="brand-logo">
          <Calendar size={24} />
          <span>Communi<span style={{ color: '#2563eb' }}>Vibe</span></span>
        </Link>

        {/* Center Nav Links */}
        <nav className="nav-center-links">
          <NavLink
            to="/events"
            className={({ isActive }) => (isActive ? 'nav-center-link active' : 'nav-center-link')}
          >
            Events
          </NavLink>
          <a href="#" className="nav-center-link">About</a>
          <a href="#" className="nav-center-link">Categories</a>
          <a href="#" className="nav-center-link">Contact</a>
        </nav>

        {/* Right Side Auth Actions */}
        <nav className="nav-auth-links">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) => (isActive ? 'nav-center-link active' : 'nav-center-link')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Ticket size={15} />
                My Bookings
              </NavLink>
              <div className="nav-user-profile" style={{ borderLeft: 'none', gap: '0.5rem' }}>
                <div className="user-avatar-badge" title={user?.email}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                </div>
                <span className="user-greeting">{user?.name?.split(' ')[0] || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-nav-login"
                title="Log out"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-nav-login">
                <LogIn size={15} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ borderRadius: '8px' }}>
                <UserPlus size={15} />
                <span>Register</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
