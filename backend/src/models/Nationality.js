const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Nationality = sequelize.define('Nationality', {
  nid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nationality: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'tblnationality',
  timestamps: false
});

module.exports = Nationality;
