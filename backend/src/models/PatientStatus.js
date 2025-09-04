const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PatientStatus = sequelize.define('PatientStatus', {
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
  status: {
    type: DataTypes.ENUM('active', 'lost', 'transferred', 'died', 'stopped'),
    allowNull: false
  },
  statusDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'tblstatus',
  timestamps: true
});

module.exports = PatientStatus;
