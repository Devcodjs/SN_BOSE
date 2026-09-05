const express = require('express');
const router = express.Router();
const { getAbuseFlags, reviewAbuseFlag } = require('../controllers/abuseController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/flags', getAbuseFlags);
router.post('/:id/review', reviewAbuseFlag);

module.exports = router;
