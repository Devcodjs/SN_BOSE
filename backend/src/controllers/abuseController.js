const AbuseFlag = require('../models/AbuseFlag');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { updateTrustScore } = require('../services/trustScoreService');

// GET /api/admin/abuse/flags
const getAbuseFlags = asyncHandler(async (req, res) => {
  const status = req.query.status || 'pending';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const filter = { status };
  
  const [flags, total] = await Promise.all([
    AbuseFlag.find(filter)
      .populate('citizen', 'name email trustScore totalReports abuseFlags')
      .populate('issue', 'title category')
      .populate('reviewedBy', 'name')
      .sort({ riskScore: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AbuseFlag.countDocuments(filter)
  ]);

  sendSuccess(res, {
    data: flags,
    count: flags.length,
    pagination: { page, limit, totalPages: Math.ceil(total / limit), totalItems: total }
  });
});

// POST /api/admin/abuse/:id/review
const reviewAbuseFlag = asyncHandler(async (req, res) => {
  const { action, comment } = req.body;
  const validActions = ['reviewed_safe', 'warned', 'restricted', 'rejected'];
  
  if (!action || !validActions.includes(action)) {
    return sendError(res, 'Invalid action', 400);
  }

  const flag = await AbuseFlag.findById(req.params.id);
  if (!flag) return sendError(res, 'Flag not found', 404);
  
  if (flag.status !== 'pending') {
    return sendError(res, 'Flag is already reviewed', 400);
  }

  flag.status = action;
  flag.reviewComment = comment;
  flag.reviewedBy = req.user._id;
  flag.reviewedAt = new Date();

  await flag.save();

  // If action is severe, impact trust score heavily
  if (action === 'warned' || action === 'restricted') {
    await updateTrustScore(flag.citizen, 'REPEATED_ABUSE');
  } else if (action === 'reviewed_safe') {
    // If it was a false alarm, restore trust score slightly
    await updateTrustScore(flag.citizen, 'LEGITIMATE_REPORT');
  }

  const updatedFlag = await AbuseFlag.findById(flag._id)
    .populate('citizen', 'name email trustScore')
    .populate('reviewedBy', 'name')
    .lean();

  sendSuccess(res, updatedFlag, 'Abuse flag reviewed successfully');
});

module.exports = {
  getAbuseFlags,
  reviewAbuseFlag
};
