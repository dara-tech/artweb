const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PatientVisit = sequelize.define('PatientVisit', {
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
  visitDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  visitType: {
    type: DataTypes.ENUM('adult', 'child', 'infant'),
    allowNull: false
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  height: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  bloodPressure: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  temperature: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'tblvisit',
  timestamps: true
});

module.exports = PatientVisit;
