const express = require('express');
const router = express.Router();
const { getAllIssues, assignIssue, updateIssueStatus, getStats, getDepartments, getAdminUsers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.use(protect, authorize('admin'));

router.get('/issues', getAllIssues);
router.get('/stats', getStats);
router.get('/departments', getDepartments);
router.get('/users', getAdminUsers);
router.patch('/issues/:id/assign', assignIssue);
router.patch('/issues/:id/status', upload.array('proofImages', 3), updateIssueStatus);

module.exports = router;
