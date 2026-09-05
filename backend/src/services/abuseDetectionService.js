const Issue = require('../models/Issue');
const AbuseFlag = require('../models/AbuseFlag');
const { updateTrustScore } = require('./trustScoreService');

/**
 * Abuse Detection Service
 */

const RATE_LIMITS = {
  HOURLY_REPORTS: 5,
  DAILY_REPORTS: 20
};

/**
 * Check if a user is exceeding rate limits for reporting issues.
 */
async function checkRateLimits(userId) {
  const now = new Date();
  
  const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
  const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

  const [hourlyCount, dailyCount] = await Promise.all([
    Issue.countDocuments({ submittedBy: userId, createdAt: { $gte: oneHourAgo } }),
    Issue.countDocuments({ submittedBy: userId, createdAt: { $gte: oneDayAgo } })
  ]);

  return {
    isExceeded: hourlyCount >= RATE_LIMITS.HOURLY_REPORTS || dailyCount >= RATE_LIMITS.DAILY_REPORTS,
    reason: 'EXCESSIVE_REPORTING',
    riskScore: hourlyCount > RATE_LIMITS.HOURLY_REPORTS * 2 ? 80 : 50
  };
}

/**
 * Check for repeated duplicate submissions by the same user.
 * Example rule: 3 or more duplicates in the last week.
 */
async function checkRepeatedDuplicates(userId) {
  const oneWeekAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
  
  const recentDuplicates = await Issue.countDocuments({
    submittedBy: userId,
    isDuplicate: true,
    createdAt: { $gte: oneWeekAgo }
  });

  return {
    isExceeded: recentDuplicates >= 3,
    reason: 'REPEATED_DUPLICATE',
    riskScore: recentDuplicates > 5 ? 75 : 40
  };
}

/**
 * Analyze a new submission for abuse.
 * Returns true if the submission should be blocked/flagged heavily, false otherwise.
 */
async function analyzeSubmission(userId, issueData) {
  // 1. Check Rate Limits
  const rateLimitResult = await checkRateLimits(userId);
  if (rateLimitResult.isExceeded) {
    await flagUser(userId, null, rateLimitResult.reason, rateLimitResult.riskScore);
    // Returning true means we might want to block this submission at the controller level
    return true; 
  }

  // 2. Check Repeated Duplicates (passive, doesn't block submission)
  const duplicateResult = await checkRepeatedDuplicates(userId);
  if (duplicateResult.isExceeded) {
    await flagUser(userId, null, duplicateResult.reason, duplicateResult.riskScore);
  }

  return false;
}

/**
 * Create an abuse flag for admin review.
 */
async function flagUser(userId, issueId, reason, riskScore) {
  try {
    // Check if there's already a pending flag for this reason for this user
    const existingFlag = await AbuseFlag.findOne({
      citizen: userId,
      reason,
      status: 'pending'
    });

    if (existingFlag) {
      // Just increase the risk score if it keeps happening
      existingFlag.riskScore = Math.min(100, existingFlag.riskScore + 10);
      await existingFlag.save();
    } else {
      await AbuseFlag.create({
        citizen: userId,
        issue: issueId,
        reason,
        riskScore
      });
      // Also hit their trust score
      if (reason === 'REPEATED_DUPLICATE') {
         await updateTrustScore(userId, 'REPEATED_DUPLICATE');
      } else if (reason === 'EXCESSIVE_REPORTING') {
         await updateTrustScore(userId, 'REPEATED_ABUSE');
      }
    }
  } catch (error) {
    console.error('Error flagging user:', error);
  }
}

module.exports = {
  analyzeSubmission,
  flagUser
};
