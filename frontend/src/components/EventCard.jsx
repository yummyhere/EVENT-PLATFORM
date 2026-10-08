/**
 * Event Card Component - Redesigned to match CommuniVibe mockup
 * Full image background card with overlay category/price badges and arrow button
 */
import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export const EventCard = ({ event, onBook }) => {
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
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

  const isSoldOut = event.available_seats <= 0;
  const isPast = new Date(event.event_date) < new Date();
  const isFree = Number(event.price) === 0;

  return (
    <div className="event-card-new">
      {/* Card Image */}
      <div className="event-card-img-wrap">
        <img
          src={event.image_url ? `${event.image_url.split('?')[0]}?auto=format&fit=crop&w=400&q=75` : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=75'}
          alt={event.title}
          className="event-card-img"
          loading="lazy"
          decoding="async"
          width="280"
          height="175"
        />
        {/* Category Badge */}
        <span className="event-card-cat-badge">{event.category.toUpperCase()}</span>
        {/* Price Badge */}
        <span className="event-card-price-badge">
          {isFree ? 'FREE' : `$${Number(event.price).toFixed(2)}`}
        </span>
        {/* Sold Out / Past Overlay */}
        {(isSoldOut || isPast) && (
          <div className="event-card-sold-overlay">
            {isPast ? 'Event Ended' : 'Sold Out'}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="event-card-body-new">
        <div className="event-card-body-inner">
          <h3 className="event-card-title-new">{event.title}</h3>
          <p className="event-card-desc-new">{event.description}</p>

          <div className="event-card-meta-new">
            <div className="event-card-meta-item">
              <Calendar size={13} color="#2563eb" />
              <span>{formatDate(event.event_date)}</span>
            </div>
            <div className="event-card-meta-item">
              <MapPin size={13} color="#2563eb" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Arrow Button */}
        <button
          onClick={() => !isPast && !isSoldOut && onBook(event)}
          disabled={isPast || isSoldOut}
          className={`event-card-arrow-btn ${(isPast || isSoldOut) ? 'disabled' : ''}`}
          title={isPast ? 'Event ended' : isSoldOut ? 'Sold out' : 'Book now'}
          aria-label={isPast ? `Event ended: ${event.title}` : isSoldOut ? `Sold out: ${event.title}` : `Book ticket for ${event.title}`}
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default EventCard;
