/**
 * Authentication Controller
 * Handles user registration, login, and current user profile
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { db } = require('../config/db');

// Helper to generate signed JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

// 1. POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await db.get(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Hash password with bcrypt (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user into SQLite database
    const result = await db.run(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );

    const newUser = {
      id: result.lastID,
      name,
      email,
      created_at: new Date().toISOString()
    };

    // Generate JWT token
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at
      }
    });
  } catch (error) {
    next(error);
  }
}

// 2. POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Fetch user from DB
    const user = await db.get(
      'SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare bcrypt password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
}

// 3. GET /api/auth/me (Protected Profile Check)
async function getMe(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe
};
