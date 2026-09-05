const Issue = require('../models/Issue');
const { LOCATION_SETTINGS } = require('../config/duplicateConfig');

/**
 * Service to calculate geospatial similarity and find nearby candidate issues.
 */

/**
 * Haversine formula to calculate distance in meters between two coordinates [lng, lat]
 */
function getDistanceInMeters(coord1, coord2) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Find active issues within the configured search radius using MongoDB 2dsphere index.
 */
async function getNearbyCandidates(longitude, latitude) {
  try {
    return await Issue.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: LOCATION_SETTINGS.searchRadiusMeters
        }
      },
      // Exclude already resolved/rejected issues from being considered active duplicates
      status: { $in: ['Pending', 'In Progress'] }
    }).lean();
  } catch (error) {
    console.error('Error fetching nearby candidates:', error);
    return [];
  }
}

/**
 * Calculate location similarity score between 0 and 1.
 * 1 means exactly the same location, 0 means outside the radius.
 */
function calculateLocationSimilarity(distMeters, maxRadius) {
  if (distMeters >= maxRadius) return 0;
  // Linear decay: score = 1 - (distance / maxRadius)
  return 1 - (distMeters / maxRadius);
}

module.exports = {
  getDistanceInMeters,
  getNearbyCandidates,
  calculateLocationSimilarity
};
