const mockAadhaarProvider = require('./aadhaarProviders/mockAadhaarProvider');

/**
 * Aadhaar Service Abstraction Layer.
 * Delegates OTP request and verification to the active provider specified by process.env.AADHAAR_PROVIDER.
 */

const getActiveProvider = () => {
  const providerName = (process.env.AADHAAR_PROVIDER || 'mock').toLowerCase();

  switch (providerName) {
    case 'mock':
      return mockAadhaarProvider;
    default:
      throw new Error(
        `Unsupported or unconfigured Aadhaar provider '${providerName}'. ` +
        `Set AADHAAR_PROVIDER=mock for development mode or register a legitimate authorized provider.`
      );
  }
};

const aadhaarService = {
  /**
   * Request OTP for Aadhaar verification
   * @param {string} aadhaarNumber 
   * @returns {Promise<{ success: boolean, transactionId: string, message: string, expiresAt: Date }>}
   */
  async requestAadhaarOtp(aadhaarNumber) {
    const provider = getActiveProvider();
    return await provider.requestOtp(aadhaarNumber);
  },

  /**
   * Verify Aadhaar OTP
   * @param {string} transactionId 
   * @param {string} otp 
   * @returns {Promise<{ success: boolean, aadhaarNumber: string }>}
   */
  async verifyAadhaarOtp(transactionId, otp) {
    const provider = getActiveProvider();
    return await provider.verifyOtp(transactionId, otp);
  },

  /**
   * Log startup notice regarding active Aadhaar provider
   */
  logProviderStatus() {
    const providerName = (process.env.AADHAAR_PROVIDER || 'mock').toLowerCase();
    if (providerName === 'mock') {
      console.warn('⚠️  [SECURITY NOTICE] Aadhaar Authentication running with DEVELOPMENT MOCK PROVIDER (AADHAAR_PROVIDER=mock).');
      console.warn('   Mock OTP defaults to 123456. Do NOT use this mode in production!\n');
    } else {
      console.log(`🔒 Aadhaar Authentication configured with production provider: ${providerName}\n`);
    }
  },
};

module.exports = aadhaarService;
