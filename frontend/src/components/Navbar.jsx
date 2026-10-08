/**
 * Navigation Bar Component
 * Matches the CommuniVibe mockup design with mobile hamburger menu
 */
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Ticket, LogIn, UserPlus, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/events" className="brand-logo" onClick={closeMenu}>
          <Calendar size={24} />
          <span>Communi<span style={{ color: '#2563eb' }}>Vibe</span></span>
        </Link>

        {/* Center Nav Links — desktop */}
        <nav className="nav-center-links nav-desktop">
          <NavLink
            to="/events"
            className={({ isActive }) => (isActive ? 'nav-center-link active' : 'nav-center-link')}
          >
            Events
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'nav-center-link active' : 'nav-center-link')}
          >
            About
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) => (isActive ? 'nav-center-link active' : 'nav-center-link')}
          >
            Categories
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? 'nav-center-link active' : 'nav-center-link')}
          >
            Contact
          </NavLink>
        </nav>

        {/* Right Side Auth Actions — desktop */}
        <nav className="nav-auth-links nav-desktop">
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

        {/* Hamburger toggle — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          <NavLink to="/events" className={({ isActive }) => (isActive ? 'nav-mobile-link active' : 'nav-mobile-link')} onClick={closeMenu}>Events</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-mobile-link active' : 'nav-mobile-link')} onClick={closeMenu}>About</NavLink>
          <NavLink to="/categories" className={({ isActive }) => (isActive ? 'nav-mobile-link active' : 'nav-mobile-link')} onClick={closeMenu}>Categories</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'nav-mobile-link active' : 'nav-mobile-link')} onClick={closeMenu}>Contact</NavLink>

          <div className="nav-mobile-divider" />

          {isAuthenticated ? (
            <>
              <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? 'nav-mobile-link active' : 'nav-mobile-link')} onClick={closeMenu}>
                <Ticket size={15} /> My Bookings
              </NavLink>
              <div className="nav-mobile-user">
                <div className="user-avatar-badge">{user?.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}</div>
                <span>{user?.name?.split(' ')[0] || 'User'}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-block" style={{ justifyContent: 'center' }}>
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <div className="nav-mobile-auth">
              <Link to="/login" className="btn btn-outline btn-block" style={{ justifyContent: 'center' }} onClick={closeMenu}>
                <LogIn size={15} /> Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-block" style={{ justifyContent: 'center' }} onClick={closeMenu}>
                <UserPlus size={15} /> Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
