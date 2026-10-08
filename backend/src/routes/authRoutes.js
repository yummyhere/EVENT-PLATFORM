/**
 * Authentication Routes
 * /api/auth
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validateMiddleware');

// Public endpoints
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected endpoint to verify active session
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
