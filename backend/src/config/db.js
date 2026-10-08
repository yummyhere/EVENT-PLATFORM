/**
 * SQLite3 Database Configuration & Promise Helpers
 * Automatically initializes database file, runs schema, and exposes async methods
 */
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const config = require('./env');

// Ensure directory exists for database file
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  try {
    fs.mkdirSync(dbDir, { recursive: true });
  } catch (err) {
    console.warn('Could not create DB directory:', err.message);
  }
}

// In Vercel / serverless: if writing to /tmp and a pre-seeded events.db exists in repo, copy it
const bundledDbPath = path.resolve(__dirname, '../database/events.db');
if (config.dbPath !== bundledDbPath && fs.existsSync(bundledDbPath) && !fs.existsSync(config.dbPath)) {
  try {
    fs.copyFileSync(bundledDbPath, config.dbPath);
    console.log(`📋 Copied bundled events.db to ${config.dbPath}`);
  } catch (err) {
    console.warn('Could not copy bundled DB to /tmp:', err.message);
  }
}

// Connect to SQLite database
const rawDb = new sqlite3.Database(config.dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log(` Connected to SQLite database at: ${config.dbPath}`);
  }
});

// Promisified database interface
const db = {
  // Execute PRAGMA or direct statement
  exec(sql) {
    return new Promise((resolve, reject) => {
      rawDb.exec(sql, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  },

  // Get single row
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      rawDb.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  // Get all rows
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      rawDb.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });
  },

  // Run insert / update / delete query
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      rawDb.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },

  // Execute queries in an atomic transaction
  async transaction(fn) {
    await this.run('BEGIN IMMEDIATE TRANSACTION');
    try {
      const result = await fn(this);
      await this.run('COMMIT');
      return result;
    } catch (error) {
      await this.run('ROLLBACK');
      throw error;
    }
  },

  // Raw database handle if needed
  raw: rawDb
};

// Auto-run schema initialization once
let initPromise = null;
async function initializeDatabase() {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await db.run('PRAGMA foreign_keys = ON;');
        const schemaPath = path.resolve(__dirname, '../database/schema.sql');
        if (fs.existsSync(schemaPath)) {
          const schemaSql = fs.readFileSync(schemaPath, 'utf8');
          await db.exec(schemaSql);
          console.log(' Database schema initialized successfully (foreign keys enabled).');
        }

        // If database is empty, auto-seed with sample events and demo user
        try {
          const countRow = await db.get('SELECT COUNT(*) as cnt FROM events');
          if (!countRow || countRow.cnt === 0) {
            console.log('🌱 No events found in database. Running initial seed...');
            const seed = require('../database/seed');
            await seed(false);
          }
        } catch (seedErr) {
          console.warn('Auto-seed check notice:', seedErr.message);
        }
      } catch (err) {
        console.error('❌ Error initializing database schema:', err);
        throw err;
      }
    })();
  }
  return initPromise;
}

// In Vercel serverless mode, proactively trigger initialization
if (config.isVercel) {
  initializeDatabase().catch((e) => console.error('Vercel DB init notice:', e.message));
}

module.exports = {
  db,
  initializeDatabase
};
