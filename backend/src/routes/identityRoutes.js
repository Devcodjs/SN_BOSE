const express = require('express');
const router = express.Router();
const { verifyIdentity, getVerificationStatus } = require('../controllers/identityController');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

router.use(protect);

router.post('/verify', apiLimiter, verifyIdentity);
router.get('/status', getVerificationStatus);

module.exports = router;
