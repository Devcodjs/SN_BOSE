const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return sendError(res, 'Not authorized — no token provided', 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return sendError(res, 'Not authorized — user not found', 401);

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired', 401);
    }
    return sendError(res, 'Not authorized — invalid token', 401);
  }
};

/** Optional auth — attaches user if token present, but doesn't block */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
  } catch (e) { /* ignore */ }
  next();
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return sendError(res, 'Not authorized', 401);
  if (!roles.includes(req.user.role)) {
    return sendError(res, `Role '${req.user.role}' is not authorized`, 403);
  }
  next();
};

const requireAdmin = [protect, authorize('admin')];
const requireMunicipality = [protect, authorize('municipality', 'admin')];

module.exports = { protect, optionalAuth, authorize, requireAdmin, requireMunicipality };
