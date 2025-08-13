const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users (with filtering and pagination)
// @route   GET /api/users
// @access  Private (Admin/SuperAdmin)
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const role = req.query.role;
    const search = req.query.search;

    // Build query
    let query = {};
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    // Get total count
    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin/SuperAdmin)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user (Admin/Seller only - created by SuperAdmin)
// @route   POST /api/users
// @access  Private (SuperAdmin)
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, role, userId, phone } = req.body;

    // Validate role
    if (!['admin', 'seller'].includes(role)) {
      return next(new ErrorResponse('Can only create admin or seller users', 400));
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { userId }]
    });

    if (existingUser) {
      return next(new ErrorResponse('User with this email or userId already exists', 400));
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

    // Create user
    const user = await User.create({
      name,
      email,
      password: tempPassword,
      role,
      userId: userId || generateUserId(name, role),
      phone,
      mustChangePassword: true, // Force password change on first login
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        tempPassword,
        mustChangePassword: user.mustChangePassword
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin/SuperAdmin)
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, phone, isActive, role, password } = req.body;

    // Find user
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    // Prevent role escalation (only superadmin can change roles)
    if (role && req.user.role !== 'superadmin') {
      return next(new ErrorResponse('Only super admin can change user roles', 403));
    }

    // Prevent superadmin from being modified by non-superadmin
    if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
      return next(new ErrorResponse('Cannot modify super admin account', 403));
    }

    // Prepare update data
    const updateData = { name, email, phone, isActive, role };
    
    // Handle password update if provided
    if (password) {
      // If updating password, clear the mustChangePassword flag
      updateData.password = password;
      updateData.mustChangePassword = false;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (SuperAdmin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    // Prevent superadmin deletion
    if (user.role === 'superadmin') {
      return next(new ErrorResponse('Cannot delete super admin account', 403));
    }

    // Soft delete - just deactivate
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset user password (Super Admin only)
// @route   PUT /api/users/:id/reset-password
// @access  Private (SuperAdmin only)
exports.resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return next(new ErrorResponse('Password must be at least 6 characters long', 400));
    }

    // Find user
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    // Prevent superadmin password reset by non-superadmin
    if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
      return next(new ErrorResponse('Cannot reset super admin password', 403));
    }

    // Update password and clear mustChangePassword flag
    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin/SuperAdmin)
exports.getUserStats = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          active: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          inactive: {
            $sum: { $cond: ['$isActive', 0, 1] }
          }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        newUsersThisMonth,
        byRole: stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to generate userId
function generateUserId(name, role) {
  const timestamp = Date.now().toString().slice(-4);
  const namePart = name.replace(/\s+/g, '').toLowerCase().slice(0, 3);
  return `${role.slice(0, 1)}${namePart}${timestamp}`;
}
