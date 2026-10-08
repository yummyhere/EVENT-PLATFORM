/**
 * Request Validation Middleware
 * Validates payloads for auth, booking, and event endpoints
 */

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
};

// Middleware to validate user registration
function validateRegister(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters long.');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors
    });
  }

  // Sanitize fields
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
}

// Middleware to validate user login
function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
}

// Middleware to validate booking creation
function validateBooking(req, res, next) {
  const { event_id, tickets } = req.body;
  const errors = [];

  const parsedEventId = parseInt(event_id, 10);
  const parsedTickets = parseInt(tickets, 10);

  if (!event_id || isNaN(parsedEventId) || parsedEventId <= 0) {
    errors.push('A valid numeric event_id is required.');
  }

  if (!tickets || isNaN(parsedTickets) || parsedTickets < 1) {
    errors.push('Tickets must be a positive integer greater than or equal to 1.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors
    });
  }

  req.body.event_id = parsedEventId;
  req.body.tickets = parsedTickets;
  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateBooking
};
