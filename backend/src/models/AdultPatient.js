const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdultPatient = sequelize.define('AdultPatient', {
  clinicId: {
    type: DataTypes.INTEGER,
    field: 'ClinicID',
    primaryKey: true,
    allowNull: false
  },
  dateFirstVisit: {
    type: DataTypes.DATEONLY,
    field: 'DafirstVisit',
    allowNull: false
  },
  typeOfReturn: {
    type: DataTypes.INTEGER,
    field: 'TypeofReturn',
    allowNull: true
  },
  lClinicId: {
    type: DataTypes.STRING(6),
    field: 'LClinicID',
    allowNull: false,
    defaultValue: ''
  },
  siteNameOld: {
    type: DataTypes.STRING(4),
    field: 'SiteNameold',
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    field: 'DaBirth',
    allowNull: false
  },
  sex: {
    type: DataTypes.INTEGER,
    field: 'Sex',
    allowNull: false
  },
  education: {
    type: DataTypes.INTEGER,
    field: 'Education',
    allowNull: false
  },
  read: {
    type: DataTypes.INTEGER,
    field: 'Rea',
    allowNull: false
  },
  write: {
    type: DataTypes.INTEGER,
    field: 'Write',
    allowNull: false
  },
  referred: {
    type: DataTypes.INTEGER,
    field: 'Referred',
    allowNull: false
  },
  otherReferred: {
    type: DataTypes.STRING(20),
    field: 'Orefferred',
    allowNull: false,
    defaultValue: ''
  },
  dateHIV: {
    type: DataTypes.DATEONLY,
    field: 'DaHIV',
    allowNull: false
  },
  vcctCode: {
    type: DataTypes.STRING(6),
    field: 'Vcctcode',
    allowNull: false,
    defaultValue: ''
  },
  vcctId: {
    type: DataTypes.STRING(6),
    field: 'VcctID',
    allowNull: false,
    defaultValue: ''
  },
  pClinicId: {
    type: DataTypes.STRING(7),
    field: 'PclinicID',
    allowNull: false,
    defaultValue: ''
  },
  offIn: {
    type: DataTypes.INTEGER,
    field: 'OffIn',
    allowNull: false
  },
  siteName: {
    type: DataTypes.STRING(4),
    field: 'SiteName',
    allowNull: false,
    defaultValue: ''
  },
  dateART: {
    type: DataTypes.DATEONLY,
    field: 'DaART',
    allowNull: false
  },
  artNumber: {
    type: DataTypes.STRING(10),
    field: 'Artnum',
    allowNull: false,
    defaultValue: ''
  },
  tbPast: {
    type: DataTypes.INTEGER,
    field: 'TbPast',
    allowNull: false
  },
  tpt: {
    type: DataTypes.INTEGER,
    field: 'TPT',
    allowNull: false
  },
  tptDrug: {
    type: DataTypes.INTEGER,
    field: 'TPTdrug',
    allowNull: false
  },
  dateStartTPT: {
    type: DataTypes.DATEONLY,
    field: 'DaStartTPT',
    allowNull: true
  },
  dateEndTPT: {
    type: DataTypes.DATEONLY,
    field: 'DaEndTPT',
    allowNull: true
  },
  typeTB: {
    type: DataTypes.INTEGER,
    field: 'TypeTB',
    allowNull: false
  },
  resultTB: {
    type: DataTypes.INTEGER,
    field: 'ResultTB',
    allowNull: false
  },
  dateOnset: {
    type: DataTypes.DATEONLY,
    field: 'Daonset',
    allowNull: false
  },
  tbTreat: {
    type: DataTypes.INTEGER,
    field: 'Tbtreat',
    allowNull: false
  },
  dateTreat: {
    type: DataTypes.DATEONLY,
    field: 'Datreat',
    allowNull: false
  },
  resultTreat: {
    type: DataTypes.INTEGER,
    field: 'ResultTreat',
    allowNull: false
  },
  dateResultTreat: {
    type: DataTypes.DATEONLY,
    field: 'DaResultTreat',
    allowNull: false
  },
  arvTreatHis: {
    type: DataTypes.INTEGER,
    field: 'ARVTreatHis',
    allowNull: false
  },
  diabetes: {
    type: DataTypes.STRING(5),
    field: 'Diabete',
    allowNull: false,
    defaultValue: 'False'
  },
  hyper: {
    type: DataTypes.STRING(5),
    field: 'Hyper',
    allowNull: false,
    defaultValue: 'False'
  },
  abnormal: {
    type: DataTypes.STRING(5),
    field: 'Abnormal',
    allowNull: false,
    defaultValue: 'False'
  },
  renal: {
    type: DataTypes.STRING(5),
    field: 'Renal',
    allowNull: false,
    defaultValue: 'False'
  },
  anemia: {
    type: DataTypes.STRING(5),
    field: 'Anemia',
    allowNull: false,
    defaultValue: 'False'
  },
  liver: {
    type: DataTypes.STRING(5),
    field: 'Liver',
    allowNull: false,
    defaultValue: 'False'
  },
  hepBC: {
    type: DataTypes.STRING(5),
    field: 'HepBC',
    allowNull: false,
    defaultValue: 'False'
  },
  medOther: {
    type: DataTypes.STRING(5),
    field: 'MedOther',
    allowNull: false,
    defaultValue: 'False'
  },
  allergy: {
    type: DataTypes.INTEGER,
    field: 'Allergy',
    allowNull: false
  },
  nationality: {
    type: DataTypes.INTEGER,
    field: 'Nationality',
    allowNull: true
  },
  targetGroup: {
    type: DataTypes.INTEGER,
    field: 'Targroup',
    allowNull: true
  }
}, {
  tableName: 'tblaimain',
  timestamps: false
});

module.exports = AdultPatient;