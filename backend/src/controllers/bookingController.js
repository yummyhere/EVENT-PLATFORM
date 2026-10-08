/**
 * Booking Controller
 * Handles transactional ticket booking creation, user booking history, and cancellations
 */
const { db } = require('../config/db');

// 1. POST /api/bookings (Protected)
// Creates ticket booking and decrements available seats atomically inside a transaction
async function createBooking(req, res, next) {
  try {
    const userId = req.user.id;
    const { event_id, tickets } = req.body;

    // Use transaction for atomic consistency and race condition prevention
    const bookingResult = await db.transaction(async (tx) => {
      // Fetch target event
      const event = await tx.get(
        `SELECT id, title, price, available_seats, total_seats, event_date 
         FROM events WHERE id = ?`,
        [event_id]
      );

      if (!event) {
        const error = new Error('Event not found.');
        error.statusCode = 404;
        throw error;
      }

      // Check if event is in the past
      const eventDate = new Date(event.event_date);
      const now = new Date();
      if (eventDate < now) {
        const error = new Error('Cannot book tickets for an event that has already occurred.');
        error.statusCode = 400;
        throw error;
      }

      // Check seat availability
      if (event.available_seats < tickets) {
        const error = new Error(
          event.available_seats === 0
            ? 'This event is completely sold out.'
            : `Only ${event.available_seats} ticket(s) remaining for this event.`
        );
        error.statusCode = 400;
        throw error;
      }

      // Calculate server-side total price
      const totalPrice = Number((event.price * tickets).toFixed(2));

      // Decrement available seats atomically
      const updateResult = await tx.run(
        `UPDATE events 
         SET available_seats = available_seats - ? 
         WHERE id = ? AND available_seats >= ?`,
        [tickets, event_id, tickets]
      );

      if (updateResult.changes === 0) {
        const error = new Error('Seats were just claimed by another user. Please try again.');
        error.statusCode = 409;
        throw error;
      }

      // Insert new booking record
      const insertResult = await tx.run(
        `INSERT INTO bookings (user_id, event_id, tickets, total_price, status, booked_at) 
         VALUES (?, ?, ?, ?, 'confirmed', datetime('now', 'localtime'))`,
        [userId, event_id, tickets, totalPrice]
      );

      const bookingId = insertResult.lastID;

      // Fetch full booking details for response
      const createdBooking = await tx.get(
        `SELECT 
          b.id,
          b.user_id,
          b.event_id,
          b.tickets,
          b.total_price,
          b.status,
          b.booked_at,
          e.title AS event_title,
          e.event_date,
          e.location AS event_location,
          e.category AS event_category,
          e.price AS unit_price,
          e.available_seats AS remaining_seats
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        WHERE b.id = ?`,
        [bookingId]
      );

      return createdBooking;
    });

    return res.status(201).json({
      success: true,
      message: 'Tickets booked successfully!',
      booking: bookingResult
    });
  } catch (error) {
    next(error);
  }
}

// 2. GET /api/user/bookings (Protected)
// Returns all bookings of logged-in user joined with event details, sorted by newest first
async function getUserBookings(req, res, next) {
  try {
    const userId = req.user.id;

    const bookings = await db.all(
      `SELECT 
        b.id,
        b.user_id,
        b.event_id,
        b.tickets,
        b.total_price,
        b.status,
        b.booked_at,
        e.title AS event_title,
        e.description AS event_description,
        e.category AS event_category,
        e.location AS event_location,
        e.event_date,
        e.price AS unit_price,
        e.image_url AS event_image_url
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = ?
      ORDER BY b.booked_at DESC`,
      [userId]
    );

    const now = new Date();

    // Attach computed boolean flag is_active (confirmed & in the future)
    const formattedBookings = bookings.map((booking) => {
      const eventDate = new Date(booking.event_date);
      const isUpcoming = eventDate >= now;
      const isActive = booking.status === 'confirmed' && isUpcoming;

      return {
        ...booking,
        is_active: isActive,
        is_upcoming: isUpcoming
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedBookings.length,
      bookings: formattedBookings
    });
  } catch (error) {
    next(error);
  }
}

// 3. PATCH /api/bookings/:id/cancel (Bonus - Protected)
// Cancels a booking and restores seats back to the event atomically
async function cancelBooking(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const cancelledBooking = await db.transaction(async (tx) => {
      // Find booking belonging to this user
      const booking = await tx.get(
        `SELECT b.*, e.event_date 
         FROM bookings b 
         JOIN events e ON b.event_id = e.id 
         WHERE b.id = ? AND b.user_id = ?`,
        [id, userId]
      );

      if (!booking) {
        const error = new Error('Booking not found or not authorized.');
        error.statusCode = 404;
        throw error;
      }

      if (booking.status === 'cancelled') {
        const error = new Error('This booking is already cancelled.');
        error.statusCode = 400;
        throw error;
      }

      // Check if event has already passed
      const eventDate = new Date(booking.event_date);
      if (eventDate < new Date()) {
        const error = new Error('Past events cannot be cancelled.');
        error.statusCode = 400;
        throw error;
      }

      // Update booking status to cancelled
      await tx.run(
        `UPDATE bookings SET status = 'cancelled' WHERE id = ?`,
        [id]
      );

      // Restore tickets back to event available_seats
      await tx.run(
        `UPDATE events SET available_seats = available_seats + ? WHERE id = ?`,
        [booking.tickets, booking.event_id]
      );

      return {
        ...booking,
        status: 'cancelled'
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been released.',
      booking: cancelledBooking
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking
};
