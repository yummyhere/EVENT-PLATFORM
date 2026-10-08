/**
 * 404 Not Found Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', padding: '1.25rem', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', marginBottom: '1.25rem' }}>
        <HelpCircle size={48} />
      </div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: '#64748b', maxWidth: '450px', margin: '0 auto 2rem auto' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/events" className="btn btn-primary">
        <ArrowLeft size={16} />
        <span>Return to Events</span>
      </Link>
    </div>
  );
};

export default NotFound;
