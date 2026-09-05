const { PRIORITY_WEIGHTS, SEVERITY_VALUES } = require('../config/priorityConfig');

/**
 * Priority Engine Service
 * Calculates the dynamic priority score of an issue based on:
 * Severity, Corroboration, Upvotes, and Age.
 */

// Max values for normalization
const MAX_CORROBORATION = 10;
const MAX_UPVOTES = 50;
const MAX_AGE_DAYS = 30;

/**
 * Normalizes corroboration count to a 0-100 scale.
 */
function calculateCorroborationScore(count) {
  return Math.min((count / MAX_CORROBORATION), 1) * 100;
}

/**
 * Normalizes upvotes to a 0-100 scale.
 */
function calculateUpvoteScore(upvotes) {
  return Math.min((upvotes / MAX_UPVOTES), 1) * 100;
}

/**
 * Normalizes issue age to a 0-100 scale. Older issues get higher scores.
 */
function calculateAgeScore(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.min((diffDays / MAX_AGE_DAYS), 1) * 100;
}

/**
 * Calculate the final Priority Score (0-100).
 */
function calculatePriorityScore(issue) {
  // 1. Severity (40%)
  const severityVal = SEVERITY_VALUES[issue.severity] || SEVERITY_VALUES.Medium;
  const severityScore = severityVal * PRIORITY_WEIGHTS.severity;

  // 2. Corroboration (30%)
  const corrVal = calculateCorroborationScore(issue.corroborationCount || 0);
  const corrScore = corrVal * PRIORITY_WEIGHTS.corroboration;

  // 3. Upvotes (20%)
  const upvVal = calculateUpvoteScore(issue.upvoteCount || 0);
  const upvScore = upvVal * PRIORITY_WEIGHTS.upvotes;

  // 4. Age (10%)
  const ageVal = calculateAgeScore(issue.createdAt || new Date());
  const ageScore = ageVal * PRIORITY_WEIGHTS.age;

  const totalScore = Math.round(severityScore + corrScore + upvScore + ageScore);
  
  return {
    score: Math.max(0, Math.min(100, totalScore)),
    breakdown: {
      severity: Math.round(severityVal),
      corroboration: Math.round(corrVal),
      upvotes: Math.round(upvVal),
      age: Math.round(ageVal)
    }
  };
}

module.exports = {
  calculatePriorityScore,
  calculateCorroborationScore,
  calculateUpvoteScore,
  calculateAgeScore
};
