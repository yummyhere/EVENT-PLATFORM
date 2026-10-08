/**
 * Interactive Booking Modal Component
 * Calculates live prices, manages ticket quantity stepper, and handles booking submission
 */
import React, { useState } from 'react';
import { X, Ticket, AlertCircle, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import api from '../api/axios';

export const BookingModal = ({ event, onClose, onSuccess }) => {
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!event) return null;

  const maxTickets = Math.min(event.available_seats, 10); // sensible max booking limit per transaction
  const unitPrice = Number(event.price) || 0;
  const totalPrice = (unitPrice * tickets).toFixed(2);

  const handleIncrement = () => {
    if (tickets < maxTickets) {
      setTickets((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (tickets > 1) {
      setTickets((prev) => prev - 1);
    }
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) {
      setTickets(1);
    } else if (val > maxTickets) {
      setTickets(maxTickets);
    } else {
      setTickets(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/bookings', {
        event_id: event.id,
        tickets
      });

      if (response.data.success) {
        onSuccess(response.data.message || 'Tickets booked successfully!');
        onClose();
      }
    } catch (err) {
      console.error('Booking submission failed:', err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Failed to complete booking. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Ticket size={22} color="#2563eb" />
            <h2 className="modal-title">Book Tickets</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn" title="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Event Summary Box */}
            <div className="modal-event-summary">
              <h3 className="modal-event-title">{event.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: '#475569' }}>
                <div>📍 {event.location}</div>
                <div>📅 {new Date(event.event_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '0.2rem' }}>
                  Available seats: <span style={{ color: '#2563eb' }}>{event.available_seats} remaining</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{error}</span>
              </div>
            )}

            {/* Ticket Selector Stepper */}
            <div className="ticket-selector-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Select Number of Tickets</span>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>(Max: {maxTickets})</span>
              </label>
              <div className="ticket-stepper">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={tickets <= 1 || loading}
                  className="stepper-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxTickets}
                  value={tickets}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="stepper-input"
                />
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={tickets >= maxTickets || loading}
                  className="stepper-btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Live Price Calculation Breakdown */}
            <div className="price-breakdown">
              <div className="price-row">
                <span>Unit Price</span>
                <span>{unitPrice === 0 ? 'FREE' : `$${unitPrice.toFixed(2)}`}</span>
              </div>
              <div className="price-row">
                <span>Quantity</span>
                <span>{tickets} ticket{tickets > 1 ? 's' : ''}</span>
              </div>
              <div className="price-row total">
                <span>Total Amount Due</span>
                <span className="price-amount">{unitPrice === 0 ? '$0.00' : `$${totalPrice}`}</span>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || event.available_seats <= 0}
              className="btn btn-primary"
            >
              {loading ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Confirm Reservation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
