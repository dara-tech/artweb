const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Patient = require('./Patient');
const ChildPatient = require('./ChildPatient');
const InfantPatient = require('./InfantPatient');
const PatientVisit = require('./PatientVisit');
const PatientTest = require('./PatientTest');
const PatientStatus = require('./PatientStatus');
const Drug = require('./Drug');
const Clinic = require('./Clinic');
const Site = require('./Site');
const VCCTSite = require('./VCCTSite');
const Nationality = require('./Nationality');
const TargetGroup = require('./TargetGroup');
const Allergy = require('./Allergy');
const Reason = require('./Reason');
const Log = require('./Log');
const ChildVisit = require('./ChildVisit');
const InfantVisit = require('./InfantVisit');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(Log, { foreignKey: 'userId', as: 'logs' });
  Log.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Patient associations
  Patient.hasMany(PatientVisit, { foreignKey: 'clinicId', as: 'visits' });
  Patient.hasMany(PatientTest, { foreignKey: 'clinicId', as: 'tests' });
  Patient.hasMany(PatientStatus, { foreignKey: 'clinicId', as: 'statuses' });
  Patient.hasOne(ChildPatient, { foreignKey: 'clinicId', as: 'childDetails' });
  Patient.hasOne(InfantPatient, { foreignKey: 'clinicId', as: 'infantDetails' });

  PatientVisit.belongsTo(Patient, { foreignKey: 'clinicId', as: 'patient' });
  PatientTest.belongsTo(Patient, { foreignKey: 'clinicId', as: 'patient' });
  PatientStatus.belongsTo(Patient, { foreignKey: 'clinicId', as: 'patient' });

  // Child Patient associations
  ChildPatient.belongsTo(Patient, { foreignKey: 'clinicId', as: 'patient' });
  // Note: nationality field exists in tblcimain, but targetGroup does not

  // Infant Patient associations
  InfantPatient.belongsTo(Patient, { foreignKey: 'clinicId', as: 'patient' });
  // Note: Neither nationality nor targetGroup fields exist in tbleimain
};

// Initialize associations
defineAssociations();

module.exports = {
  sequelize,
  User,
  Patient,
  ChildPatient,
  InfantPatient,
  PatientVisit,
  PatientTest,
  PatientStatus,
  Drug,
  Clinic,
  Site,
  VCCTSite,
  Nationality,
  TargetGroup,
  Allergy,
  Reason,
  Log,
  ChildVisit,
  InfantVisit
};
