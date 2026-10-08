-- ==============================================================================
-- COMMUNITY EVENT BOOKING PLATFORM DATABASE SCHEMA
-- Relational SQLite3 Schema with Foreign Keys, Check Constraints & Indexes
-- ==============================================================================

PRAGMA foreign_keys = ON;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date DATETIME NOT NULL,
  price REAL NOT NULL DEFAULT 0.0 CHECK (price >= 0),
  total_seats INTEGER NOT NULL CHECK (total_seats > 0),
  available_seats INTEGER NOT NULL CHECK (available_seats >= 0),
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  tickets INTEGER NOT NULL CHECK (tickets > 0),
  total_price REAL NOT NULL CHECK (total_price >= 0),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- 4. Indexes for Performance & Join Optimization
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
