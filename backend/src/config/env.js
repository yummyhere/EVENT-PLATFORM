/**
 * Environment configuration loader
 * Reads environment variables from .env and provides safe defaults
 */
const path = require('path');
const dotenv = require('dotenv');

// Load .env from backend root directory (if present)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// In Vercel serverless functions, the root filesystem is read-only.
// /tmp is the only writable directory, so we default to /tmp/events.db when running on Vercel.
const isVercel = !!process.env.VERCEL;
const defaultDbPath = isVercel
  ? '/tmp/events.db'
  : path.resolve(__dirname, '../database/events.db');

const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'fallback_development_secret_key_123',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  dbPath: process.env.DB_PATH || defaultDbPath,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  isVercel
};

module.exports = config;
