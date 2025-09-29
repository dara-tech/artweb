const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdultAllergy = sequelize.define('AdultAllergy', {
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
  allergy: {
    type: DataTypes.STRING(25),
    field: 'Allergy',
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    field: 'Da',
    allowNull: true
  }
}, {
  tableName: 'tblaiallergy',
  timestamps: false
});

module.exports = AdultAllergy;
