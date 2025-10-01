const express = require('express');
const { User } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all available roles
router.get('/roles', authenticateToken, (req, res) => {
  const roles = [
    {
      value: 'super_admin',
      label: 'Super Administrator',
      description: 'Full system access, user management, all sites',
      permissions: ['all']
    },
    {
      value: 'admin',
      label: 'Administrator',
      description: 'Site management, user management for assigned sites',
      permissions: ['user_management', 'site_management', 'data_entry', 'reports']
    },
    {
      value: 'doctor',
      label: 'Doctor',
      description: 'Patient care, medical data entry, reports',
      permissions: ['patient_care', 'medical_data', 'reports', 'data_entry']
    },
    {
      value: 'nurse',
      label: 'Nurse',
      description: 'Patient care, basic data entry',
      permissions: ['patient_care', 'basic_data_entry']
    },
    {
      value: 'data_entry',
      label: 'Data Entry',
      description: 'Data entry only, no medical decisions',
      permissions: ['data_entry']
    },
    {
      value: 'viewer',
      label: 'Viewer',
      description: 'Read-only access to reports and data',
      permissions: ['view_reports', 'view_data']
    },
    {
      value: 'site_manager',
      label: 'Site Manager',
      description: 'Manage specific site operations',
      permissions: ['site_management', 'data_entry', 'reports']
    }
  ];

  res.json({
    success: true,
    roles
  });
});

// Get all users with their roles
router.get('/users', authenticateToken, requireRole(['super_admin', 'admin']), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'fullName', 'role', 'assignedSites', 'status'],
      order: [['username', 'ASC']]
    });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Update user role
router.put('/users/:userId/role', [
  authenticateToken,
  requireRole(['super_admin', 'admin']),
  body('role').isIn(['super_admin', 'admin', 'doctor', 'nurse', 'data_entry', 'viewer', 'site_manager']).withMessage('Invalid role'),
  body('assignedSites').optional().isArray().withMessage('Assigned sites must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const { role, assignedSites } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent non-super-admin from creating super-admin users
    if (req.user.role !== 'super_admin' && role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super administrators can create super administrator accounts'
      });
    }

    // Update user role and assigned sites
    await user.update({
      role,
      assignedSites: assignedSites || null
    });

    // Reload user to get updated data
    await user.reload();

    res.json({
      success: true,
      message: 'User role updated successfully',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        assignedSites: user.assignedSites
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
});

// Create new user with role
router.post('/users', [
  authenticateToken,
  requireRole(['super_admin', 'admin']),
  body('username').isLength({ min: 3, max: 40 }).withMessage('Username must be between 3 and 40 characters'),
  body('fullName').isLength({ min: 2, max: 40 }).withMessage('Full name must be between 2 and 40 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['super_admin', 'admin', 'doctor', 'nurse', 'data_entry', 'viewer', 'site_manager']).withMessage('Invalid role'),
  body('assignedSites').optional().isArray().withMessage('Assigned sites must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, fullName, password, role, assignedSites, status = 1 } = req.body;

    // Prevent non-super-admin from creating super-admin users
    if (req.user.role !== 'super_admin' && role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super administrators can create super administrator accounts'
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Create new user
    const newUser = await User.create({
      username,
      fullName,
      password,
      role,
      assignedSites: assignedSites || null,
      status
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        fullName: newUser.fullName,
        role: newUser.role,
        assignedSites: newUser.assignedSites,
        status: newUser.status
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
});

// Delete user (super admin only)
router.delete('/users/:userId', [
  authenticateToken,
  requireRole(['super_admin']),
  body('confirmDelete').equals('true').withMessage('Delete confirmation required')
], async (req, res) => {
  try {
    const { userId } = req.params;
    const { confirmDelete } = req.body;

    if (confirmDelete !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'Delete confirmation required'
      });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting self
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete user
    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// Change user password
router.put('/users/:userId/password', [
  authenticateToken,
  requireRole(['super_admin', 'admin']),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const { newPassword } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password
    await user.update({ password: newPassword });

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password',
      error: error.message
    });
  }
});

// Update user status (activate/deactivate)
router.put('/users/:userId/status', [
  authenticateToken,
  requireRole(['super_admin', 'admin']),
  body('status').isIn([0, 1]).withMessage('Status must be 0 (inactive) or 1 (active)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    const { status } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deactivating self
    if (user.id === req.user.id && status === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    // Update status
    await user.update({ status });

    res.json({
      success: true,
      message: `User ${status === 1 ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        assignedSites: user.assignedSites,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
});

// Get user permissions based on role
router.get('/permissions', authenticateToken, (req, res) => {
  const rolePermissions = {
    super_admin: ['all'],
    admin: ['user_management', 'site_management', 'data_entry', 'reports', 'patient_care'],
    doctor: ['patient_care', 'medical_data', 'reports', 'data_entry'],
    nurse: ['patient_care', 'basic_data_entry'],
    data_entry: ['data_entry'],
    viewer: ['view_reports', 'view_data'],
    site_manager: ['site_management', 'data_entry', 'reports', 'patient_care']
  };

  const userRole = req.user.role;
  const permissions = rolePermissions[userRole] || [];

  res.json({
    success: true,
    role: userRole,
    permissions,
    assignedSites: req.user.assignedSites
  });
});

module.exports = router;
