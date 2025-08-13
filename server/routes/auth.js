const express = require('express');
const { 
  register, 
  login, 
  logout, 
  getMe, 
  forgotPassword, 
  resetPassword, 
  updateDetails, 
  updatePassword,
  setupSuperAdmin 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/setup-superadmin', setupSuperAdmin); // One-time setup
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

// Protected routes
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
