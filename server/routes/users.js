const express = require('express');
const { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser, 
  deactivateUser,
  activateUser,
  hardDeleteUser,
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

// Reset user password (SuperAdmin only)
router.put('/:id/reset-password', authorize('superadmin'), resetUserPassword);

// Activate user (SuperAdmin only)
router.put('/:id/activate', authorize('superadmin'), (req, res, next) => {
  console.log('🔍 Route: Activate route hit for ID:', req.params.id);
  next();
}, activateUser);

// Deactivate user (SuperAdmin only)
router.put('/:id/deactivate', authorize('superadmin'), (req, res, next) => {
  console.log('🔍 Route: Deactivate route hit for ID:', req.params.id);
  next();
}, deactivateUser);

// Hard delete user (SuperAdmin only)
router.delete('/:id/hard-delete', authorize('superadmin'), hardDeleteUser);

// User management routes (Admin/SuperAdmin) - must be last to avoid conflicts
router.route('/:id')
  .get(authorize('admin', 'superadmin'), getUser)
  .put(authorize('admin', 'superadmin'), updateUser)
  .delete(authorize('superadmin'), deleteUser);

module.exports = router;
