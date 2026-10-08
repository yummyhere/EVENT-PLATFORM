/**
 * Loading Spinner Component
 */
import React from 'react';

export const Loader = ({ message = 'Loading events...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner" />
      {message && <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{message}</p>}
    </div>
  );
};

export default Loader;
