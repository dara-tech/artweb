const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VCCTSite = sequelize.define('VCCTSite', {
  vid: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false
  },
  siteName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  district: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'tblvcctsite',
  timestamps: false
});

module.exports = VCCTSite;
