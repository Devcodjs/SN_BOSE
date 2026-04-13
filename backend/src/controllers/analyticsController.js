const Issue = require('../models/Issue');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @route   GET /api/analytics/category-distribution
 * @desc    Get issue count by category
 * @access  Private (Admin)
 */
const getCategoryDistribution = async (req, res, next) => {
  try {
    const data = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
        },
      },
    ]);

    sendSuccess(res, data, 'Category distribution retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analytics/status-distribution
 * @desc    Get issue count by status
 * @access  Private (Admin)
 */
const getStatusDistribution = async (req, res, next) => {
  try {
    const data = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ]);

    sendSuccess(res, data, 'Status distribution retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analytics/monthly-trends
 * @desc    Get issues created per month (last 12 months)
 * @access  Private (Admin)
 */
const getMonthlyTrends = async (req, res, next) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const data = await Issue.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          total: 1,
          resolved: 1,
          pending: 1,
        },
      },
    ]);

    sendSuccess(res, data, 'Monthly trends retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analytics/resolution-time
 * @desc    Get average resolution time by category
 * @access  Private (Admin)
 */
const getResolutionTime = async (req, res, next) => {
  try {
    const data = await Issue.aggregate([
      {
        $match: {
          status: 'Resolved',
          resolvedAt: { $exists: true },
        },
      },
      {
        $project: {
          category: 1,
          resolutionTimeMs: { $subtract: ['$resolvedAt', '$createdAt'] },
        },
      },
      {
        $group: {
          _id: '$category',
          avgTimeMs: { $avg: '$resolutionTimeMs' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          avgHours: {
            $round: [{ $divide: ['$avgTimeMs', 3600000] }, 1],
          },
          count: 1,
        },
      },
      { $sort: { avgHours: 1 } },
    ]);

    // Overall average
    const overall = await Issue.aggregate([
      {
        $match: {
          status: 'Resolved',
          resolvedAt: { $exists: true },
        },
      },
      {
        $project: {
          resolutionTimeMs: { $subtract: ['$resolvedAt', '$createdAt'] },
        },
      },
      {
        $group: {
          _id: null,
          avgTimeMs: { $avg: '$resolutionTimeMs' },
          totalResolved: { $sum: 1 },
        },
      },
    ]);

    const overallAvgHours = overall.length > 0
      ? Math.round(overall[0].avgTimeMs / 3600000 * 10) / 10
      : 0;

    sendSuccess(res, {
      byCategory: data,
      overallAvgHours,
      totalResolved: overall.length > 0 ? overall[0].totalResolved : 0,
    }, 'Resolution time analytics retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analytics/top-areas
 * @desc    Get top 10 areas with most issues
 * @access  Private (Admin)
 */
const getTopAreas = async (req, res, next) => {
  try {
    const data = await Issue.aggregate([
      {
        $match: {
          'location.address': { $exists: true, $ne: '' },
        },
      },
      {
        $group: {
          _id: '$location.address',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          area: '$_id',
          count: 1,
        },
      },
    ]);

    sendSuccess(res, data, 'Top areas retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategoryDistribution,
  getStatusDistribution,
  getMonthlyTrends,
  getResolutionTime,
  getTopAreas,
};
