/**
 * Event Controller
 * Handles retrieving community events with rich filtering, search, and detail views
 */
const { db } = require('../config/db');

// 1. GET /api/events
// Query Params: search, category, date, upcoming ('true' | 'false')
async function getEvents(req, res, next) {
  try {
    const { search, category, date, upcoming } = req.query;

    let query = `
      SELECT 
        id, 
        title, 
        description, 
        category, 
        location, 
        event_date, 
        price, 
        total_seats, 
        available_seats, 
        image_url, 
        created_at
      FROM events
      WHERE 1=1
    `;
    const params = [];

    // Filter by search keyword (searches title, description, and location)
    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      query += ` AND (title LIKE ? OR description LIKE ? OR location LIKE ?)`;
      params.push(term, term, term);
    }

    // Filter by category
    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      query += ` AND category = ?`;
      params.push(category.trim());
    }

    // Filter by specific date (YYYY-MM-DD)
    if (date && date.trim() !== '') {
      query += ` AND date(event_date) = date(?)`;
      params.push(date.trim());
    }

    // Filter by upcoming events only (future or today)
    if (upcoming === 'true' || upcoming === true) {
      query += ` AND datetime(event_date) >= datetime('now', 'localtime')`;
    }

    // Order by event date ascending (soonest first)
    query += ` ORDER BY datetime(event_date) ASC`;

    const events = await db.all(query, params);

    // Also get distinct categories for dynamic UI dropdown
    const categoryRows = await db.all(
      `SELECT DISTINCT category FROM events ORDER BY category ASC`
    );
    const categories = categoryRows.map((r) => r.category);

    return res.status(200).json({
      success: true,
      count: events.length,
      categories,
      events
    });
  } catch (error) {
    next(error);
  }
}

// 2. GET /api/events/:id (Bonus / Detail view)
async function getEventById(req, res, next) {
  try {
    const { id } = req.params;
    const event = await db.get(
      `SELECT 
        id, 
        title, 
        description, 
        category, 
        location, 
        event_date, 
        price, 
        total_seats, 
        available_seats, 
        image_url, 
        created_at
      FROM events 
      WHERE id = ?`,
      [id]
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    // Also fetch booking count summary
    const bookingStats = await db.get(
      `SELECT COUNT(id) as total_bookings, COALESCE(SUM(tickets), 0) as total_tickets_booked 
       FROM bookings WHERE event_id = ? AND status = 'confirmed'`,
      [id]
    );

    return res.status(200).json({
      success: true,
      event: {
        ...event,
        stats: bookingStats
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEvents,
  getEventById
};
