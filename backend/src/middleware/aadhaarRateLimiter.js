const { sendError } = require('../utils/apiResponse');

/**
 * In-memory rate-limiter middleware for Aadhaar OTP endpoints.
 * Prevents OTP spam and brute-force verification attempts without external dependencies.
 */

const requestCounts = new Map(); // ip => { count, resetTime }

// Clean up expired IP windows every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(ip);
    }
  }
}, 300000).unref();

/**
 * Rate limit for requesting Aadhaar OTP (max 5 requests per 5 minutes per IP)
 */
const aadhaarOtpRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown_ip';
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxRequests = 5;

  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return next();
  }

  if (record.count >= maxRequests) {
    const retrySeconds = Math.ceil((record.resetTime - now) / 1000);
    return sendError(
      res,
      `Too many OTP requests from this IP. Please try again in ${retrySeconds} seconds.`,
      429
    );
  }

  record.count += 1;
  next();
};

module.exports = { aadhaarOtpRateLimiter };
