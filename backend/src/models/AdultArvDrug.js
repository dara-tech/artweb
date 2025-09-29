const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdultArvDrug = sequelize.define('AdultArvDrug', {
  visitId: {
    type: DataTypes.DOUBLE,
    field: 'Vid',
    primaryKey: true,
    allowNull: false
  },
  drugName: {
    type: DataTypes.STRING(16),
    field: 'DrugName',
    allowNull: false
  },
  dose: {
    type: DataTypes.STRING(20),
    field: 'Dose',
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    field: 'Quantity',
    allowNull: false
  },
  frequency: {
    type: DataTypes.STRING(5),
    field: 'Freq',
    allowNull: false
  },
  form: {
    type: DataTypes.STRING(15),
    field: 'Form',
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    field: 'Status',
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    field: 'Da',
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING(40),
    field: 'Reason',
    allowNull: false
  },
  remarks: {
    type: DataTypes.STRING(6),
    field: 'Remark',
    allowNull: false
  }
}, {
  tableName: 'tblavarvdrug',
  timestamps: false
});

module.exports = AdultArvDrug;
