const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PatientTestCXR = sequelize.define('PatientTestCXR', {
    TestID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Test ID (ClinicID + Date format)'
    },
    CXR: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'CXR code'
    },
    CXR1: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'CXR sub-code'
    },
    CXR2: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'CXR additional details'
    }
  }, {
    tableName: 'tblpatientTestCXR',
    timestamps: false,
    indexes: [
      {
        fields: ['TestID']
      }
    ]
  });

module.exports = PatientTestCXR;
