/**
 * Trust Score Configuration
 * Holds trust score boundaries and adjustment values for citizen actions.
 */

const TRUST_BOUNDARIES = {
  INITIAL: 100,
  MIN: 0,
  MAX: 100,
};

const TRUST_ADJUSTMENTS = {
  LEGITIMATE_REPORT: +5,
  MUNICIPALITY_CONFIRMED: +10,
  FALSE_SPAM_REPORT: -10,
  REPEATED_ABUSE: -20,
  REPEATED_DUPLICATE: -5,
};

module.exports = {
  TRUST_BOUNDARIES,
  TRUST_ADJUSTMENTS,
};
