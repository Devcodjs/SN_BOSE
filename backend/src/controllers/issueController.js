const Issue = require('../models/Issue');
const StatusLog = require('../models/StatusLog');
const Upvote = require('../models/Upvote');
const { cloudinary } = require('../config/cloudinary');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { validateIssue } = require('../validators/validators');

/**
 * @route   GET /api/issues
 * @desc    Get all issues (paginated, filterable)
 * @access  Public
 */
const getIssues = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Sort options
    let sort = { createdAt: -1 }; // Default: newest first
    if (req.query.sort === 'upvotes') {
      sort = { upvoteCount: -1 };
    } else if (req.query.sort === 'oldest') {
      sort = { createdAt: 1 };
    }

    const [issues, total] = await Promise.all([
      Issue.find(filter)
        .populate('reportedBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Issue.countDocuments(filter),
    ]);

    sendSuccess(res, {
      data: issues,
      count: issues.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/issues/my/issues
 * @desc    Get issues reported by current user
 * @access  Private (Citizen)
 */
const getMyIssues = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = { reportedBy: req.user._id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [issues, total] = await Promise.all([
      Issue.find(filter)
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Issue.countDocuments(filter),
    ]);

    sendSuccess(res, {
      data: issues,
      count: issues.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/issues/:id
 * @desc    Get single issue with status history
 * @access  Public
 */
const getIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email avatar')
      .populate('assignedTo', 'name email')
      .lean();

    if (!issue) {
      return sendError(res, 'Issue not found', 404);
    }

    // Get status history
    const statusLogs = await StatusLog.find({ issue: issue._id })
      .populate('changedBy', 'name role')
      .sort({ createdAt: 1 })
      .lean();

    // Check if current user has upvoted (if authenticated)
    let hasUpvoted = false;
    if (req.user) {
      const upvote = await Upvote.findOne({
        issue: issue._id,
        user: req.user._id,
      });
      hasUpvoted = !!upvote;
    }

    sendSuccess(res, {
      ...issue,
      statusLogs,
      hasUpvoted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/issues
 * @desc    Create a new issue
 * @access  Private (Citizen)
 */
const createIssue = async (req, res, next) => {
  try {
    // Validate input
    const errors = validateIssue(req.body);
    if (errors.length > 0) {
      return sendError(res, 'Validation failed', 400, errors);
    }

    const { title, description, category, priority, address, latitude, longitude } = req.body;

    // Build issue data
    const issueData = {
      title,
      description,
      category,
      priority: priority || 'Medium',
      reportedBy: req.user._id,
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(longitude) || 0,
          parseFloat(latitude) || 0,
        ],
        address: address || '',
      },
    };

    // Handle image upload (multer already uploaded to Cloudinary)
    if (req.file) {
      issueData.image = req.file.path;
      issueData.imagePublicId = req.file.filename;
    }

    const issue = await Issue.create(issueData);

    // Create initial status log
    await StatusLog.create({
      issue: issue._id,
      fromStatus: null,
      toStatus: 'Pending',
      changedBy: req.user._id,
      note: 'Issue reported',
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email')
      .lean();

    sendSuccess(res, populatedIssue, 'Issue created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/issues/:id
 * @desc    Update own issue (only if Pending)
 * @access  Private (Owner)
 */
const updateIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return sendError(res, 'Issue not found', 404);
    }

    // Only owner can update
    if (issue.reportedBy.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized to update this issue', 403);
    }

    // Can only update if still Pending
    if (issue.status !== 'Pending') {
      return sendError(res, 'Cannot update an issue that is already being processed', 400);
    }

    const { title, description, category, priority, address, latitude, longitude } = req.body;

    if (title) issue.title = title;
    if (description) issue.description = description;
    if (category) issue.category = category;
    if (priority) issue.priority = priority;
    if (address) issue.location.address = address;
    if (latitude && longitude) {
      issue.location.coordinates = [parseFloat(longitude), parseFloat(latitude)];
    }

    // Handle new image upload
    if (req.file) {
      // Delete old image from Cloudinary
      if (issue.imagePublicId) {
        await cloudinary.uploader.destroy(issue.imagePublicId);
      }
      issue.image = req.file.path;
      issue.imagePublicId = req.file.filename;
    }

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email')
      .lean();

    sendSuccess(res, updatedIssue, 'Issue updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/issues/:id
 * @desc    Delete issue (owner or admin)
 * @access  Private
 */
const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return sendError(res, 'Issue not found', 404);
    }

    // Only owner or admin can delete
    const isOwner = issue.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return sendError(res, 'Not authorized to delete this issue', 403);
    }

    // Delete image from Cloudinary
    if (issue.imagePublicId) {
      await cloudinary.uploader.destroy(issue.imagePublicId);
    }

    // Delete related records
    await Promise.all([
      StatusLog.deleteMany({ issue: issue._id }),
      Upvote.deleteMany({ issue: issue._id }),
      Issue.findByIdAndDelete(issue._id),
    ]);

    sendSuccess(res, null, 'Issue deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/issues/:id/upvote
 * @desc    Toggle upvote on an issue
 * @access  Private (Citizen)
 */
const toggleUpvote = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return sendError(res, 'Issue not found', 404);
    }

    // Check if already upvoted
    const existingUpvote = await Upvote.findOne({
      issue: issue._id,
      user: req.user._id,
    });

    if (existingUpvote) {
      // Remove upvote
      await Upvote.findByIdAndDelete(existingUpvote._id);
      issue.upvoteCount = Math.max(0, issue.upvoteCount - 1);
      await issue.save();

      sendSuccess(res, {
        upvoted: false,
        upvoteCount: issue.upvoteCount,
      }, 'Upvote removed');
    } else {
      // Add upvote
      await Upvote.create({
        issue: issue._id,
        user: req.user._id,
      });
      issue.upvoteCount += 1;
      await issue.save();

      sendSuccess(res, {
        upvoted: true,
        upvoteCount: issue.upvoteCount,
      }, 'Issue upvoted');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIssues,
  getMyIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  toggleUpvote,
};
