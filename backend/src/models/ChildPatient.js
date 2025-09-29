const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChildPatient = sequelize.define('ChildPatient', {
  clinicId: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
    field: 'ClinicID',
    references: {
      model: 'patients',
      key: 'clinicId'
    }
  },
  dateFirstVisit: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'DaFirstVisit'
  },
  lClinicId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'LClinicID'
  },
  siteNameOld: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'SiteNameold'
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'DaBirth'
  },
  sex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'Sex',
    validate: {
      isIn: [[0, 1]] // 0 = Female, 1 = Male
    }
  },
  referred: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'Referred'
  },
  otherReferred: {
    type: DataTypes.STRING(30),
    allowNull: true,
    field: 'Oreferred'
  },
  eClinicId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'EClinicID'
  },
  dateTest: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'DaTest'
  },
  typeTest: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'TypeTest'
  },
  vcctCode: {
    type: DataTypes.STRING(6),
    allowNull: true,
    field: 'Vcctcode'
  },
  vcctId: {
    type: DataTypes.STRING(6),
    allowNull: true,
    field: 'VcctID'
  },
  offIn: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'OffIn'
  },
  siteName: {
    type: DataTypes.STRING(4),
    allowNull: true,
    field: 'SiteName'
  },
  dateART: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'DaART'
  },
  artNumber: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'Artnum'
  },
  feeding: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'Feeding'
  },
  tbPast: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'TbPast'
  },
  typeTB: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'TypeTB'
  },
  resultTB: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'ResultTB'
  },
  dateOnset: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'Daonset'
  },
  tbTreat: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'Tbtreat'
  },
  dateTreat: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'Datreat'
  },
  resultTreat: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'ResultTreat'
  },
  dateResultTreat: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'DaResultTreat'
  },
  inh: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'Inh'
  },
  tptDrug: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'TPTdrug'
  },
  dateStartTPT: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'DaStartTPT'
  },
  dateEndTPT: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'DaEndTPT'
  },
  otherPast: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'OtherPast'
  },
  cotrim: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'Cotrim'
  },
  fluco: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'Fluco'
  },
  allergy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'Allergy'
  },
  clinicIdOld: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'ClinicIDold'
  },
  nationality: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'Nationality'
  },
  site_code: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'site_code'
  }
}, {
  tableName: 'tblcimain',
  timestamps: false
});

module.exports = ChildPatient;