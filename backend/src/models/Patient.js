const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    field: 'Id',
    primaryKey: true,
    autoIncrement: true
  },
  clinicId: {
    type: DataTypes.STRING(50),
    field: 'ClinicId',
    allowNull: false,
    unique: true
  },
  artNumber: {
    type: DataTypes.STRING(50),
    field: 'ArtNumber',
    allowNull: true,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING(100),
    field: 'FirstName',
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(100),
    field: 'LastName',
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    field: 'DateOfBirth',
    allowNull: false
  },
  sex: {
    type: DataTypes.STRING(10),
    field: 'Sex',
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(200),
    field: 'Address',
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    field: 'Phone',
    allowNull: true
  },
  province: {
    type: DataTypes.STRING(50),
    field: 'Province',
    allowNull: true
  },
  dateFirstVisit: {
    type: DataTypes.DATE,
    field: 'FirstVisitDate',
    allowNull: false
  },
  patientType: {
    type: DataTypes.STRING(20),
    field: 'PatientType',
    allowNull: false
  },
  maritalStatus: {
    type: DataTypes.STRING(20),
    field: 'MaritalStatus',
    allowNull: true
  },
  occupation: {
    type: DataTypes.STRING(100),
    field: 'Occupation',
    allowNull: true
  },
  group: {
    type: DataTypes.STRING(100),
    field: 'Group',
    allowNull: true
  },
  houseNumber: {
    type: DataTypes.STRING(200),
    field: 'HouseNumber',
    allowNull: true
  },
  street: {
    type: DataTypes.STRING(200),
    field: 'Street',
    allowNull: true
  },
  district: {
    type: DataTypes.STRING(100),
    field: 'District',
    allowNull: true
  },
  commune: {
    type: DataTypes.STRING(100),
    field: 'Commune',
    allowNull: true
  },
  village: {
    type: DataTypes.STRING(100),
    field: 'Village',
    allowNull: true
  },
  contactPerson1: {
    type: DataTypes.STRING(100),
    field: 'ContactPerson1',
    allowNull: true
  },
  contactPhone1: {
    type: DataTypes.STRING(20),
    field: 'ContactPhone1',
    allowNull: true
  },
  contactPerson2: {
    type: DataTypes.STRING(100),
    field: 'ContactPerson2',
    allowNull: true
  },
  contactPhone2: {
    type: DataTypes.STRING(20),
    field: 'ContactPhone2',
    allowNull: true
  },
  isNGO: {
    type: DataTypes.BOOLEAN,
    field: 'IsNGO',
    allowNull: false
  },
  ngoName: {
    type: DataTypes.STRING(200),
    field: 'NGOName',
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    field: 'IsActive',
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'CreatedAt',
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'UpdatedAt',
    allowNull: false
  }
}, {
  tableName: 'patients',
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: 'UpdatedAt',
  underscored: false
});

// Instance methods
Patient.prototype.getAge = function() {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

Patient.prototype.getFullName = function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
};

module.exports = Patient;
