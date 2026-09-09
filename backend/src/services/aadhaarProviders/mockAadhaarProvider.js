const crypto = require('crypto');
const { generateAadhaarHash, maskAadhaarNumber } = require('../../utils/aadhaarHash');
const { validateVerhoeff } = require('../../utils/verhoeff');

/**
 * Mock Aadhaar Provider for Local Development & Testing.
 * Enabled ONLY when AADHAAR_PROVIDER=mock
 */

// In-memory store for active OTP transactions
// Map: transactionId => { aadhaarHash, otpHash, expiresAt, attempts, createdAt }
const activeTransactions = new Map();

/**
 * Clean up expired transactions periodically
 */
const cleanupExpiredTransactions = () => {
  const now = Date.now();
  for (const [txId, tx] of activeTransactions.entries()) {
    if (now > tx.expiresAt) {
      activeTransactions.delete(txId);
    }
  }
};

// Run cleanup every 60 seconds
setInterval(cleanupExpiredTransactions, 60000).unref();

const isValidAadhaarFormat = (aadhaarNumber) => {
  if (!aadhaarNumber || typeof aadhaarNumber !== 'string') return false;
  const clean = aadhaarNumber.replace(/\s+/g, '');
  if (!/^\d{12}$/.test(clean)) return false;
  if (/^[01]/.test(clean)) return false;
  return true;
};

const mockAadhaarProvider = {
  name: 'mock',

  /**
   * Request OTP for Aadhaar number
   * @param {string} aadhaarNumber 
   * @returns {Promise<{ success: boolean, transactionId: string, message: string, expiresAt: Date, demoOtp?: string }>}
   */
  async requestOtp(aadhaarNumber) {
    if (process.env.AADHAAR_PROVIDER !== 'mock') {
      throw new Error('Mock Aadhaar provider is not enabled in environment');
    }

    const cleanNumber = (aadhaarNumber || '').replace(/\s+/g, '');

    // Format and Verhoeff validation
    if (!isValidAadhaarFormat(cleanNumber)) {
      const error = new Error('Aadhaar number must consist of 12 valid digits with a valid checksum');
      error.statusCode = 400;
      throw error;
    }

    const aadhaarHash = generateAadhaarHash(cleanNumber);
    const now = Date.now();

    // Check active transactions for same aadhaarHash (cooldown protection: 30s)
    // If cooldown passed but tx still present, delete old transaction (supersede)
    for (const [txId, tx] of activeTransactions.entries()) {
      if (tx.aadhaarHash === aadhaarHash) {
        if (now - tx.createdAt < 30000) {
          const error = new Error('Please wait at least 30 seconds before requesting another OTP');
          error.statusCode = 429;
          throw error;
        } else {
          activeTransactions.delete(txId);
        }
      }
    }

    const transactionId = `mock_txn_${crypto.randomUUID()}`;
    const expiryMinutes = parseInt(process.env.AADHAAR_OTP_EXPIRY_MINUTES || '5', 10);
    const expiresAt = now + expiryMinutes * 60 * 1000;

    // Generate random 6-digit OTP per request
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    activeTransactions.set(transactionId, {
      aadhaarHash,
      otpHash,
      expiresAt,
      attempts: 0,
      createdAt: now,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[MOCK AADHAAR PROVIDER] OTP initiated for target ${maskAadhaarNumber(cleanNumber)} (Tx: ${transactionId})`);
    }

    const result = {
      success: true,
      transactionId,
      message: 'OTP initiated successfully to Aadhaar-registered mobile number',
      expiresAt: new Date(expiresAt),
    };

    if ((process.env.AADHAAR_PROVIDER || 'mock').toLowerCase() === 'mock') {
      result.demoOtp = otp;
    }

    return result;
  },

  /**
   * Verify OTP for a given transactionId
   * @param {string} transactionId 
   * @param {string} otp 
   * @returns {Promise<{ success: boolean, aadhaarHash: string }>}
   */
  async verifyOtp(transactionId, otp) {
    if (process.env.AADHAAR_PROVIDER !== 'mock') {
      throw new Error('Mock Aadhaar provider is not enabled in environment');
    }

    const tx = activeTransactions.get(transactionId);

    if (!tx) {
      const error = new Error('Invalid or expired Aadhaar OTP transaction');
      error.statusCode = 400;
      throw error;
    }

    const now = Date.now();
    if (now > tx.expiresAt) {
      activeTransactions.delete(transactionId);
      const error = new Error('Aadhaar OTP has expired. Please request a new OTP.');
      error.statusCode = 400;
      throw error;
    }

    if (tx.attempts >= 3) {
      activeTransactions.delete(transactionId);
      const error = new Error('Maximum OTP verification attempts exceeded. Please request a new OTP.');
      error.statusCode = 400;
      throw error;
    }

    const cleanOtp = (otp || '').trim();
    const inputOtpHash = crypto.createHash('sha256').update(cleanOtp).digest('hex');
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(inputOtpHash, 'utf8'),
      Buffer.from(tx.otpHash, 'utf8')
    );

    if (!isMatch) {
      tx.attempts += 1;
      if (tx.attempts >= 3) {
        activeTransactions.delete(transactionId);
        const error = new Error('Maximum OTP verification attempts exceeded. Transaction invalidated.');
        error.statusCode = 400;
        throw error;
      }
      const error = new Error(`Incorrect OTP. ${3 - tx.attempts} attempt(s) remaining.`);
      error.statusCode = 400;
      throw error;
    }

    // OTP Verified! Consume single-use transaction.
    const verifiedAadhaarHash = tx.aadhaarHash;
    activeTransactions.delete(transactionId);

    return {
      success: true,
      aadhaarHash: verifiedAadhaarHash,
    };
  },

  // Helper for testing
  _clearTransactions() {
    activeTransactions.clear();
  },
};

module.exports = mockAadhaarProvider;
