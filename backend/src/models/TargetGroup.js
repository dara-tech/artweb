const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TargetGroup = sequelize.define('TargetGroup', {
  tid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  targetGroup: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  targetGroupKh: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'tbltargroup',
  timestamps: false
});

module.exports = TargetGroup;
