const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reason = sequelize.define('Reason', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reasonName: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'tblreason',
  timestamps: false
});

module.exports = Reason;
