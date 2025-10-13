const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, Log } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Login endpoint
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required')
], async (req, res, next) => {
  const startTime = Date.now();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { username, password } = req.body;

    // Normalize username (trim whitespace)
    const normalizedUsername = username.trim();

    // Find user by username with case-insensitive search using MySQL LOWER function
    const user = await User.findOne({
      where: require('sequelize').literal(`LOWER(TRIM(User)) = LOWER('${normalizedUsername}')`),
      attributes: ['id', 'username', 'password', 'fullName', 'status', 'role', 'assignedSites'] // Include role and assignedSites
    });

    if (!user) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid username or password'
      });
    }

    // Check if user is active
    if (user.status !== 1) {
      return res.status(401).json({
        error: 'Account Disabled',
        message: 'Your account has been disabled. Please contact administrator.'
      });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid username or password'
      });
    }

    // Note: lastLogin field not available in current database schema

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role || 'viewer', // Use actual role from database
        assignedSites: user.assignedSites
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const responseTime = Date.now() - startTime;
    console.log(`Login successful for user ${username} - Response time: ${responseTime}ms`);
    
    // Update login tracking fields
    try {
      const now = new Date();
      const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                      (req.connection.socket ? req.connection.socket.remoteAddress : null) || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';
      
      await user.update({ 
        lastLogin: now,
        lastActivity: now,
        loginCount: (user.loginCount || 0) + 1,
        lastIP: clientIP,
        userAgent: userAgent
      });
    } catch (updateError) {
      console.error('Error updating login tracking:', updateError);
      // Don't fail the login if update fails
    }
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role || 'viewer', // Use actual role from database
        assignedSites: user.assignedSites,
        status: user.status
      }
    });

  } catch (error) {
    next(error);
  }
});

// Verify token and get user info
router.get('/verify', authenticateToken, async (req, res, next) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    next(error);
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    next(error);
  }
});

// Change password
router.post('/change-password', [
  authenticateToken,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    // Validate current password
    const isValidPassword = await user.validatePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid Password',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    await user.update({ password: newPassword });

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    next(error);
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    message: 'Logout successful'
  });
});

module.exports = router;
