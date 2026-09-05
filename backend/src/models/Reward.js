const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
    },
    type: {
      type: String,
      enum: ['tree', 'certificate', 'badge'],
      required: true,
    },
    data: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

rewardSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Reward', rewardSchema);
