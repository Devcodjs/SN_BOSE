const express = require('express');
const router = express.Router();

const { register, login, refresh, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

const { register, login, getMe } = require('../controllers/authController');
const {
  requestOtp,
  verifyOtp,
  completeOnboarding,
  linkAccount,
} = require('../controllers/aadhaarAuthController');
const { protect } = require('../middleware/auth');
const { aadhaarOtpRateLimiter } = require('../middleware/aadhaarRateLimiter');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Aadhaar authentication routes
router.post('/aadhaar/request-otp', aadhaarOtpRateLimiter, requestOtp);
router.post('/aadhaar/verify-otp', verifyOtp);
router.post('/aadhaar/complete-onboarding', completeOnboarding);
router.post('/aadhaar/link-account', linkAccount);

// Protected routes

router.get('/me', protect, getMe);

module.exports = router;
