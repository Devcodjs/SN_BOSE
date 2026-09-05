const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['citizen', 'admin', 'municipality'],
      default: 'citizen',
    },
    phone: { type: String, trim: true },
    avatar: { type: String },
    refreshToken: { type: String, select: false },
    // Rewards
    rewards: {
      treesPlanted: { type: Number, default: 0 },
      certificates: [{ type: String }],   // Cloudinary URLs to PDFs
      badges: [{ type: String }],          // Badge type identifiers
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    // Identity Verification
    identityVerified: { type: Boolean, default: false },
    verificationStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'failed'], default: 'unverified' },
    verificationProvider: { type: String, default: null },
    verificationReference: { type: String, default: null },
    verifiedAt: { type: Date, default: null },
    
    // Trust Score & Reputation
    trustScore: { type: Number, default: 100, min: 0, max: 100 },
    totalReports: { type: Number, default: 0 },
    verifiedReports: { type: Number, default: 0 },
    resolvedReports: { type: Number, default: 0 },
    rejectedReports: { type: Number, default: 0 },
    duplicateReports: { type: Number, default: 0 },
    abuseFlags: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Virtual: count of resolved issues submitted by this citizen
userSchema.virtual('totalResolved', {
  ref: 'Issue',
  localField: '_id',
  foreignField: 'submittedBy',
  count: true,
  match: { status: 'Resolved' },
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
