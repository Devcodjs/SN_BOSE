const { DUPLICATE_WEIGHTS, DUPLICATE_THRESHOLDS, LOCATION_SETTINGS } = require('../config/duplicateConfig');
const locationService = require('./locationSimilarityService');
const textService = require('./textSimilarityService');

/**
 * Master Duplicate Detection Service
 * Orchestrates the different similarity engines.
 */

/**
 * Calculate category similarity (1 if same, 0 if different)
 */
function calculateCategorySimilarity(cat1, cat2) {
  return cat1 === cat2 ? 1 : 0;
}

/**
 * Calculate image similarity.
 * Currently returns 0 as a neutral stub. Designed for future computer-vision integration.
 */
function calculateImageSimilarity(images1, images2) {
  // Stub for Phase 1. 
  // DO NOT fake ML functionality. Return 0 for now.
  return 0;
}

/**
 * Calculate the overall duplicate confidence score between a new issue and a candidate.
 */
function calculateDuplicateScore(newIssue, candidateIssue) {
  // 1. Location (40%)
  const distMeters = locationService.getDistanceInMeters(
    newIssue.location.coordinates, 
    candidateIssue.location.coordinates
  );
  const locScore = locationService.calculateLocationSimilarity(distMeters, LOCATION_SETTINGS.searchRadiusMeters);

  // 2. Text (30%)
  const newText = `${newIssue.title} ${newIssue.description}`;
  const candText = `${candidateIssue.title} ${candidateIssue.description}`;
  const textScore = textService.calculateTextSimilarity(newText, candText);

  // 3. Category (15%)
  const catScore = calculateCategorySimilarity(newIssue.category, candidateIssue.category);

  // 4. Image (15%) - Stubbed to 0 for now, so we need to re-normalize the other weights if we don't have it
  // Since we don't have image similarity yet, we redistribute the weight (15%) to Location and Text.
  // Realistically, we calculate the weighted sum:
  let finalScore = 
    (DUPLICATE_WEIGHTS.location * locScore) + 
    (DUPLICATE_WEIGHTS.text * textScore) + 
    (DUPLICATE_WEIGHTS.category * catScore);

  // Since Image weight (0.15) is effectively missing, the max score would be 0.85. 
  // Let's normalize it back to a 0-1 scale.
  const activeWeightsSum = DUPLICATE_WEIGHTS.location + DUPLICATE_WEIGHTS.text + DUPLICATE_WEIGHTS.category;
  finalScore = finalScore / activeWeightsSum;

  return {
    score: Number(finalScore.toFixed(3)),
    breakdown: {
      location: locScore,
      text: textScore,
      category: catScore,
      image: 0,
      distance: Math.round(distMeters)
    }
  };
}

/**
 * Main entry point: Find potential duplicates for a new issue.
 */
async function findDuplicates(newIssueData) {
  const [longitude, latitude] = newIssueData.location.coordinates;
  
  // Step 1: Geospatial Candidate Search
  const candidates = await locationService.getNearbyCandidates(longitude, latitude);
  
  if (candidates.length === 0) {
    return { isDuplicate: false, candidates: [] };
  }

  // Step 2: Score candidates
  const scoredCandidates = candidates.map(candidate => {
    const { score, breakdown } = calculateDuplicateScore(newIssueData, candidate);
    return {
      issue: candidate,
      score,
      breakdown
    };
  });

  // Step 3: Filter and Sort
  // Only keep candidates with a score above the DIFFERENT threshold
  const potentialDuplicates = scoredCandidates
    .filter(c => c.score >= DUPLICATE_THRESHOLDS.DIFFERENT)
    .sort((a, b) => b.score - a.score);

  if (potentialDuplicates.length === 0) {
    return { isDuplicate: false, candidates: [] };
  }

  const topMatch = potentialDuplicates[0];
  
  return {
    isDuplicate: topMatch.score >= DUPLICATE_THRESHOLDS.HIGHLY_LIKELY,
    topMatch,
    candidates: potentialDuplicates
  };
}

module.exports = {
  calculateDuplicateScore,
  findDuplicates
};
