const express = require('express');
const { User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get user activity logs (from user login data only)
router.get('/user-logs', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      userId, 
      action,
      startDate, 
      endDate,
      search 
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Build where conditions for users
    const userWhereConditions = {};
    
    if (userId && userId !== 'all') {
      userWhereConditions.id = userId;
    }
    
    if (startDate && endDate) {
      userWhereConditions.lastLogin = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Get users with pagination
    const { count, rows: users } = await User.findAndCountAll({
      where: userWhereConditions,
      attributes: ['id', 'username', 'fullName', 'role', 'status', 'lastLogin', 'lastActivity', 'loginCount', 'lastIP', 'userAgent', 'createdAt'],
      order: [['lastLogin', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Filter users based on action
    let filteredUsers = users;
    if (action && action !== 'all') {
      if (action === 'login') {
        filteredUsers = users.filter(user => user.lastLogin);
      } else if (action === 'never_logged_in') {
        filteredUsers = users.filter(user => !user.lastLogin);
      }
    }

    // Transform users into log format
    const logs = filteredUsers.map(user => ({
      id: `login_${user.id}`,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      },
      action: user.lastLogin ? 'login' : 'never_logged_in',
      timestamp: user.lastLogin || user.createdAt,
      ipAddress: user.lastIP || '-',
      userAgent: user.userAgent || null,
      loginCount: user.loginCount || 0,
      lastActivity: user.lastActivity,
      status: user.status
    }));

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        },
        filters: {
          actions: ['login', 'never_logged_in']
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user logs'
    });
  }
});

// Get user login statistics
router.get('/user-logs/stats', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereConditions = {};
    
    if (startDate && endDate) {
      whereConditions.lastLogin = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Get login statistics by date
    const loginStats = await User.findAll({
      where: {
        ...whereConditions,
        lastLogin: { [Op.ne]: null }
      },
      attributes: [
        [User.sequelize.fn('DATE', User.sequelize.col('lastLogin')), 'date'],
        [User.sequelize.fn('COUNT', User.sequelize.col('Uid')), 'count']
      ],
      group: [User.sequelize.fn('DATE', User.sequelize.col('lastLogin'))],
      order: [[User.sequelize.fn('DATE', User.sequelize.col('lastLogin')), 'DESC']],
      limit: 30
    });

    // Get most active users (by lastLogin)
    const activeUsers = await User.findAll({
      where: {
        ...whereConditions,
        lastLogin: { [Op.ne]: null }
      },
      attributes: [
        'Uid',
        'User',
        'Fullname',
        'Role',
        'lastLogin',
        [User.sequelize.literal('1'), 'loginCount'] // Since we only track last login, count as 1
      ],
      order: [['lastLogin', 'DESC']],
      limit: 10
    });

    // Transform activeUsers to match expected format
    const transformedActiveUsers = activeUsers.map(user => ({
      user: {
        id: user.Uid,
        username: user.User,
        fullName: user.Fullname,
        role: user.Role
      },
      loginCount: user.loginCount
    }));

    res.json({
      success: true,
      data: {
        loginStats,
        activeUsers: transformedActiveUsers
      }
    });

  } catch (error) {
    console.error('Error fetching user log stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user log statistics'
    });
  }
});

module.exports = { router };
