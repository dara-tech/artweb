const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PatientTest = sequelize.define('PatientTest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clinicId: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'tblpatient',
      key: 'clinicId'
    }
  },
  testDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  testType: {
    type: DataTypes.ENUM('hiv', 'cd4', 'viral_load', 'tb', 'other'),
    allowNull: false
  },
  result: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  labId: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'tbltest',
  timestamps: true
});

module.exports = PatientTest;
