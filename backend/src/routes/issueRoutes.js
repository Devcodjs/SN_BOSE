const express = require('express');
const router = express.Router();
const { getIssues, getMyIssues, getIssue, createIssue, updateIssue, deleteIssue, toggleUpvote } = require('../controllers/issueController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const { apiLimiter, issueSubmissionLimiter } = require('../middleware/rateLimiter');
const { upload } = require('../config/cloudinary');

router.get('/', getIssues);
router.get('/my', protect, getMyIssues);
router.get('/:id', optionalAuth, getIssue);
router.post('/', protect, issueSubmissionLimiter, upload.array('images', 3), createIssue);
router.put('/:id', protect, upload.array('images', 3), updateIssue);
router.delete('/:id', protect, deleteIssue);
router.post('/:id/upvote', protect, toggleUpvote);

module.exports = router;
