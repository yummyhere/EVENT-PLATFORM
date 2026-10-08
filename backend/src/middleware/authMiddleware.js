/**
 * Authentication Middleware
 * Validates JSON Web Token in "Authorization: Bearer <token>" header
 * Attaches verified user object to req.user (excluding password_hash)
 */
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { db } = require('../config/db');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided or invalid format.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token missing.'
      });
    }

    // Verify token using configured JWT secret
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please log in again.'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token.'
      });
    }

    // Fetch user from DB to confirm user still exists
    const user = await db.get(
      `SELECT id, name, email, created_at FROM users WHERE id = ?`,
      [decoded.id]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal authentication error.'
    });
  }
}

module.exports = authMiddleware;
