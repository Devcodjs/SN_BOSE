const mongoose = require('mongoose');

const upvoteSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: [true, 'Issue reference is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index — one upvote per user per issue
upvoteSchema.index({ issue: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Upvote', upvoteSchema);
