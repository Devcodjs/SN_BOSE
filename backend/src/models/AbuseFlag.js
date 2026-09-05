const mongoose = require('mongoose');

const abuseFlagSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
    },
    reason: {
      type: String,
      required: true,
      enum: [
        'EXCESSIVE_REPORTING', 
        'REPEATED_DUPLICATE', 
        'SUSPICIOUS_LOCATION', 
        'POOR_QUALITY',
        'OTHER'
      ]
    },
    riskScore: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'reviewed_safe', 'warned', 'restricted', 'rejected'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewComment: { type: String },
    reviewedAt: { type: Date }
  },
  { timestamps: true }
);

abuseFlagSchema.index({ citizen: 1 });
abuseFlagSchema.index({ status: 1 });

module.exports = mongoose.model('AbuseFlag', abuseFlagSchema);
