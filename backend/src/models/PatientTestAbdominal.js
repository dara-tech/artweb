const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PatientTestAbdominal = sequelize.define('PatientTestAbdominal', {
    TestID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Test ID (ClinicID + Date format)'
    },
    Abdo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Abdominal code'
    },
    Abdo1: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Abdominal sub-code'
    },
    Abdo2: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Abdominal additional details'
    }
  }, {
    tableName: 'tblpatienttestAbdominal',
    timestamps: false,
    indexes: [
      {
        fields: ['TestID']
      }
    ]
  });

module.exports = PatientTestAbdominal;
