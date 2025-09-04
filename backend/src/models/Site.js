const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Site = sequelize.define('Site', {
  sid: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false
  },
  siteName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'tblartsite',
  timestamps: false
});

module.exports = Site;
