/**
 * Toast Notification System
 */
import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = ({ type = 'success', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${type}`}>
        {type === 'success' ? (
          <CheckCircle2 size={20} color="#16a34a" />
        ) : (
          <AlertCircle size={20} color="#dc2626" />
        )}
        <span style={{ flex: 1 }}>{message}</span>
        <button onClick={onClose} style={{ color: '#94a3b8', display: 'flex' }}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
