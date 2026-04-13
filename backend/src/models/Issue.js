const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Issue title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Issue description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Roads', 'Garbage', 'Water', 'Electricity', 'Sanitation', 'Other'],
        message: '{VALUE} is not a valid category',
      },
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
    image: {
      type: String, // Cloudinary URL
    },
    imagePublicId: {
      type: String, // For Cloudinary deletion
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
      address: {
        type: String,
        trim: true,
      },
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt, updatedAt
  }
);

// Compound index for filtered queries (most common query pattern)
issueSchema.index({ status: 1, category: 1, createdAt: -1 });

// Index for user's own issues
issueSchema.index({ reportedBy: 1 });

// Geospatial index for location-based queries
issueSchema.index({ location: '2dsphere' });

// Text index for search
issueSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Issue', issueSchema);
