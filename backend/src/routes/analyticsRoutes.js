const express = require('express');
const router = express.Router();
const { getCategoryDistribution, getStatusDistribution, getTrends, getResolutionTime, getHeatmap, getTopAreas } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/category-distribution', getCategoryDistribution);
router.get('/status-distribution', getStatusDistribution);
router.get('/trends', getTrends);
router.get('/resolution-time', getResolutionTime);
router.get('/heatmap', getHeatmap);
router.get('/top-areas', getTopAreas);

module.exports = router;
