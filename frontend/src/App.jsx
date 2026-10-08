/**
 * Main Application Component
 * Sets up lazy-loaded routing structure, authentication provider, layout wrapper and footer
 */
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Events from './pages/Events'; // Keep homepage eager for instant LCP

// Lazy-load other routes so initial JS payload is tiny
const EventDetail = lazy(() => import('./pages/EventDetail'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const About = lazy(() => import('./pages/About'));
const Categories = lazy(() => import('./pages/Categories'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const App = () => {
  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <Suspense fallback={<div className="spinner-container"><div className="spinner" /></div>}>
          <Routes>
            {/* Default Redirect to Events */}
            <Route path="/" element={<Navigate to="/events" replace />} />

            {/* Public Event Browsing */}
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Dashboard Route */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} CommuniVibe Platform. Built with React, Node.js, Express & SQLite3.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
