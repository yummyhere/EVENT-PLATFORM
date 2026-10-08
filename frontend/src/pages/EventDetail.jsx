/**
 * Event Detail Page
 * Shows complete event information, location, date, pricing, availability and booking button
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket, ArrowLeft, Clock, ShieldCheck, Tag } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

export const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/events/${id}`);
      if (res.data.success) {
        setEvent(res.data.event);
      }
    } catch (err) {
      console.error('Failed to fetch event:', err);
      setError('Event not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleBookClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (msg) => {
    setToast({
      show: true,
      message: msg || 'Reservation confirmed successfully!',
      type: 'success'
    });
    fetchEvent();
  };

  if (loading) return <Loader message="Loading event details..." />;
  if (error || !event) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h2>{error || 'Event Not Found'}</h2>
        <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Events
        </Link>
      </div>
    );
  }

  const isSoldOut = event.available_seats <= 0;
  const isPast = new Date(event.event_date) < new Date();
  const isFree = Number(event.price) === 0;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Back button */}
      <Link to="/events" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} />
        <span>Back to All Events</span>
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Main Details */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <img
            src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'}
            alt={event.title}
            style={{ width: '100%', height: '360px', objectFit: 'cover' }}
          />

          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', alignItems: 'center' }}>
              <span className="badge badge-primary">{event.category}</span>
              {isPast && <span className="badge badge-neutral">Ended</span>}
              {isSoldOut && !isPast && <span className="badge badge-error">Sold Out</span>}
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              {event.title}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Calendar size={18} color="#2563eb" />
                <span>
                  {new Date(event.event_date).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={18} color="#2563eb" />
                <span>{event.location}</span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e293b' }}>
              About this Event
            </h3>
            <p style={{ lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-line' }}>
              {event.description}
            </p>
          </div>
        </div>

        {/* Sidebar Booking Card */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Ticket Price</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb' }}>
              {isFree ? 'FREE' : `$${Number(event.price).toFixed(2)}`}
            </span>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Capacity:</span>
              <strong>{event.total_seats} seats</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Remaining Seats:</span>
              <strong style={{ color: event.available_seats <= 5 ? '#dc2626' : '#16a34a' }}>
                {event.available_seats} seats
              </strong>
            </div>
          </div>

          {isPast ? (
            <button className="btn btn-outline btn-block btn-lg" disabled>
              Event has ended
            </button>
          ) : isSoldOut ? (
            <button className="btn btn-danger-outline btn-block btn-lg" disabled>
              Sold Out
            </button>
          ) : (
            <button onClick={handleBookClick} className="btn btn-primary btn-block btn-lg">
              <Ticket size={18} />
              <span>Book Ticket</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', color: '#64748b', fontSize: '0.8rem', justifyContent: 'center' }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>Instant confirmation & guaranteed seats</span>
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
        <BookingModal
          event={event}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default EventDetail;
