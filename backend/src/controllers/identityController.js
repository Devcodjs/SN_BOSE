const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const identityService = require('../services/identityVerificationService');

// POST /api/identity/verify
const verifyIdentity = asyncHandler(async (req, res) => {
  const { aadhaarNumber } = req.body;
  if (!aadhaarNumber) {
    return sendError(res, 'Aadhaar number is required', 400);
  }

  // Find user
  const user = await User.findById(req.user._id);
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  if (user.identityVerified) {
    return sendError(res, 'Identity already verified', 400);
  }

  // Call verification service
  const result = await identityService.verifyAadhaar(aadhaarNumber, user.name);
  
  if (!result.success) {
    user.verificationStatus = 'failed';
    await user.save();
    return sendError(res, result.message, 400);
  }

  // Update user with minimal metadata, never store raw Aadhaar
  user.identityVerified = true;
  user.verificationStatus = 'verified';
  user.verificationProvider = result.provider;
  user.verificationReference = result.referenceId;
  user.verifiedAt = new Date();
  
  await user.save();

  sendSuccess(res, {
    identityVerified: true,
    verificationStatus: 'verified'
  }, 'Identity verified successfully');
});

// GET /api/identity/status
const getVerificationStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('identityVerified verificationStatus verifiedAt');
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  sendSuccess(res, {
    identityVerified: user.identityVerified,
    verificationStatus: user.verificationStatus,
    verifiedAt: user.verifiedAt
  });
});

module.exports = {
  verifyIdentity,
  getVerificationStatus
};
