const express = require('express');
const router = express.Router();

const { register, login, refresh, logout, getMe } = require('../controllers/authController');
const {
  requestOtp,
  verifyOtp,
  completeOnboarding,
  linkAccount,
} = require('../controllers/aadhaarAuthController');
const { protect, optionalAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { aadhaarOtpRateLimiter } = require('../middleware/aadhaarRateLimiter');

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Aadhaar authentication / identity verification routes (optionalAuth populates req.user if Bearer token present)
router.post('/aadhaar/request-otp', optionalAuth, aadhaarOtpRateLimiter, requestOtp);
router.post('/aadhaar/verify-otp', optionalAuth, verifyOtp);
router.post('/aadhaar/complete-onboarding', completeOnboarding);
router.post('/aadhaar/link-account', linkAccount);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
