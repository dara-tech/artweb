const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdultArvTreatment = sequelize.define('AdultArvTreatment', {
  clinicId: {
    type: DataTypes.INTEGER,
    field: 'ClinicID',
    primaryKey: true,
    allowNull: false
  },
  drugName: {
    type: DataTypes.STRING(15),
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
    field: 'DaStop',
    allowNull: true
  },
  note: {
    type: DataTypes.STRING(40),
    field: 'Note',
    allowNull: true
  }
}, {
  tableName: 'tblaiarvtreathis',
  timestamps: false
});

module.exports = AdultArvTreatment;
