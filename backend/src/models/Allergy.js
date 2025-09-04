const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Allergy = sequelize.define('Allergy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  allergyName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  allergyStatus: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'tblallergy',
  timestamps: false
});

module.exports = Allergy;
