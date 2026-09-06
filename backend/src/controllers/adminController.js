const Issue = require('../models/Issue');
const IssueUpdate = require('../models/StatusLog');
const User = require('../models/User');
const Department = require('../models/Department');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { dispenseAllRewards } = require('../services/rewardService');

// GET /api/admin/issues
const getAllIssues = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.department) filter.department = req.query.department;
  if (req.query.search) filter.$text = { $search: req.query.search };
  if (req.query.isDuplicate !== undefined) filter.isDuplicate = req.query.isDuplicate === 'true';

  if (req.query.fromDate || req.query.toDate) {
    filter.createdAt = {};
    if (req.query.fromDate) filter.createdAt.$gte = new Date(req.query.fromDate);
    if (req.query.toDate) filter.createdAt.$lte = new Date(req.query.toDate);
  }

  let sort = { createdAt: -1 };
  if (req.query.sort === 'upvotes') sort = { upvoteCount: -1 };
  if (req.query.sort === 'priority') sort = { priorityScore: -1 };

  const [issues, total] = await Promise.all([
    Issue.find(filter)
      .populate('submittedBy', 'name email phone')
      .populate('assignedTo', 'name email')
      .populate('department', 'name')
      // Was `.populate('originalIssue', ...)` — that field doesn't exist on
      // the schema (the real field is `duplicateOf`), so Mongoose's
      // strictPopulate threw on every single call to this endpoint,
      // meaning the "All Issues" admin tab has been 500ing since day one.
      .populate('duplicateOf', 'title')
      .sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Issue.countDocuments(filter),
  ]);

  sendSuccess(res, {
    data: issues, count: issues.length,
    pagination: { page, limit, totalPages: Math.ceil(total / limit), totalItems: total },
  });
});

// PATCH /api/admin/issues/:id/assign
const assignIssue = asyncHandler(async (req, res) => {
  const { departmentId, assignedTo, comment } = req.body;
  const issue = await Issue.findById(req.params.id);
  if (!issue) return sendError(res, 'Issue not found', 404);

  if (departmentId) {
    const dept = await Department.findById(departmentId);
    if (!dept) return sendError(res, 'Department not found', 404);
    issue.department = dept._id;
  }

  const prev = issue.status;
  issue.assignedTo = assignedTo || req.user._id;
  issue.status = 'In Progress';
  await issue.save();

  await IssueUpdate.create({
    issue: issue._id, updatedBy: req.user._id,
    fromStatus: prev, toStatus: 'In Progress',
    comment: comment || 'Issue assigned to department',
  });

  const updated = await Issue.findById(issue._id)
    .populate('submittedBy', 'name').populate('assignedTo', 'name').populate('department', 'name').lean();
  sendSuccess(res, updated, 'Issue assigned');
});

// PATCH /api/admin/issues/:id/status
const updateIssueStatus = asyncHandler(async (req, res) => {
  const { status, comment } = req.body;
  if (!status) return sendError(res, 'Status is required', 400);

  const issue = await Issue.findById(req.params.id);
  if (!issue) return sendError(res, 'Issue not found', 404);
  if (issue.status === status) return sendError(res, `Already '${status}'`, 400);

  const prev = issue.status;
  issue.status = status;

  // Handle proof images from municipality
  if (req.files && req.files.length > 0) {
    issue.proofImages = req.files.map(f => f.path);
  } else if (req.file) {
    issue.proofImages = [req.file.path];
  }

  if (status === 'Resolved') {
    issue.resolvedAt = new Date();
  } else {
    issue.resolvedAt = undefined;
  }
  await issue.save();

  // Cascade the same status to any reports that were auto-linked to this
  // one as duplicates (duplicateDetectionService links them, but nothing
  // was closing them out afterwards — so a resolved/rejected master left
  // every duplicate report sitting as "Pending" forever, permanently
  // inflating the Pending count even though the underlying problem was
  // already handled).
  if ((status === 'Resolved' || status === 'Rejected') && issue.supportingReports?.length > 0) {
    await Issue.updateMany(
      { _id: { $in: issue.supportingReports } },
      {
        $set: {
          status,
          ...(status === 'Resolved' ? { resolvedAt: new Date() } : { resolvedAt: undefined }),
        },
      }
    );
    await IssueUpdate.insertMany(
      issue.supportingReports.map(dupId => ({
        issue: dupId,
        updatedBy: req.user._id,
        fromStatus: 'Pending',
        toStatus: status,
        comment: `Auto-${status.toLowerCase()} — linked as a duplicate of "${issue.title}"`,
      }))
    );
  }

  const proofImage = (req.files && req.files[0]?.path) || (req.file?.path) || undefined;
  await IssueUpdate.create({
    issue: issue._id, updatedBy: req.user._id,
    fromStatus: prev, toStatus: status,
    comment: comment || `Status changed to ${status}`,
    proofImage,
  });

  // Trigger reward engine on resolution (only if not a duplicate)
  if (status === 'Resolved' && prev !== 'Resolved' && !issue.isDuplicate) {
    try {
      const citizen = await User.findById(issue.submittedBy);
      if (citizen) {
        await dispenseAllRewards(citizen, issue);
      }
    } catch (e) {
      console.error('Reward dispensation error:', e.message);
    }
  }

  const updated = await Issue.findById(issue._id)
    .populate('submittedBy', 'name').populate('assignedTo', 'name').populate('department', 'name').lean();
  sendSuccess(res, updated, `Status updated to '${status}'`);
});

// GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const [total, pending, inProgress, resolved, rejected] = await Promise.all([
    Issue.countDocuments(),
    Issue.countDocuments({ status: 'Pending' }),
    Issue.countDocuments({ status: 'In Progress' }),
    Issue.countDocuments({ status: 'Resolved' }),
    Issue.countDocuments({ status: 'Rejected' }),
  ]);

  const avgRes = await Issue.aggregate([
    { $match: { status: 'Resolved', resolvedAt: { $exists: true } } },
    { $project: { ms: { $subtract: ['$resolvedAt', '$createdAt'] } } },
    { $group: { _id: null, avg: { $avg: '$ms' } } },
  ]);

  const avgResolutionHours = avgRes.length > 0 ? Math.round(avgRes[0].avg / 3600000 * 10) / 10 : 0;

  // Week-over-week comparison
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const [thisWeek, lastWeek] = await Promise.all([
    Issue.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
    Issue.countDocuments({ createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo } }),
  ]);

  sendSuccess(res, {
    total, pending, inProgress, resolved, rejected,
    resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    avgResolutionHours,
    thisWeekCount: thisWeek,
    lastWeekCount: lastWeek,
    weekTrend: lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0,
  });
});

// GET /api/admin/departments
const getDepartments = asyncHandler(async (req, res) => {
  const depts = await Department.find().lean();
  sendSuccess(res, depts);
});

// GET /api/admin/users
const getAdminUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  const users = await User.find(filter).select('name email role department rewards').populate('department', 'name').lean();
  sendSuccess(res, users);
});

module.exports = { getAllIssues, assignIssue, updateIssueStatus, getStats, getDepartments, getAdminUsers };