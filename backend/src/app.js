/**
 * Express Application Setup
 * Configures middleware, security, routes, and centralized error handling
 */
const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const { initializeDatabase } = require('./config/db');

const app = express();

// Ensure DB schema and seed is loaded before handling API requests
app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Community Event Platform API is operational.',
    timestamp: new Date().toISOString()
  });
});

// Mount API Route Modules
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/user', userRoutes);

// Unmatched Route (404) & Central Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
