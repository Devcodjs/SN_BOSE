const mongoose = require('mongoose');

const statusLogSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: [true, 'Issue reference is required'],
    },
    fromStatus: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected', null],
    },
    toStatus: {
      type: String,
      required: [true, 'Target status is required'],
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Changed by user is required'],
    },
    note: {
      type: String,
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true, // createdAt = when the status changed
  }
);

// Index for fetching status history of an issue in chronological order
statusLogSchema.index({ issue: 1, createdAt: 1 });

module.exports = mongoose.model('StatusLog', statusLogSchema);
