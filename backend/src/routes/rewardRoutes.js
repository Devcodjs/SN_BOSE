const express = require('express');
const router = express.Router();
const Reward = require('../models/Reward');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/rewards/my — get current user's rewards
router.get('/my', protect, asyncHandler(async (req, res) => {
  const rewards = await Reward.find({ user: req.user._id })
    .populate('issue', 'title category')
    .sort({ createdAt: -1 }).lean();
  const user = await User.findById(req.user._id).select('rewards').lean();
  sendSuccess(res, { rewards, summary: user.rewards });
}));

module.exports = router;
