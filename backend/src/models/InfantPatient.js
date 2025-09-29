const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InfantPatient = sequelize.define('InfantPatient', {
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
    field: 'DafirstVisit'
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
  addGuardian: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'AddGuardian'
  },
  group: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'Grou'
  },
  house: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'House'
  },
  street: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'Street'
  },
  village: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'Village'
  },
  commune: {
    type: DataTypes.STRING(25),
    allowNull: true,
    field: 'Commune'
  },
  district: {
    type: DataTypes.STRING(25),
    allowNull: true,
    field: 'District'
  },
  province: {
    type: DataTypes.STRING(25),
    allowNull: true,
    field: 'Province'
  },
  nameContact: {
    type: DataTypes.STRING(25),
    allowNull: true,
    field: 'NameContact'
  },
  addressContact: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'AddContact'
  },
  phone: {
    type: DataTypes.STRING(12),
    allowNull: true,
    field: 'Phone'
  },
  fAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'Fage'
  },
  fHIV: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'FHIV'
  },
  fStatus: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'Fstatus'
  },
  mAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'Mage'
  },
  mClinicId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'MClinicID'
  },
  mArt: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'MArt'
  },
  hospitalName: {
    type: DataTypes.STRING(30),
    allowNull: true,
    field: 'HospitalName'
  },
  mStatus: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'Mstatus'
  },
  catPlaceDelivery: {
    type: DataTypes.STRING(25),
    allowNull: true,
    field: 'CatPlaceDelivery'
  },
  placeDelivery: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'PlaceDelivery'
  },
  pmtct: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'PMTCT'
  },
  dateDelivery: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'DaDelivery'
  },
  deliveryStatus: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'DeliveryStatus'
  },
  lenBaby: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'LenBaby'
  },
  wBaby: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'WBaby'
  },
  knownHIV: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'KnownHIV'
  },
  received: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'Received'
  },
  syrup: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'Syrup'
  },
  cotrim: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'Cotrim'
  },
  offIn: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'Offin'
  },
  siteName: {
    type: DataTypes.STRING(40),
    allowNull: true,
    field: 'SiteName'
  },
  hivTest: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'HIVtest'
  },
  mHIV: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1,
    field: 'MHIV'
  },
  mLastVl: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'MLastvl'
  },
  dateMLastVl: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'DaMLastvl'
  },
  eoClinicId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'EOClinicID'
  },
  site_code: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'site_code'
  }
}, {
  tableName: 'tbleimain',
  timestamps: false
});

module.exports = InfantPatient;