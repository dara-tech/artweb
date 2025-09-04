const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    field: 'Uid',
    primaryKey: true,
    autoIncrement: true
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
    type: DataTypes.CHAR(40),
    field: 'Pass',
    allowNull: false,
    validate: {
      len: [6, 40]
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
  }
}, {
  tableName: 'tbluser',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Instance methods
User.prototype.validatePassword = async function(password) {
  // For now, use simple string comparison since existing passwords are plain text
  // TODO: Implement proper password hashing for new users
  return password === this.password;
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;
