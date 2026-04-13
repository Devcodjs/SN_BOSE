const express = require('express');
const router = express.Router();
const {
  getIssues,
  getMyIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  toggleUpvote,
} = require('../controllers/issueController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getIssues);
router.get('/:id', getIssue);

// Protected routes (any authenticated user)
router.get('/my/issues', protect, getMyIssues);

// Citizen routes
router.post('/', protect, authorize('citizen'), upload.single('image'), createIssue);
router.put('/:id', protect, authorize('citizen'), upload.single('image'), updateIssue);
router.delete('/:id', protect, deleteIssue);

// Upvote
router.post('/:id/upvote', protect, toggleUpvote);

module.exports = router;
