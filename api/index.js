/**
 * Vercel Serverless Function Handler
 * Mounts the Express application to handle /api requests on Vercel
 */
const app = require('../backend/src/app');

module.exports = (req, res) => {
  return app(req, res);
};
