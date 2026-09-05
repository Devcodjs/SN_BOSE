const Issue = require('../models/Issue');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/analytics/category-distribution
const getCategoryDistribution = asyncHandler(async (req, res) => {
  const data = await Issue.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, category: '$_id', count: 1 } },
  ]);
  sendSuccess(res, data);
});

// GET /api/analytics/status-distribution
const getStatusDistribution = asyncHandler(async (req, res) => {
  const data = await Issue.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { _id: 0, status: '$_id', count: 1 } },
  ]);
  sendSuccess(res, data);
});

// GET /api/analytics/trends — daily granularity, last 30 days
const getTrends = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const data = await Issue.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        submitted: { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: '$_id', submitted: 1, resolved: 1 } },
  ]);
  sendSuccess(res, data);
});

// GET /api/analytics/resolution-time
const getResolutionTime = asyncHandler(async (req, res) => {
  const byCategory = await Issue.aggregate([
    { $match: { status: 'Resolved', resolvedAt: { $exists: true } } },
    { $project: { category: 1, ms: { $subtract: ['$resolvedAt', '$createdAt'] } } },
    { $group: { _id: '$category', avgMs: { $avg: '$ms' }, count: { $sum: 1 } } },
    { $project: { _id: 0, category: '$_id', avgHours: { $round: [{ $divide: ['$avgMs', 3600000] }, 1] }, count: 1 } },
    { $sort: { avgHours: 1 } },
  ]);

  const overall = await Issue.aggregate([
    { $match: { status: 'Resolved', resolvedAt: { $exists: true } } },
    { $project: { ms: { $subtract: ['$resolvedAt', '$createdAt'] } } },
    { $group: { _id: null, avg: { $avg: '$ms' }, total: { $sum: 1 } } },
  ]);

  sendSuccess(res, {
    byCategory,
    overallAvgHours: overall.length > 0 ? Math.round(overall[0].avg / 3600000 * 10) / 10 : 0,
    totalResolved: overall.length > 0 ? overall[0].total : 0,
  });
});

// GET /api/analytics/heatmap — day-of-week × hour-of-day matrix
const getHeatmap = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const data = await Issue.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          dayOfWeek: { $dayOfWeek: '$createdAt' },
          hour: { $hour: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        day: '$_id.dayOfWeek',   // 1=Sun, 7=Sat
        hour: '$_id.hour',       // 0-23
        count: 1,
      },
    },
    { $sort: { day: 1, hour: 1 } },
  ]);
  sendSuccess(res, data);
});

// GET /api/analytics/top-areas
const getTopAreas = asyncHandler(async (req, res) => {
  const data = await Issue.aggregate([
    { $match: { 'location.address': { $exists: true, $ne: '' } } },
    { $group: { _id: '$location.address', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $project: { _id: 0, area: '$_id', count: 1 } },
  ]);
  sendSuccess(res, data);
});

module.exports = { getCategoryDistribution, getStatusDistribution, getTrends, getResolutionTime, getHeatmap, getTopAreas };
