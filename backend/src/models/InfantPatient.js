const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InfantPatient = sequelize.define('InfantPatient', {
  clinicId: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'tblpatient',
      key: 'clinicId'
    }
  },
  dateFirstVisit: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  typeOfReturn: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  lClinicId: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  siteNameOld: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  sex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[0, 1]] // 0 = Female, 1 = Male
    }
  },
  education: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  read: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  write: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  referred: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  otherReferred: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  dateHIV: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: '1900-01-01'
  },
  vcctCode: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  vcctId: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  pClinicId: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  offIn: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  siteName: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  dateART: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: '1900-01-01'
  },
  artNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  tbPast: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  tpt: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  tptDrug: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  dateStartTPT: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: '1900-01-01'
  },
  dateEndTPT: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: '1900-01-01'
  },
  typeTB: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  resultTB: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  dateOnset: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: '1900-01-01'
  },
  tbTreat: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  dateTreat: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: '1900-01-01'
  },
  resultTreat: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  dateResultTreat: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: '1900-01-01'
  },
  arvTreatHis: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  diabetes: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  hyper: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  abnormal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  renal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  anemia: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  liver: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  hepBC: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  medOther: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  allergy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  nationality: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  targetGroup: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  refugStatus: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  refugART: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  refugSite: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  tableName: 'tbleimain',
  timestamps: false
});

module.exports = InfantPatient;
