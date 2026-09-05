const mongoose = require('mongoose');

const issueUpdateSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventType: {
      type: String,
      enum: [
        'CREATED', 'STATUS_CHANGED', 'DEPARTMENT_ASSIGNED', 'PROOF_UPLOADED',
        'VERIFIED', 'DUPLICATE_LINKED', 'SUPPORTING_REPORT_ADDED',
        'PRIORITY_CHANGED', 'SEVERITY_CHANGED', 'ABUSE_FLAGGED', 'ABUSE_REVIEWED'
      ],
      default: 'STATUS_CHANGED',
    },
    fromStatus: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected', null],
    },
    toStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    },
    comment: {
      type: String,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    proofImage: { type: String },
  },
  { timestamps: true }
);

issueUpdateSchema.index({ issue: 1, createdAt: 1 });

module.exports = mongoose.model('IssueUpdate', issueUpdateSchema);
