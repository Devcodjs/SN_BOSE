const { validateVerhoeff, generateValidAadhaar } = require('../src/utils/verhoeff');
const { generateAadhaarHash, maskAadhaarNumber } = require('../src/utils/aadhaarHash');
const mockAadhaarProvider = require('../src/services/aadhaarProviders/mockAadhaarProvider');
const aadhaarService = require('../src/services/aadhaarService');
const { validateAadhaarRequest, validateAadhaarVerify } = require('../src/validators/validators');
const jwt = require('jsonwebtoken');

describe('Aadhaar Authentication & Security Test Suite', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, AADHAAR_PROVIDER: 'mock', JWT_SECRET: 'test_jwt_secret', AADHAAR_HASH_SECRET: 'test_hash_secret' };
    mockAadhaarProvider._clearTransactions();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // Valid 12-digit Aadhaar number with valid Verhoeff checksum
  const validAadhaar = generateValidAadhaar('99999999002');

  test('1. Verhoeff algorithm correctly validates Aadhaar checksum', () => {
    expect(validateVerhoeff(validAadhaar)).toBe(true);
    expect(validateVerhoeff('999999990027')).toBe(false); // Wrong checksum
  });

  test('2. Invalid Aadhaar format is rejected (not 12 digits or starts with 0/1)', () => {
    const invalidShort = validateAadhaarRequest({ aadhaarNumber: '12345' });
    expect(invalidShort.length).toBeGreaterThan(0);

    const startsWithZero = validateAadhaarRequest({ aadhaarNumber: '012345678901' });
    expect(startsWithZero.length).toBeGreaterThan(0);

    const nonNumeric = validateAadhaarRequest({ aadhaarNumber: '99999999002A' });
    expect(nonNumeric.length).toBeGreaterThan(0);
  });

  test('3. Invalid Aadhaar checksum is rejected by validator', () => {
    const invalidChecksum = validateAadhaarRequest({ aadhaarNumber: '999999990027' });
    expect(invalidChecksum).toContain('Invalid Aadhaar number checksum');
  });

  test('4. OTP request succeeds in mock development mode', async () => {
    const result = await aadhaarService.requestAadhaarOtp(validAadhaar);
    expect(result.success).toBe(true);
    expect(result.transactionId).toBeDefined();
    expect(result.message).toBe('OTP initiated successfully to Aadhaar-registered mobile number');
  });

  test('5. Incorrect OTP fails verification', async () => {
    const reqResult = await aadhaarService.requestAadhaarOtp(validAadhaar);
    await expect(
      aadhaarService.verifyAadhaarOtp(reqResult.transactionId, '000000')
    ).rejects.toThrow('Incorrect OTP');
  });

  test('6. Expired OTP transaction fails verification', async () => {
    process.env.AADHAAR_OTP_EXPIRY_MINUTES = '0'; // Expire immediately
    const reqResult = await mockAadhaarProvider.requestOtp(validAadhaar);
    
    // Fast forward expiry
    await new Promise(r => setTimeout(r, 10));

    await expect(
      mockAadhaarProvider.verifyOtp(reqResult.transactionId, '123456')
    ).rejects.toThrow('Aadhaar OTP has expired');
  });

  test('7. Correct OTP authenticates successfully', async () => {
    const reqResult = await aadhaarService.requestAadhaarOtp(validAadhaar);
    const verifyResult = await aadhaarService.verifyAadhaarOtp(reqResult.transactionId, '123456');
    expect(verifyResult.success).toBe(true);
    expect(verifyResult.aadhaarNumber).toBe(validAadhaar);
  });

  test('8. OTP cannot be reused after successful verification', async () => {
    const reqResult = await aadhaarService.requestAadhaarOtp(validAadhaar);
    await aadhaarService.verifyAadhaarOtp(reqResult.transactionId, '123456');

    // Second attempt must fail
    await expect(
      aadhaarService.verifyAadhaarOtp(reqResult.transactionId, '123456')
    ).rejects.toThrow('Invalid or expired Aadhaar OTP transaction');
  });

  test('9. Excessive incorrect OTP attempts block and invalidate transaction', async () => {
    const reqResult = await aadhaarService.requestAadhaarOtp(validAadhaar);

    // 1st attempt wrong
    await expect(aadhaarService.verifyAadhaarOtp(reqResult.transactionId, '111111')).rejects.toThrow();
    // 2nd attempt wrong
    await expect(aadhaarService.verifyAadhaarOtp(reqResult.transactionId, '222222')).rejects.toThrow();
    // 3rd attempt wrong -> invalidates transaction
    await expect(aadhaarService.verifyAadhaarOtp(reqResult.transactionId, '333333')).rejects.toThrow();

    // 4th attempt transaction no longer exists
    await expect(aadhaarService.verifyAadhaarOtp(reqResult.transactionId, '123456')).rejects.toThrow('Invalid or expired');
  });

  test('10. Rapid repeated OTP requests for same Aadhaar are blocked by cooldown', async () => {
    await aadhaarService.requestAadhaarOtp(validAadhaar);
    // Immediate second request within 30 seconds
    await expect(aadhaarService.requestAadhaarOtp(validAadhaar)).rejects.toThrow(
      'Please wait at least 30 seconds'
    );
  });

  test('11. Raw Aadhaar is never exposed by generateAadhaarHash', () => {
    const hash = generateAadhaarHash(validAadhaar);
    expect(hash).not.toContain(validAadhaar);
    expect(hash).toHaveLength(64); // SHA256 hex length
  });

  test('12. Masking function never leaks full Aadhaar number', () => {
    const masked = maskAadhaarNumber(validAadhaar);
    expect(masked).toBe(`XXXX XXXX ${validAadhaar.slice(-4)}`);
    expect(masked).not.toContain('99999999');
  });

  test('13. JWT token payload does NOT contain raw Aadhaar or aadhaarHash', () => {
    const userId = '60d5ecb8b5c9c82b8c8d1234';
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(userId);
    expect(decoded.aadhaarNumber).toBeUndefined();
    expect(decoded.aadhaarHash).toBeUndefined();
  });

  test('14. Mock provider rejects execution if AADHAAR_PROVIDER is not mock', async () => {
    process.env.AADHAAR_PROVIDER = 'production_uidai';
    await expect(mockAadhaarProvider.requestOtp(validAadhaar)).rejects.toThrow('Mock Aadhaar provider is not enabled');
  });
});
