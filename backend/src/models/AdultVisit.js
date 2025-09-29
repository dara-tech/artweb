const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdultVisit = sequelize.define('AdultVisit', {
  clinicId: {
    type: DataTypes.INTEGER,
    field: 'ClinicID',
    allowNull: false,
    primaryKey: true
  },
  artNumber: {
    type: DataTypes.STRING(10),
    field: 'ARTnum',
    allowNull: false
  },
  visitDate: {
    type: DataTypes.DATEONLY,
    field: 'DatVisit',
    allowNull: false
  },
  visitStatus: {
    type: DataTypes.INTEGER,
    field: 'TypeVisit',
    allowNull: false
  },
  pregnantStatus: {
    type: DataTypes.INTEGER,
    field: 'PregStatus',
    allowNull: false
  },
  typePregnant: {
    type: DataTypes.INTEGER,
    field: 'Womenstatus',
    allowNull: false
  },
  pregnantDate: {
    type: DataTypes.DATEONLY,
    field: 'DaPreg',
    allowNull: false
  },
  ancStatus: {
    type: DataTypes.INTEGER,
    field: 'ANCservice',
    allowNull: true
  },
  weight: {
    type: DataTypes.FLOAT,
    field: 'Weight',
    allowNull: false
  },
  height: {
    type: DataTypes.FLOAT,
    field: 'Height',
    allowNull: false
  },
  temperature: {
    type: DataTypes.FLOAT,
    field: 'Temp',
    allowNull: false
  },
  pulse: {
    type: DataTypes.INTEGER,
    field: 'Pulse',
    allowNull: false
  },
  respiration: {
    type: DataTypes.INTEGER,
    field: 'Resp',
    allowNull: false
  },
  bloodPressure: {
    type: DataTypes.STRING(7),
    field: 'Blood',
    allowNull: false
  },
  prevention: {
    type: DataTypes.STRING(6),
    field: 'STIPreven',
    allowNull: false
  },
  adherence: {
    type: DataTypes.STRING(6),
    field: 'ARTAdher',
    allowNull: false
  },
  spacing: {
    type: DataTypes.STRING(6),
    field: 'Birthspac',
    allowNull: false
  },
  tbInfect: {
    type: DataTypes.STRING(6),
    field: 'TBinfect',
    allowNull: false
  },
  partner: {
    type: DataTypes.STRING(6),
    field: 'Partner',
    allowNull: false
  },
  condom: {
    type: DataTypes.STRING(6),
    field: 'Condoms',
    allowNull: false
  },
  typeClient: {
    type: DataTypes.INTEGER,
    field: 'CMTypeClient',
    allowNull: false
  },
  useDate: {
    type: DataTypes.DATEONLY,
    field: 'CMDaUse',
    allowNull: false
  },
  condomCount: {
    type: DataTypes.STRING(2),
    field: 'CMCondom',
    allowNull: false
  },
  cocCount: {
    type: DataTypes.STRING(2),
    field: 'CoC',
    allowNull: false
  },
  pocCount: {
    type: DataTypes.STRING(2),
    field: 'Poc',
    allowNull: false
  },
  drugCount: {
    type: DataTypes.STRING(2),
    field: 'CMVaccine',
    allowNull: false
  },
  placeService: {
    type: DataTypes.STRING(6),
    field: 'UseOther',
    allowNull: false
  },
  condomUsed: {
    type: DataTypes.STRING(2),
    field: 'OCMcondom',
    allowNull: false
  },
  cocUsed: {
    type: DataTypes.STRING(2),
    field: 'OCoc',
    allowNull: false
  },
  pocUsed: {
    type: DataTypes.STRING(2),
    field: 'OPoC',
    allowNull: false
  },
  drugUsed: {
    type: DataTypes.STRING(2),
    field: 'OCMVaccin',
    allowNull: false
  },
  otherUsed: {
    type: DataTypes.STRING(2),
    field: 'OCMother',
    allowNull: false
  },
  cough: {
    type: DataTypes.INTEGER,
    field: 'Cough',
    allowNull: false
  },
  fever: {
    type: DataTypes.INTEGER,
    field: 'Fever',
    allowNull: false
  },
  lostWeight: {
    type: DataTypes.INTEGER,
    field: 'Wlost',
    allowNull: false
  },
  sweet: {
    type: DataTypes.INTEGER,
    field: 'Drenching',
    allowNull: false
  },
  urine: {
    type: DataTypes.INTEGER,
    field: 'Urine',
    allowNull: false
  },
  genital: {
    type: DataTypes.INTEGER,
    field: 'Genital',
    allowNull: false
  },
  chemnah: {
    type: DataTypes.INTEGER,
    field: 'Chemnah',
    allowNull: false
  },
  hospital: {
    type: DataTypes.INTEGER,
    field: 'Hospital',
    allowNull: false
  },
  numHospital: {
    type: DataTypes.STRING(3),
    field: 'NumDay',
    allowNull: false
  },
  reasonHospital: {
    type: DataTypes.STRING(30),
    field: 'CauseHospital',
    allowNull: false
  },
  missARV: {
    type: DataTypes.INTEGER,
    field: 'MissARV',
    allowNull: false
  },
  missTime: {
    type: DataTypes.STRING(3),
    field: 'MissTime',
    allowNull: false
  },
  whoStage: {
    type: DataTypes.INTEGER,
    field: 'WHO',
    allowNull: false
  },
  eligible: {
    type: DataTypes.INTEGER,
    field: 'Eligible',
    allowNull: false
  },
  targetGroup: {
    type: DataTypes.STRING(15),
    field: 'TestID',
    allowNull: false
  },
  function: {
    type: DataTypes.INTEGER,
    field: 'Function',
    allowNull: false
  },
  tb: {
    type: DataTypes.INTEGER,
    field: 'TB',
    allowNull: false
  },
  tbResult: {
    type: DataTypes.INTEGER,
    field: 'TypeTB',
    allowNull: false
  },
  tbTreat: {
    type: DataTypes.INTEGER,
    field: 'TBtreat',
    allowNull: false
  },
  tbDate: {
    type: DataTypes.DATEONLY,
    field: 'DaTBtreat',
    allowNull: false
  },
  testHIV: {
    type: DataTypes.STRING(6),
    field: 'TestHIV',
    allowNull: false
  },
  resultHIV: {
    type: DataTypes.INTEGER,
    field: 'ResultHIV',
    allowNull: false
  },
  cd4: {
    type: DataTypes.INTEGER,
    field: 'ReCD4',
    allowNull: false
  },
  hivViral: {
    type: DataTypes.INTEGER,
    field: 'ReVL',
    allowNull: false
  },
  hcvViral: {
    type: DataTypes.INTEGER,
    field: 'ReHCV',
    allowNull: false
  },
  grAG: {
    type: DataTypes.STRING(6),
    field: 'CrAG',
    allowNull: false
  },
  resultCrAG: {
    type: DataTypes.INTEGER,
    field: 'CrAGResult',
    allowNull: false
  },
  viralDetect: {
    type: DataTypes.INTEGER,
    field: 'VLDetectable',
    allowNull: false
  },
  refer: {
    type: DataTypes.INTEGER,
    field: 'Referred',
    allowNull: false
  },
  referOther: {
    type: DataTypes.STRING(30),
    field: 'OReferred',
    allowNull: false
  },
  moderate: {
    type: DataTypes.STRING(6),
    field: 'Moderate',
    allowNull: false
  },
  tdf: {
    type: DataTypes.STRING(6),
    field: 'Renal',
    allowNull: false
  },
  rash: {
    type: DataTypes.STRING(6),
    field: 'Rash',
    allowNull: false
  },
  hepatitis: {
    type: DataTypes.STRING(6),
    field: 'Hepatitis',
    allowNull: false
  },
  peripheral: {
    type: DataTypes.STRING(6),
    field: 'Peripheral',
    allowNull: false
  },
  azt: {
    type: DataTypes.STRING(6),
    field: 'Neutropenia',
    allowNull: false
  },
  lpv: {
    type: DataTypes.STRING(6),
    field: 'Hyperlipidemia',
    allowNull: false
  },
  lactic: {
    type: DataTypes.STRING(6),
    field: 'Lactic',
    allowNull: false
  },
  abc: {
    type: DataTypes.STRING(6),
    field: 'Hypersensitivity',
    allowNull: false
  },
  atv: {
    type: DataTypes.STRING(6),
    field: 'Jaundice',
    allowNull: false
  },
  mediOther: {
    type: DataTypes.STRING(30),
    field: 'MTother',
    allowNull: false
  },
  arvLine: {
    type: DataTypes.INTEGER,
    field: 'ARVreg',
    allowNull: true
  },
  resultHype: {
    type: DataTypes.INTEGER,
    field: 'ResultHC',
    allowNull: false
  },
  tpt: {
    type: DataTypes.INTEGER,
    field: 'TPTout',
    allowNull: true
  },
  tbOut: {
    type: DataTypes.INTEGER,
    field: 'TBout',
    allowNull: true
  },
  appointmentDate: {
    type: DataTypes.DATEONLY,
    field: 'DaApp',
    allowNull: false
  },
  visitId: {
    type: DataTypes.DOUBLE,
    field: 'Vid',
    allowNull: false
  },
  foWorker: {
    type: DataTypes.INTEGER,
    field: 'Foworker',
    allowNull: false
  },
  countryId: {
    type: DataTypes.INTEGER,
    field: 'Country',
    allowNull: false
  }
}, {
  tableName: 'tblavmain',
  timestamps: false
});

module.exports = AdultVisit;