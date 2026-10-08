/**
 * Event Routes
 * /api/events
 */
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Public listing with filters (search, category, date, upcoming)
router.get('/', eventController.getEvents);

// Public single event detail
router.get('/:id', eventController.getEventById);

module.exports = router;
