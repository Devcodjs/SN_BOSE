const crypto = require('crypto');

/**
 * Privacy-preserving server-side Aadhaar hashing utility.
 * Raw Aadhaar numbers are never stored in MongoDB.
 */

/**
 * Generates an irreversible HMAC-SHA256 hash of the Aadhaar number.
 * @param {string} aadhaarNumber - 12-digit numeric Aadhaar string
 * @returns {string} Hex-encoded HMAC hash
 */
const generateAadhaarHash = (aadhaarNumber) => {
  if (!aadhaarNumber || typeof aadhaarNumber !== 'string') {
    throw new Error('Invalid Aadhaar number input for hashing');
  }
  const cleanNumber = aadhaarNumber.replace(/\s+/g, '');
  const secret = process.env.AADHAAR_HASH_SECRET || 'fallback_dev_aadhaar_hash_secret_change_in_prod';
  return crypto.createHmac('sha256', secret).update(cleanNumber).digest('hex');
};

/**
 * Masks an Aadhaar number for safe display/logging: e.g. "XXXX XXXX 1234"
 * @param {string} aadhaarNumber 
 * @returns {string} Masked string
 */
const maskAadhaarNumber = (aadhaarNumber) => {
  if (!aadhaarNumber || typeof aadhaarNumber !== 'string') {
    return 'XXXX XXXX XXXX';
  }
  const clean = aadhaarNumber.replace(/\s+/g, '');
  if (clean.length < 4) {
    return 'XXXX XXXX XXXX';
  }
  const last4 = clean.slice(-4);
  return `XXXX XXXX ${last4}`;
};

module.exports = {
  generateAadhaarHash,
  maskAadhaarNumber,
};
