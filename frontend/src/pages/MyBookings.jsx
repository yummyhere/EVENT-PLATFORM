/**
 * User Dashboard - My Bookings Page
 * Protected page displaying Active vs Past bookings with cancel reservation capability
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, DollarSign, Clock, AlertTriangle, CheckCircle, ArrowRight, Ban } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'past'
  const [cancellingId, setCancellingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Fetch bookings for logged-in user
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/user/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
      setError('Could not load your reservations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Split bookings into active vs past
  const activeBookings = bookings.filter((b) => b.is_active);
  const pastBookings = bookings.filter((b) => !b.is_active);

  // Handle Booking Cancellation (Bonus feature)
  const handleCancelBooking = async (bookingId, eventTitle) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel your reservation for "${eventTitle}"? Your seats will be released.`
    );
    if (!confirmCancel) return;

    try {
      setCancellingId(bookingId);
      const res = await api.patch(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        setToast({
          show: true,
          message: 'Reservation cancelled successfully. Seats have been refunded.',
          type: 'success'
        });
        fetchBookings();
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      setToast({
        show: true,
        message: err.response?.data?.message || 'Failed to cancel reservation.',
        type: 'error'
      });
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="my-bookings-page container" style={{ paddingTop: '2rem' }}>
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
          My Event Reservations
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.3rem' }}>
          Manage your upcoming tickets and view past community event attendance.
        </p>
      </div>

      {/* Tabs Header */}
      <div className="tabs-header">
        <button
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <CheckCircle size={18} />
          <span>Active Bookings</span>
          <span className="tab-count">{activeBookings.length}</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          <Clock size={18} />
          <span>Past / Cancelled</span>
          <span className="tab-count">{pastBookings.length}</span>
        </button>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <Loader message="Loading your reservations..." />
      ) : error ? (
        <div className="alert alert-error">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      ) : activeTab === 'active' ? (
        /* Active Bookings Tab */
        activeBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Ticket size={28} />
            </div>
            <h3>No active reservations</h3>
            <p>You do not have any upcoming event tickets at the moment. Browse the event catalog to reserve your spot!</p>
            <Link to="/events" className="btn btn-primary">
              <span>Browse Events</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {activeBookings.map((b) => (
              <div key={b.id} className="booking-card">
                <div className="booking-main">
                  <div className="booking-header">
                    <span className="badge badge-success">Confirmed</span>
                    <span className="badge badge-primary">{b.event_category}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      Ref #{b.id}
                    </span>
                  </div>

                  <h3 className="booking-title">{b.event_title}</h3>

                  <div className="booking-details-grid">
                    <div className="booking-details-item">
                      <Calendar size={16} color="#2563eb" />
                      <span>{formatDate(b.event_date)}</span>
                    </div>
                    <div className="booking-details-item">
                      <MapPin size={16} color="#2563eb" />
                      <span>{b.event_location}</span>
                    </div>
                    <div className="booking-details-item">
                      <Ticket size={16} color="#2563eb" />
                      <span>
                        <strong>{b.tickets}</strong> ticket{b.tickets > 1 ? 's' : ''} (${Number(b.unit_price).toFixed(2)} each)
                      </span>
                    </div>
                    <div className="booking-details-item">
                      <Clock size={16} color="#64748b" />
                      <span>Booked on {new Date(b.booked_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-side-action">
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                      Total Paid
                    </div>
                    <div className="booking-total-price">
                      {Number(b.total_price) === 0 ? 'FREE' : `$${Number(b.total_price).toFixed(2)}`}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCancelBooking(b.id, b.event_title)}
                    disabled={cancellingId === b.id}
                    className="btn btn-danger-outline btn-sm"
                    title="Cancel booking and refund seats"
                  >
                    <Ban size={15} />
                    <span>{cancellingId === b.id ? 'Cancelling...' : 'Cancel Booking'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Past / Cancelled Tab */
        pastBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Clock size={28} />
            </div>
            <h3>No past booking history</h3>
            <p>You haven't attended or cancelled any events yet.</p>
          </div>
        ) : (
          <div className="bookings-list">
            {pastBookings.map((b) => (
              <div key={b.id} className="booking-card" style={{ opacity: 0.85, backgroundColor: '#fafbfc' }}>
                <div className="booking-main">
                  <div className="booking-header">
                    {b.status === 'cancelled' ? (
                      <span className="badge badge-error">Cancelled</span>
                    ) : (
                      <span className="badge badge-neutral">Completed</span>
                    )}
                    <span className="badge badge-neutral">{b.event_category}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      Ref #{b.id}
                    </span>
                  </div>

                  <h3 className="booking-title" style={{ color: '#334155' }}>{b.event_title}</h3>

                  <div className="booking-details-grid">
                    <div className="booking-details-item">
                      <Calendar size={16} />
                      <span>{formatDate(b.event_date)}</span>
                    </div>
                    <div className="booking-details-item">
                      <MapPin size={16} />
                      <span>{b.event_location}</span>
                    </div>
                    <div className="booking-details-item">
                      <Ticket size={16} />
                      <span>{b.tickets} ticket{b.tickets > 1 ? 's' : ''}</span>
                    </div>
                    <div className="booking-details-item">
                      <Clock size={16} />
                      <span>Booked on {new Date(b.booked_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-side-action">
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
                      Amount
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#64748b' }}>
                      {Number(b.total_price) === 0 ? 'FREE' : `$${Number(b.total_price).toFixed(2)}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MyBookings;
