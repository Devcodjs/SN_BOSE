const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');

/**
 * Protect routes — verify JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Not authorized — no token provided', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password)
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, 'Not authorized — user not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Not authorized — invalid token', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Not authorized — token expired', 401);
    }
    return sendError(res, 'Not authorized', 401);
  }
};

/**
 * Role-based access control
 * Usage: authorize('admin') or authorize('citizen', 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authorized', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Role '${req.user.role}' is not authorized to access this resource`,
        403
      );
    }

    next();
  };
};

module.exports = { protect, authorize };
