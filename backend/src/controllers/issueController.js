const Issue = require('../models/Issue');
const User = require('../models/User');
const { validateIssue } = require('../validators/validators');
const { getPriorityLabel } = require('../config/priorityConfig');
const duplicateService = require('../services/duplicateDetectionService');
const priorityService = require('../services/priorityService');
const abuseService = require('../services/abuseDetectionService');
const { incrementTotalReports } = require('../services/trustScoreService');
const IssueUpdate = require('../models/StatusLog');
const Upvote = require('../models/Upvote');
const { cloudinary } = require('../config/cloudinary');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/issues
const getIssues = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.department) filter.department = req.query.department;
  if (req.query.search) filter.$text = { $search: req.query.search };

  let sort = { createdAt: -1 };
  if (req.query.sort === 'upvotes') sort = { upvoteCount: -1 };
  if (req.query.sort === 'oldest') sort = { createdAt: 1 };

  const [issues, total] = await Promise.all([
    Issue.find(filter)
      .populate('submittedBy', 'name avatar')
      .populate('department', 'name')
      .sort(sort).skip(skip).limit(limit).lean(),
    Issue.countDocuments(filter),
  ]);

  sendSuccess(res, {
    data: issues, count: issues.length,
    pagination: { page, limit, totalPages: Math.ceil(total / limit), totalItems: total },
  });
});

// GET /api/issues/my
const getMyIssues = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const filter = { submittedBy: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const [issues, total] = await Promise.all([
    Issue.find(filter).populate('department', 'name').sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(limit).lean(),
    Issue.countDocuments(filter),
  ]);

  sendSuccess(res, {
    data: issues, count: issues.length,
    pagination: { page, limit, totalPages: Math.ceil(total / limit), totalItems: total },
  });
});

// GET /api/issues/:id
const getIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id)
    .populate('submittedBy', 'name email avatar')
    .populate('assignedTo', 'name email')
    .populate('department', 'name headName contactEmail')
    .lean();
  if (!issue) return sendError(res, 'Issue not found', 404);

  const updates = await IssueUpdate.find({ issue: issue._id })
    .populate('updatedBy', 'name role').sort({ createdAt: 1 }).lean();

  let hasUpvoted = false;
  if (req.user) {
    hasUpvoted = !!(await Upvote.findOne({ issue: issue._id, user: req.user._id }));
  }

  sendSuccess(res, { ...issue, updates, hasUpvoted });
});

// POST /api/issues
const createIssue = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.identityVerified) {
    return sendError(res, 'Identity verification is required to report an issue', 403);
  }

  // 2. Validate input
  const errors = validateIssue(req.body);
  if (errors.length > 0) return sendError(res, errors[0], 400);

  const { title, description, category, priority, severity, address, latitude, longitude } = req.body;
  if (!latitude || !longitude) return sendError(res, 'Location coordinates are required', 400);

  const coords = [parseFloat(longitude), parseFloat(latitude)];
  if (isNaN(coords[0]) || isNaN(coords[1])) {
    return sendError(res, 'Invalid coordinates format', 400);
  }

  // 3. Abuse Detection
  const issueData = {
    title, description, category, severity: severity || 'Medium',
    location: { type: 'Point', coordinates: coords, address }
  };
  const isAbusive = await abuseService.analyzeSubmission(req.user._id, issueData);
  if (isAbusive) {
    return sendError(res, 'Submission blocked due to suspected abuse. Your account has been flagged for review.', 403);
  }

  // 4. Handle Images (Cloudinary)
  let images = [];
  let imagePublicIds = [];
  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      images.push(file.path);
      imagePublicIds.push(file.filename);
    });
  }

  // 5. Duplicate Detection
  const dupCheck = await duplicateService.findDuplicates(issueData);
  
  // 6. Build the Issue object
  const newIssue = new Issue({
    title,
    description,
    category,
    severity: severity || 'Medium',
    location: { type: 'Point', coordinates: coords, address },
    images,
    imagePublicIds,
    submittedBy: req.user._id,
  });

  // 7. Calculate Priority
  const priorityResult = priorityService.calculatePriorityScore(newIssue);
  newIssue.priorityScore = priorityResult.score;
  newIssue.priority = getPriorityLabel(priorityResult.score);
  newIssue.lastPriorityCalculation = new Date();

  // 8. Handle Duplicate Linkage
  if (dupCheck.isDuplicate) {
    const masterIssue = dupCheck.topMatch.issue;
    
    newIssue.isDuplicate = true;
    newIssue.duplicateOf = masterIssue._id;
    newIssue.duplicateScore = dupCheck.topMatch.score;
    newIssue.duplicateStatus = 'confirmed';
    
    // Add to master issue's supporting reports
    await Issue.findByIdAndUpdate(masterIssue._id, {
      $push: { supportingReports: newIssue._id },
      $inc: { corroborationCount: 1 }
    });

    // Recalculate priority of master issue based on new corroboration
    const updatedMaster = await Issue.findById(masterIssue._id);
    const updatedPriority = priorityService.calculatePriorityScore(updatedMaster);
    updatedMaster.priorityScore = updatedPriority.score;
    updatedMaster.priority = getPriorityLabel(updatedPriority.score);
    updatedMaster.lastPriorityCalculation = new Date();
    await updatedMaster.save();
  }

  // 9. Save and Log
  await newIssue.save();
  await incrementTotalReports(req.user._id);

  await IssueUpdate.create({
    issue: newIssue._id,
    updatedBy: req.user._id,
    fromStatus: null,
    toStatus: 'Pending',
    comment: dupCheck.isDuplicate ? `Issue created as duplicate of ${dupCheck.topMatch.issue._id}` : 'Issue reported initially',
    eventType: dupCheck.isDuplicate ? 'DUPLICATE_LINKED' : 'CREATED'
  });

  sendSuccess(res, newIssue, 'Issue reported successfully', 201);
});

// PUT /api/issues/:id
const updateIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return sendError(res, 'Issue not found', 404);
  if (issue.submittedBy.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized', 403);
  }
  if (issue.status !== 'Pending') {
    return sendError(res, 'Cannot edit issue that is already being processed', 400);
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
  if (req.files && req.files.length > 0) {
    for (const id of (issue.imagePublicIds || [])) {
      await cloudinary.uploader.destroy(id).catch(() => {});
    }
    issue.images = req.files.map(f => f.path);
    issue.imagePublicIds = req.files.map(f => f.filename);
  }

  await issue.save();
  sendSuccess(res, issue, 'Issue updated');
});

// DELETE /api/issues/:id
const deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return sendError(res, 'Issue not found', 404);
  const isOwner = issue.submittedBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return sendError(res, 'Not authorized', 403);
  }
  for (const id of (issue.imagePublicIds || [])) {
    await cloudinary.uploader.destroy(id).catch(() => {});
  }
  await Promise.all([
    IssueUpdate.deleteMany({ issue: issue._id }),
    Upvote.deleteMany({ issue: issue._id }),
    Issue.findByIdAndDelete(issue._id),
  ]);
  sendSuccess(res, null, 'Issue deleted');
});

// POST /api/issues/:id/upvote
const toggleUpvote = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return sendError(res, 'Issue not found', 404);

  const existing = await Upvote.findOne({ issue: issue._id, user: req.user._id });
  if (existing) {
    await Upvote.findByIdAndDelete(existing._id);
    issue.upvoteCount = Math.max(0, issue.upvoteCount - 1);
  } else {
    await Upvote.create({ issue: issue._id, user: req.user._id });
    issue.upvoteCount += 1;
  }
  await issue.save();

  sendSuccess(res, { upvoted: !existing, upvoteCount: issue.upvoteCount });
});

module.exports = { getIssues, getMyIssues, getIssue, createIssue, updateIssue, deleteIssue, toggleUpvote };
