const express = require('express');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get all users
router.get('/', requireRole(['admin']), async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'fullName', 'status'],
      order: [['username', 'ASC']]
    });

    res.json({ users });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'fullName', 'status']
    });

    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: `User with ID ${id} not found`
      });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Create new user
router.post('/', [
  requireRole(['admin']),
  body('username').isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),
  // body('role').isIn(['admin', 'doctor', 'nurse', 'clerk']).withMessage('Invalid role') // Role field not available in current database
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { username, password, fullName } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({
        error: 'Username Exists',
        message: 'Username already exists'
      });
    }

    const user = await User.create({
      username,
      password,
      fullName
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        status: user.status
      }
    });

  } catch (error) {
    next(error);
  }
});

// Update user
router.put('/:id', [
  requireRole(['admin']),
  body('fullName').optional().isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),
  // body('role').optional().isIn(['admin', 'doctor', 'nurse', 'clerk']).withMessage('Invalid role'), // Role field not available in current database
  body('status').optional().isIn([0, 1]).withMessage('Status must be 0 or 1')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: `User with ID ${id} not found`
      });
    }

    await user.update(updateData);

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        status: user.status
      }
    });

  } catch (error) {
    next(error);
  }
});

// Delete user (disable)
router.delete('/:id', requireRole(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: `User with ID ${id} not found`
      });
    }

    // Don't allow deleting own account
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        error: 'Cannot Delete Self',
        message: 'You cannot delete your own account'
      });
    }

    await user.update({ status: 0 });

    res.json({
      message: 'User disabled successfully'
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
