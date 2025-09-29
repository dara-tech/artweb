const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChildVisit = sequelize.define('ChildVisit', {
  clinicId: {
    type: DataTypes.STRING(10),
    allowNull: false,
    primaryKey: true
  },
  artNumber: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  visitDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  schedule: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sex: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  temperature: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true
  },
  pulse: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  respiration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bloodPressure1: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bloodPressure2: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  height: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  bsa: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  malnutrition: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  wh: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ptb: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  wlost: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cough: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fever: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  enlarg: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  hospital: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  missed: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  m3: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  m3Text: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  function: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  whoStage: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  eligible: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  treatFail: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  typeFail: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tb: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  resultTB: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tbTreat: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tbDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  cd4: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  testDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  testARV: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  resultTest: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cd4Status: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  hivViral: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  grAG: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  resultCrAG: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  viralDetect: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  refer: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  visitId: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'tblcvmain',
  timestamps: false
});

module.exports = ChildVisit;
