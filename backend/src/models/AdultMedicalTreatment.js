const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdultMedicalTreatment = sequelize.define('AdultMedicalTreatment', {
  clinicId: {
    type: DataTypes.INTEGER,
    field: 'ClinicID',
    primaryKey: true,
    allowNull: false
  },
  drugName: {
    type: DataTypes.STRING(10),
    field: 'DrugName',
    allowNull: false
  },
  clinic: {
    type: DataTypes.STRING(20),
    field: 'Clinic',
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATEONLY,
    field: 'DaStart',
    allowNull: true
  },
  stopDate: {
    type: DataTypes.DATEONLY,
    field: 'Dastop',
    allowNull: true
  },
  note: {
    type: DataTypes.STRING(40),
    field: 'Note',
    allowNull: true
  }
}, {
  tableName: 'tblaiothmeddiabete', // This will be dynamic based on condition
  timestamps: false
});

module.exports = AdultMedicalTreatment;
