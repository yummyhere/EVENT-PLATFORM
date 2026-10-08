/**
 * Booking Routes
 * /api/bookings
 */
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBooking } = require('../middleware/validateMiddleware');

// Protected: create new booking
router.post('/', authMiddleware, validateBooking, bookingController.createBooking);

// Protected: cancel an active booking (Bonus)
router.patch('/:id/cancel', authMiddleware, bookingController.cancelBooking);

module.exports = router;
