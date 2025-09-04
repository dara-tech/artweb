const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Drug = sequelize.define('Drug', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  drugName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  drugType: {
    type: DataTypes.ENUM('arv', 'tb', 'other'),
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'tbldrug',
  timestamps: false
});

module.exports = Drug;
