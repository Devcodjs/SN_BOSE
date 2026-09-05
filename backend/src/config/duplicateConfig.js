/**
 * Central Duplicate Detection Configuration
 * Holds weights, thresholds, and radii used for duplicate calculations.
 */

const DUPLICATE_WEIGHTS = {
  location: 0.40,
  text: 0.30,
  category: 0.15,
  image: 0.15,
};

const DUPLICATE_THRESHOLDS = {
  // Score below this means definitely not a duplicate
  DIFFERENT: 0.50,
  
  // Score between DIFFERENT and HIGHLY_LIKELY requires admin review (Possible duplicate)
  // Score above this means it's a highly likely duplicate and should be linked automatically (if configured)
  HIGHLY_LIKELY: 0.80,
};

const LOCATION_SETTINGS = {
  // Radius in meters to search for nearby active issues
  searchRadiusMeters: 100,
};

module.exports = {
  DUPLICATE_WEIGHTS,
  DUPLICATE_THRESHOLDS,
  LOCATION_SETTINGS,
};
