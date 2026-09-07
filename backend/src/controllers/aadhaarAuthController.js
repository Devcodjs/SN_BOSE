const jwt = require('jsonwebtoken');
const User = require('../models/User');
const aadhaarService = require('../services/aadhaarService');
const { generateAadhaarHash, maskAadhaarNumber } = require('../utils/aadhaarHash');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const {
  validateAadhaarRequest,
  validateAadhaarVerify,
  validateRegister,
} = require('../validators/validators');

/**
 * Generate standard JWT token (consistent with authController)
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

/**
 * Generate temporary signed onboarding token for unlinked Aadhaar verification
 */
const generateOnboardingToken = (aadhaarHash) => {
  return jwt.sign(
    { aadhaarHash, purpose: 'aadhaar_onboarding' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

/**
 * @route   POST /api/auth/aadhaar/request-otp
 * @desc    Initiate Aadhaar OTP verification
 * @access  Public
 */
const requestOtp = async (req, res, next) => {
  try {
    const errors = validateAadhaarRequest(req.body);
    if (errors.length > 0) {
      return sendError(res, 'Validation failed', 400, errors);
    }

    const { aadhaarNumber } = req.body;
    const result = await aadhaarService.requestAadhaarOtp(aadhaarNumber);

    sendSuccess(
      res,
      {
        transactionId: result.transactionId,
        expiresAt: result.expiresAt,
      },
      result.message
    );
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode);
    }
    next(error);
  }
};

/**
 * @route   POST /api/auth/aadhaar/verify-otp
 * @desc    Verify Aadhaar OTP & authenticate or initiate onboarding
 * @access  Public
 */
const verifyOtp = async (req, res, next) => {
  try {
    const errors = validateAadhaarVerify(req.body);
    if (errors.length > 0) {
      return sendError(res, 'Validation failed', 400, errors);
    }

    const { transactionId, otp } = req.body;

    // Verify OTP via Aadhaar Service
    const verificationResult = await aadhaarService.verifyAadhaarOtp(transactionId, otp);
    const rawAadhaarNumber = verificationResult.aadhaarNumber;

    // Compute server-side privacy-preserving HMAC hash
    const aadhaarHash = generateAadhaarHash(rawAadhaarNumber);

    // Look for existing user linked to this aadhaarHash
    const user = await User.findOne({ aadhaarHash });

    if (user) {
      // Returning Citizen with linked account
      const token = generateToken(user._id);

      return sendSuccess(
        res,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
          },
          token,
        },
        'Aadhaar login successful'
      );
    }

    // Account not yet linked — return onboarding token for safe registration or account linking
    const onboardingToken = generateOnboardingToken(aadhaarHash);
    const masked = maskAadhaarNumber(rawAadhaarNumber);

    return sendSuccess(
      res,
      {
        requiresOnboarding: true,
        onboardingToken,
        maskedAadhaar: masked,
      },
      'Aadhaar verified successfully. Please complete account linking or new citizen registration.'
    );
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, error.statusCode);
    }
    next(error);
  }
};

/**
 * @route   POST /api/auth/aadhaar/complete-onboarding
 * @desc    Register a new citizen linked with verified Aadhaar
 * @access  Public
 */
const completeOnboarding = async (req, res, next) => {
  try {
    const { onboardingToken, name, email, password, phone } = req.body;

    if (!onboardingToken) {
      return sendError(res, 'Onboarding token is required', 400);
    }

    // Verify onboarding token
    let decoded;
    try {
      decoded = jwt.verify(onboardingToken, process.env.JWT_SECRET);
      if (decoded.purpose !== 'aadhaar_onboarding' || !decoded.aadhaarHash) {
        return sendError(res, 'Invalid onboarding token purpose', 400);
      }
    } catch {
      return sendError(res, 'Onboarding token has expired or is invalid. Please verify Aadhaar again.', 401);
    }

    // Validate registration body
    const errors = validateRegister({ name, email, password });
    if (errors.length > 0) {
      return sendError(res, 'Validation failed', 400, errors);
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(
        res,
        'An account with this email already exists. Please link your existing account instead.',
        400
      );
    }

    // Double check aadhaarHash is not linked to another user
    const existingAadhaar = await User.findOne({ aadhaarHash: decoded.aadhaarHash });
    if (existingAadhaar) {
      return sendError(res, 'This Aadhaar is already linked to an existing account', 400);
    }

    // Create user with aadhaarHash
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'citizen',
      aadhaarHash: decoded.aadhaarHash,
    });

    const token = generateToken(user._id);

    sendSuccess(
      res,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        token,
      },
      'Citizen registration and Aadhaar linking successful',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/aadhaar/link-account
 * @desc    Link verified Aadhaar to an existing email/password citizen account
 * @access  Public
 */
const linkAccount = async (req, res, next) => {
  try {
    const { onboardingToken, email, password } = req.body;

    if (!onboardingToken || !email || !password) {
      return sendError(res, 'Onboarding token, email, and password are required', 400);
    }

    let decoded;
    try {
      decoded = jwt.verify(onboardingToken, process.env.JWT_SECRET);
      if (decoded.purpose !== 'aadhaar_onboarding' || !decoded.aadhaarHash) {
        return sendError(res, 'Invalid onboarding token', 400);
      }
    } catch {
      return sendError(res, 'Onboarding session expired. Please verify Aadhaar again.', 401);
    }

    // Find existing user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Ensure user isn't already linked to another Aadhaar
    if (user.aadhaarHash) {
      return sendError(res, 'This account is already linked to another Aadhaar identity', 400);
    }

    // Link aadhaarHash
    user.aadhaarHash = decoded.aadhaarHash;
    await user.save();

    const token = generateToken(user._id);

    sendSuccess(
      res,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        token,
      },
      'Aadhaar successfully linked to existing account'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
  completeOnboarding,
  linkAccount,
};
