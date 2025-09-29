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
      attributes: ['id', 'username', 'fullName', 'status']
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

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Access Denied',
        message: 'Authentication required' 
      });
    }

    // For now, allow all authenticated users since role field doesn't exist in database
    // TODO: Implement proper role-based access control when role field is added
    next();
  };
};

module.exports = { authenticateToken, requireRole };
