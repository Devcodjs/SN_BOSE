const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });

const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return sendError(res, 'Name, email and password are required', 400);
  }
  const exists = await User.findOne({ email });
  if (exists) return sendError(res, 'Email already registered', 400);

  const user = await User.create({ name, email, password, phone });
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  setRefreshCookie(res, refreshToken);

  sendSuccess(res, {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, rewards: user.rewards, identityVerified: user.identityVerified, trustScore: user.trustScore },
    accessToken,
  }, 'Registration successful', 201);
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return sendError(res, 'Email and password are required', 400);

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return sendError(res, 'Invalid email or password', 401);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  setRefreshCookie(res, refreshToken);

  sendSuccess(res, {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, rewards: user.rewards, identityVerified: user.identityVerified, trustScore: user.trustScore },
    accessToken,
  }, 'Login successful');
});

// POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return sendError(res, 'No refresh token', 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return sendError(res, 'Invalid refresh token', 401);
    }
    const accessToken = generateAccessToken(user._id);
    const newRefresh = generateRefreshToken(user._id);
    user.refreshToken = newRefresh;
    await user.save({ validateBeforeSave: false });
    setRefreshCookie(res, newRefresh);

    sendSuccess(res, { accessToken }, 'Token refreshed');
  } catch {
    return sendError(res, 'Invalid refresh token', 401);
  }
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    } catch { /* ignore */ }
  }
  res.clearCookie('refreshToken');
  sendSuccess(res, null, 'Logged out');
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('department', 'name');
  sendSuccess(res, user);
});

module.exports = { register, login, refresh, logout, getMe };
