const crypto = require('crypto');
const { validateVerhoeff } = require('../../utils/verhoeff');
const { maskAadhaarNumber } = require('../../utils/aadhaarHash');

/**
 * Mock Aadhaar Provider for Local Development & Testing.
 * Enabled ONLY when AADHAAR_PROVIDER=mock
 */

// In-memory store for active OTP transactions
// Map: transactionId => { aadhaarNumber, otp, expiresAt, attempts, createdAt }
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

/**
 * Validate basic Aadhaar format (12 numeric digits, non-zero start, Verhoeff checksum)
 */
const isValidAadhaarFormat = (aadhaarNumber) => {
  if (!aadhaarNumber || typeof aadhaarNumber !== 'string') return false;
  const clean = aadhaarNumber.replace(/\s+/g, '');
  if (!/^[2-9]\d{11}$/.test(clean)) return false; // Indian Aadhaar numbers do not start with 0 or 1
  return validateVerhoeff(clean);
};

const mockAadhaarProvider = {
  name: 'mock',

  /**
   * Request OTP for Aadhaar number
   * @param {string} aadhaarNumber 
   * @returns {Promise<{ success: boolean, transactionId: string, message: string, expiresAt: Date }>}
   */
  async requestOtp(aadhaarNumber) {
    if (process.env.AADHAAR_PROVIDER !== 'mock') {
      throw new Error('Mock Aadhaar provider is not enabled in environment');
    }

    const cleanNumber = (aadhaarNumber || '').replace(/\s+/g, '');

    // Format and Verhoeff validation
    if (!isValidAadhaarFormat(cleanNumber)) {
      const error = new Error('Invalid Aadhaar number format or checksum');
      error.statusCode = 400;
      throw error;
    }

    // Check for recent active transactions for the same Aadhaar (cooldown protection: 30s)
    const now = Date.now();
    for (const [txId, tx] of activeTransactions.entries()) {
      if (tx.aadhaarNumber === cleanNumber && now - tx.createdAt < 30000) {
        const error = new Error('Please wait at least 30 seconds before requesting another OTP');
        error.statusCode = 429;
        throw error;
      }
    }

    const transactionId = `mock_txn_${crypto.randomUUID()}`;
    const expiryMinutes = parseInt(process.env.AADHAAR_OTP_EXPIRY_MINUTES || '5', 10);
    const expiresAt = now + expiryMinutes * 60 * 1000;

    // Configurable dev OTP, defaults to '123456' for predictable mock testing
    const otp = process.env.MOCK_AADHAAR_OTP || '123456';

    activeTransactions.set(transactionId, {
      aadhaarNumber: cleanNumber,
      otp,
      expiresAt,
      attempts: 0,
      createdAt: now,
    });

    // Note: Masked log only, never log raw Aadhaar or OTP
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[MOCK AADHAAR PROVIDER] OTP initiated for Aadhaar target ${maskAadhaarNumber(cleanNumber)} (Tx: ${transactionId})`);
    }

    return {
      success: true,
      transactionId,
      message: 'OTP initiated successfully to Aadhaar-registered mobile number',
      expiresAt: new Date(expiresAt),
    };
  },

  /**
   * Verify OTP for a given transactionId
   * @param {string} transactionId 
   * @param {string} otp 
   * @returns {Promise<{ success: boolean, aadhaarNumber: string }>}
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
    if (cleanOtp !== tx.otp) {
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
    const verifiedAadhaarNumber = tx.aadhaarNumber;
    activeTransactions.delete(transactionId);

    return {
      success: true,
      aadhaarNumber: verifiedAadhaarNumber,
    };
  },

  // Helper for testing
  _clearTransactions() {
    activeTransactions.clear();
  },
};

module.exports = mockAadhaarProvider;
