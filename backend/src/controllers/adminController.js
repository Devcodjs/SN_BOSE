const Issue = require('../models/Issue');
const StatusLog = require('../models/StatusLog');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { validateStatusUpdate } = require('../validators/validators');

/**
 * @route   GET /api/admin/issues
 * @desc    Get all issues with advanced filters (admin view)
 * @access  Private (Admin)
 */
const getAllIssues = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

    // Date range filter
    if (req.query.fromDate || req.query.toDate) {
      filter.createdAt = {};
      if (req.query.fromDate) filter.createdAt.$gte = new Date(req.query.fromDate);
      if (req.query.toDate) filter.createdAt.$lte = new Date(req.query.toDate);
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Sort
    let sort = { createdAt: -1 };
    if (req.query.sort === 'upvotes') sort = { upvoteCount: -1 };
    if (req.query.sort === 'priority') {
      // Custom priority order: Critical > High > Medium > Low
      sort = { priority: -1, createdAt: -1 };
    }

    const [issues, total] = await Promise.all([
      Issue.find(filter)
        .populate('reportedBy', 'name email phone')
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
 * @route   PATCH /api/admin/issues/:id/assign
 * @desc    Assign an issue to an admin user
 * @access  Private (Admin)
 */
const assignIssue = async (req, res, next) => {
  try {
    const { assignedTo, note } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return sendError(res, 'Issue not found', 404);
    }

    // Validate assignee exists and is admin
    if (assignedTo) {
      const assignee = await User.findById(assignedTo);
      if (!assignee) {
        return sendError(res, 'Assigned user not found', 404);
      }
    }

    const previousStatus = issue.status;
    issue.assignedTo = assignedTo || req.user._id;
    issue.status = 'In Progress';
    await issue.save();

    // Create status log
    await StatusLog.create({
      issue: issue._id,
      fromStatus: previousStatus,
      toStatus: 'In Progress',
      changedBy: req.user._id,
      note: note || 'Issue assigned',
    });

    const updatedIssue = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .lean();

    sendSuccess(res, updatedIssue, 'Issue assigned successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/admin/issues/:id/status
 * @desc    Update issue status
 * @access  Private (Admin)
 */
const updateIssueStatus = async (req, res, next) => {
  try {
    const errors = validateStatusUpdate(req.body);
    if (errors.length > 0) {
      return sendError(res, 'Validation failed', 400, errors);
    }

    const { status, note } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return sendError(res, 'Issue not found', 404);
    }

    const previousStatus = issue.status;

    // Prevent re-setting same status
    if (previousStatus === status) {
      return sendError(res, `Issue is already '${status}'`, 400);
    }

    issue.status = status;

    // Set resolvedAt timestamp when resolved
    if (status === 'Resolved') {
      issue.resolvedAt = new Date();
    } else {
      issue.resolvedAt = undefined;
    }

    await issue.save();

    // Create status log
    await StatusLog.create({
      issue: issue._id,
      fromStatus: previousStatus,
      toStatus: status,
      changedBy: req.user._id,
      note: note || `Status changed to ${status}`,
    });

    const updatedIssue = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .lean();

    sendSuccess(res, updatedIssue, `Issue status updated to '${status}'`);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/stats
 * @desc    Get quick stats for admin dashboard
 * @access  Private (Admin)
 */
const getStats = async (req, res, next) => {
  try {
    const [total, pending, inProgress, resolved, rejected] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: 'Pending' }),
      Issue.countDocuments({ status: 'In Progress' }),
      Issue.countDocuments({ status: 'Resolved' }),
      Issue.countDocuments({ status: 'Rejected' }),
    ]);

    // Average resolution time (in hours)
    const avgResolutionResult = await Issue.aggregate([
      { $match: { status: 'Resolved', resolvedAt: { $exists: true } } },
      {
        $project: {
          resolutionTimeMs: { $subtract: ['$resolvedAt', '$createdAt'] },
        },
      },
      {
        $group: {
          _id: null,
          avgTimeMs: { $avg: '$resolutionTimeMs' },
        },
      },
    ]);

    const avgResolutionHours = avgResolutionResult.length > 0
      ? Math.round(avgResolutionResult[0].avgTimeMs / (1000 * 60 * 60) * 10) / 10
      : 0;

    sendSuccess(res, {
      total,
      pending,
      inProgress,
      resolved,
      rejected,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      avgResolutionHours,
    }, 'Admin stats retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get admin users (for assignment dropdown)
 * @access  Private (Admin)
 */
const getAdminUsers = async (req, res, next) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('name email').lean();
    sendSuccess(res, admins);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllIssues,
  assignIssue,
  updateIssueStatus,
  getStats,
  getAdminUsers,
};
