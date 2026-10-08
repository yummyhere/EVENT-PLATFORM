/**
 * Events Browse Page - Redesigned to match CommuniVibe mockup
 * White hero with split layout, integrated search bar, and featured events horizontal grid
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Tag, CalendarDays, Users, ArrowRight, Frown } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import BookingModal from '../components/BookingModal';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [date, setDate] = useState('');
  const [upcomingOnly, setUpcomingOnly] = useState(true);

  // Booking Modal & Toast
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category && category !== 'All') params.category = category;
      if (date) params.date = date;
      if (upcomingOnly) params.upcoming = 'true';

      const res = await api.get('/events', { params });
      if (res.data.success) {
        setEvents(res.data.events || []);
        if (res.data.categories && categories.length === 0) {
          setCategories(res.data.categories);
        }
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Unable to load events. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, [search, category, date, upcomingOnly]);

  // Debounced effect
  useEffect(() => {
    const timer = setTimeout(() => { fetchEvents(); }, 250);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const handleBookClick = (event) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setSelectedEventForBooking(event);
  };

  const handleBookingSuccess = (successMessage) => {
    setToast({ show: true, message: successMessage || 'Booking confirmed!', type: 'success' });
    fetchEvents();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setDate('');
    setUpcomingOnly(false);
  };

  return (
    <div className="events-page-new">
      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* ============================================================
          HERO SECTION - White background, split layout
          ============================================================ */}
      <section className="hero-new">
        <div className="container hero-inner">
          {/* Left: Text Content */}
          <div className="hero-left">
            {/* Breadcrumb pill */}
            <div className="hero-breadcrumb">
              <Users size={14} />
              <span>Local Events &nbsp;•&nbsp; Real People &nbsp;•&nbsp; Stronger Communities</span>
            </div>

            {/* Heading */}
            <h1 className="hero-heading">
              Discover &amp; Join<br />
              <span className="hero-heading-blue">Local Events</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle-new">
              Explore workshops, tech meetups, cultural festivals, and<br />
              community gatherings happening right in your neighborhood.
            </p>

            {/* ---- Integrated Search Bar ---- */}
            <form className="hero-search-bar" onSubmit={handleSearch}>
              {/* Search Input */}
              <div className="hero-search-field hero-search-main">
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search by event title, keyword, or venue..."
                  aria-label="Search events by title, keyword, or venue"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="hero-search-input"
                />
              </div>

              {/* Divider */}
              <div className="hero-search-divider" />

              {/* Category */}
              <div className="hero-search-field hero-search-cat">
                <Tag size={15} color="#94a3b8" />
                <select
                  value={category}
                  aria-label="Filter events by category"
                  onChange={(e) => setCategory(e.target.value)}
                  className="hero-search-select"
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Divider */}
              <div className="hero-search-divider" />

              {/* Date */}
              <div className="hero-search-field hero-search-date">
                <CalendarDays size={15} color="#94a3b8" />
                <input
                  type="date"
                  aria-label="Filter events by date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="hero-search-input"
                  placeholder="dd/mm/yyyy"
                />
              </div>

              {/* Divider */}
              <div className="hero-search-divider" />

              {/* Upcoming Only toggle */}
              <label className="hero-search-toggle">
                <input
                  type="checkbox"
                  checked={upcomingOnly}
                  onChange={(e) => setUpcomingOnly(e.target.checked)}
                />
                <span>Upcoming Only</span>
              </label>

              {/* Search Button */}
              <button type="submit" className="hero-search-btn">
                <Search size={16} />
                Search
              </button>
            </form>
          </div>

          {/* Right: Hero Blob Image */}
          <div className="hero-right">
            <div className="hero-blob-wrap">
              {/* Blue blob background */}
              <div className="hero-blob-bg" />
              {/* Dot pattern */}
              <div className="hero-dots" />
              {/* Circular image */}
              <div className="hero-img-circle">
                <img
                  src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=75"
                  alt="Community gathering and events"
                  width="260"
                  height="260"
                  fetchPriority="high"
                  decoding="sync"
                />
              </div>
              {/* "Better Together" cursive badge */}
              <div className="hero-cursive-badge">
                Better Together
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURED EVENTS SECTION
          ============================================================ */}
      <section className="featured-section">
        <div className="container">
          {/* Section Header */}
          <div className="featured-header">
            <div className="featured-header-left">
              <span className="featured-label">FEATURED EVENTS</span>
              <div className="featured-title-row">
                <h2 className="featured-title">Don't Miss Out</h2>
                <div className="featured-title-line" />
              </div>
              <p className="featured-subtitle">
                Handpicked events from your community, designed to inspire,<br />
                connect and bring people together.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="btn-view-all"
            >
              View All Events <ArrowRight size={16} />
            </button>
          </div>

          {/* Events Content */}
          {loading ? (
            <Loader message="Loading latest events..." />
          ) : error ? (
            <div className="alert alert-error">
              <Frown size={20} />
              <span>{error}</span>
            </div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Search size={28} />
              </div>
              <h3>No events found</h3>
              <p>Try adjusting your search or filters.</p>
              <button onClick={handleResetFilters} className="btn btn-secondary">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="events-grid-new">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onBook={handleBookClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {selectedEventForBooking && (
        <BookingModal
          event={selectedEventForBooking}
          onClose={() => setSelectedEventForBooking(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default Events;
