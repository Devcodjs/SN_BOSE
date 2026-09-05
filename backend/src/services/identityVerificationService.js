/**
 * Identity Verification Service
 * An abstraction layer for verifying citizen identity.
 * 
 * IMPORTANT PRIVACY RULE:
 * Never store raw Aadhaar information in the application database.
 * The system stores only minimal verification metadata.
 */

/**
 * Mock verification provider for development.
 * Designed to be easily replaceable with a real provider (e.g., UIDAI API, Digilocker).
 */
async function verifyAadhaar(aadhaarNumber, citizenName) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Basic validation (12 digits)
  const isValidFormat = /^\d{12}$/.test(aadhaarNumber);
  
  if (!isValidFormat) {
    return {
      success: false,
      message: 'Invalid Aadhaar format. Must be 12 digits.',
    };
  }

  // Mock logic: reject if starts with '0000'
  if (aadhaarNumber.startsWith('0000')) {
    return {
      success: false,
      message: 'Identity verification failed. Information mismatch.',
    };
  }

  // Success
  return {
    success: true,
    provider: 'MockAadhaarVerificationProvider',
    referenceId: `VER-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  };
}

module.exports = {
  verifyAadhaar
};
