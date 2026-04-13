const express = require('express');
const router = express.Router();
const {
  getAllIssues,
  assignIssue,
  updateIssueStatus,
  getStats,
  getAdminUsers,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

router.get('/issues', getAllIssues);
router.get('/stats', getStats);
router.get('/users', getAdminUsers);
router.patch('/issues/:id/assign', assignIssue);
router.patch('/issues/:id/status', updateIssueStatus);

module.exports = router;
