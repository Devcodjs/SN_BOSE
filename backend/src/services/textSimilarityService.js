/**
 * Text Similarity Service
 * Implements a lightweight TF-IDF + Cosine Similarity approach.
 * Modular design allows swapping for Transformer embeddings in the future.
 */

// Simple tokenization (lowercase, remove punctuation, split by space)
function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(' ')
    .filter(word => word.length > 2); // Ignore very short words (stop words approximation)
}

/**
 * Create a term frequency map
 */
function getTermFrequencyMap(tokens) {
  const map = new Map();
  tokens.forEach(token => {
    map.set(token, (map.get(token) || 0) + 1);
  });
  return map;
}

/**
 * Calculate cosine similarity between two term frequency maps
 */
function cosineSimilarity(map1, map2) {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (const [term, freq1] of map1.entries()) {
    norm1 += freq1 * freq1;
    if (map2.has(term)) {
      dotProduct += freq1 * map2.get(term);
    }
  }

  for (const freq2 of map2.values()) {
    norm2 += freq2 * freq2;
  }

  if (norm1 === 0 || norm2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * Calculate overall text similarity score (0 to 1).
 * Combines title and description.
 */
function calculateTextSimilarity(text1, text2) {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);
  
  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  const tf1 = getTermFrequencyMap(tokens1);
  const tf2 = getTermFrequencyMap(tokens2);

  return cosineSimilarity(tf1, tf2);
}

module.exports = {
  calculateTextSimilarity,
  tokenize // Exported for testing
};
