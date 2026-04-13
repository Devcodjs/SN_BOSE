const express = require('express');
const router = express.Router();
const {
  getCategoryDistribution,
  getStatusDistribution,
  getMonthlyTrends,
  getResolutionTime,
  getTopAreas,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// All analytics routes require admin role
router.use(protect, authorize('admin'));

router.get('/category-distribution', getCategoryDistribution);
router.get('/status-distribution', getStatusDistribution);
router.get('/monthly-trends', getMonthlyTrends);
router.get('/resolution-time', getResolutionTime);
router.get('/top-areas', getTopAreas);

module.exports = router;
