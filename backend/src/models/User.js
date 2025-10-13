const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    field: 'Uid',
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(40),
    field: 'User',
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 40]
    }
  },
  password: {
    type: DataTypes.STRING(255),
    field: 'Pass',
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  fullName: {
    type: DataTypes.STRING(40),
    field: 'Fullname',
    allowNull: false,
    validate: {
      len: [2, 40]
    }
  },
  status: {
    type: DataTypes.INTEGER,
    field: 'Status',
    allowNull: false,
    defaultValue: 1,
    validate: {
      isIn: [[0, 1]] // 0 = disabled, 1 = active
    }
  },
  role: {
    type: DataTypes.ENUM('super_admin', 'admin', 'doctor', 'nurse', 'data_entry', 'viewer', 'site_manager', 'data_manager'),
    field: 'Role',
    allowNull: false,
    defaultValue: 'viewer',
    validate: {
      isIn: [['super_admin', 'admin', 'doctor', 'nurse', 'data_entry', 'viewer', 'site_manager', 'data_manager']]
    }
  },
  assignedSites: {
    type: DataTypes.JSON,
    field: 'AssignedSites',
    allowNull: true,
    defaultValue: null,
    comment: 'JSON array of site codes this user can access'
  },
  lastLogin: {
    type: DataTypes.DATE,
    field: 'lastLogin',
    allowNull: true,
    defaultValue: null,
    comment: 'Last login timestamp'
  },
  lastActivity: {
    type: DataTypes.DATE,
    field: 'lastActivity',
    allowNull: true,
    defaultValue: null,
    comment: 'Last activity timestamp'
  },
  loginCount: {
    type: DataTypes.INTEGER,
    field: 'loginCount',
    allowNull: false,
    defaultValue: 0,
    comment: 'Total login count'
  },
  lastIP: {
    type: DataTypes.STRING(45),
    field: 'lastIP',
    allowNull: true,
    defaultValue: null,
    comment: 'Last login IP address'
  },
  userAgent: {
    type: DataTypes.TEXT,
    field: 'userAgent',
    allowNull: true,
    defaultValue: null,
    comment: 'Last user agent string'
  }
}, {
  tableName: 'tbluser',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10); // Reduced from 12 to 10 for better performance
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10); // Reduced from 12 to 10 for better performance
      }
    }
  }
});

// Instance methods
User.prototype.validatePassword = async function(password) {
  // Check if password exists
  if (!this.password) {
    return false;
  }
  
  // Check if password is hashed (starts with $2a$ or $2b$)
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return await bcrypt.compare(password, this.password);
  }
  // For legacy plain text passwords
  return password === this.password;
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;
