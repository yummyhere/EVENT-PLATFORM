/**
 * Server Entry Point
 * Initializes SQLite database schema and starts Express HTTP server
 */
const app = require('./app');
const config = require('./config/env');
const { initializeDatabase } = require('./config/db');

async function startServer() {
  try {
    // 1. Initialize DB schema (creates tables with foreign keys if not present)
    await initializeDatabase();

    // 2. Start HTTP listener
    app.listen(config.port, () => {
      console.log('====================================================');
      console.log(`🚀 Event Platform Backend running on port: ${config.port}`);
      console.log(`📍 API Base: http://localhost:${config.port}/api`);
      console.log(`🔒 Environment: ${config.nodeEnv}`);
      console.log(`🌐 Allowed Client: ${config.clientUrl}`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error('❌ Fatal error starting server:', error);
    process.exit(1);
  }
}

startServer();
