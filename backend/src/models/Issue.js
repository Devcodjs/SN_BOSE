const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Roads', 'Water', 'Garbage', 'Electricity', 'Sanitation', 'Other'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    // Multiple evidence images (max 3)
    images: {
      type: [String],
      validate: [arr => arr.length <= 3, 'Maximum 3 images allowed'],
    },
    imagePublicIds: [String],
    // Municipal proof images (before/after)
    proofImages: [String],
    // GeoJSON Point
    location: {
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: { type: [Number], default: [0, 0] },
      address: { type: String, trim: true },
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    upvoteCount: { type: Number, default: 0 },
    resolvedAt: { type: Date },
    
    // Intelligent Features
    priorityScore: { type: Number, default: 50 }, // Base for 'Medium' priority
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    corroborationCount: { type: Number, default: 0 },
    
    isDuplicate: { type: Boolean, default: false },
    duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', default: null },
    duplicateScore: { type: Number, default: 0 },
    duplicateStatus: { type: String, enum: ['none', 'possible', 'confirmed', 'rejected'], default: 'none' },
    
    supportingReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }],
    
    abuseStatus: { type: String, enum: ['clean', 'flagged', 'reviewed_safe', 'reviewed_abuse'], default: 'clean' },
    lastPriorityCalculation: { type: Date, default: null },
  },
  { timestamps: true }
);

issueSchema.index({ status: 1, category: 1, createdAt: -1 });
issueSchema.index({ submittedBy: 1 });
issueSchema.index({ department: 1 });
issueSchema.index({ location: '2dsphere' });
issueSchema.index({ title: 'text', description: 'text' });
issueSchema.index({ duplicateOf: 1 });
issueSchema.index({ priorityScore: -1 });

module.exports = mongoose.model('Issue', issueSchema);
