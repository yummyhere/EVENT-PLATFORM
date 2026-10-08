/**
 * User Routes
 * /api/user
 */
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected: retrieve all bookings for logged-in user
router.get('/bookings', authMiddleware, bookingController.getUserBookings);

module.exports = router;
