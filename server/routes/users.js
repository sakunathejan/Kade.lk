const express = require('express');
const { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser, 
  resetUserPassword,
  getUserStats 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user stats (Admin/SuperAdmin)
router.get('/stats', authorize('admin', 'superadmin'), getUserStats);

// Get all users (Admin/SuperAdmin)
router.get('/', authorize('admin', 'superadmin'), getUsers);

// Create user (SuperAdmin only)
router.post('/', authorize('superadmin'), createUser);

// User management routes (Admin/SuperAdmin)
router.route('/:id')
  .get(authorize('admin', 'superadmin'), getUser)
  .put(authorize('admin', 'superadmin'), updateUser)
  .delete(authorize('superadmin'), deleteUser);

// Reset user password (SuperAdmin only)
router.put('/:id/reset-password', authorize('superadmin'), resetUserPassword);

module.exports = router;
