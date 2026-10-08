/**
 * Centralized Error Handling Middleware
 * Ensures consistent JSON response structure across the API
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled API Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method
  });

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
    errors: err.errors || undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

/**
 * 404 Not Found Handler for unmatched routes
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
