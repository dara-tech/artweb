const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access Denied',
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure they still exist and are active
    const user = await User.findOne({
      where: { id: decoded.userId },
      attributes: ['id', 'username', 'fullName', 'status', 'role', 'assignedSites']
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Access Denied',
        message: 'User not found' 
      });
    }

    if (user.status !== 1) {
      return res.status(401).json({ 
        error: 'Access Denied',
        message: 'User account is disabled' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid Token',
        message: 'Authentication token is invalid' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token Expired',
        message: 'Authentication token has expired' 
      });
    }
    next(error);
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Access Denied',
        message: 'Authentication required' 
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access Denied',
        message: `Insufficient permissions. Required roles: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

const requireSiteAccess = (siteCode) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Access Denied',
        message: 'Authentication required' 
      });
    }

    // Super admin can access all sites
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Check if user has access to the specific site
    const userSites = req.user.assignedSites;
    if (!userSites || userSites.length === 0) {
      // If no assigned sites, allow access to all (for backward compatibility)
      return next();
    }

    if (!userSites.includes(siteCode)) {
      return res.status(403).json({ 
        error: 'Access Denied',
        message: `You don't have access to site ${siteCode}` 
      });
    }

    next();
  };
};

module.exports = { authenticateToken, requireRole, requireSiteAccess };
