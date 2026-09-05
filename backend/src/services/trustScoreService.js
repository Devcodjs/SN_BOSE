const User = require('../models/User');
const { TRUST_BOUNDARIES, TRUST_ADJUSTMENTS } = require('../config/trustConfig');

/**
 * Service to manage citizen trust scores.
 */

async function updateTrustScore(userId, action) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    let adjustment = 0;
    switch (action) {
      case 'LEGITIMATE_REPORT':
        adjustment = TRUST_ADJUSTMENTS.LEGITIMATE_REPORT;
        user.verifiedReports += 1;
        break;
      case 'MUNICIPALITY_CONFIRMED':
        adjustment = TRUST_ADJUSTMENTS.MUNICIPALITY_CONFIRMED;
        user.resolvedReports += 1;
        break;
      case 'FALSE_SPAM_REPORT':
        adjustment = TRUST_ADJUSTMENTS.FALSE_SPAM_REPORT;
        user.rejectedReports += 1;
        break;
      case 'REPEATED_ABUSE':
        adjustment = TRUST_ADJUSTMENTS.REPEATED_ABUSE;
        user.abuseFlags += 1;
        break;
      case 'REPEATED_DUPLICATE':
        adjustment = TRUST_ADJUSTMENTS.REPEATED_DUPLICATE;
        user.duplicateReports += 1;
        break;
      default:
        return user.trustScore;
    }

    // Calculate new score and bound it
    let newScore = user.trustScore + adjustment;
    newScore = Math.max(TRUST_BOUNDARIES.MIN, Math.min(TRUST_BOUNDARIES.MAX, newScore));
    
    user.trustScore = newScore;
    await user.save();
    
    return newScore;
  } catch (error) {
    console.error('Error updating trust score:', error);
    return null;
  }
}

async function incrementTotalReports(userId) {
  try {
    await User.findByIdAndUpdate(userId, { $inc: { totalReports: 1 } });
  } catch (error) {
    console.error('Error incrementing total reports:', error);
  }
}

module.exports = {
  updateTrustScore,
  incrementTotalReports
};
