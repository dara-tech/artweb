const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PatientTest = sequelize.define('PatientTest', {
    TestID: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
      comment: 'Test ID (ClinicID + Date format)'
    },
    ClinicID: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Patient Clinic ID'
    },
    DaArrival: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date of arrival'
    },
    Dat: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Test date'
    },
    DaCollect: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date of blood collection'
    },
    CD4Rapid: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      defaultValue: 0,
      comment: 'CD4 Rapid test (0=No, 1=Yes)'
    },
    CD4: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'CD4 count'
    },
    CD: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'CD4 percentage'
    },
    CD8: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'CD8 count'
    },
    HIVLoad: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'HIV viral load (copies)'
    },
    HIVLog: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'HIV viral load (log)'
    },
    HCV: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'HCV viral load (copies)'
    },
    HCVlog: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'HCV viral load (log)'
    },
    HIVAb: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'HIV Antibody (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    HBsAg: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'Hepatitis B Surface Antigen (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    HCVPCR: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'HCV PCR (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    HBeAg: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'Hepatitis B e Antigen (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    TPHA: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'TPHA (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    AntiHBcAb: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'Anti-HBc Antibody (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    RPR: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'RPR (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    AntiHBeAb: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'Anti-HBe Antibody (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    RPRab: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'RPR titer'
    },
    HCVAb: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'HCV Antibody (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    HBsAb: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'Hepatitis B Surface Antibody (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    // Hematology
    WBC: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'White Blood Cell count'
    },
    Neutrophils: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Neutrophils count'
    },
    HGB: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Hemoglobin'
    },
    Eosinophis: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Eosinophils count'
    },
    HCT: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Hematocrit'
    },
    Lymphocyte: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Lymphocyte count'
    },
    MCV: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Mean Corpuscular Volume'
    },
    Monocyte: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Monocyte count'
    },
    PLT: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Platelet count'
    },
    Reticulocte: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Reticulocyte count'
    },
    Prothrombin: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Prothrombin time INR'
    },
    ProReticulocyte: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Prothrombin reticulocyte percentage'
    },
    // Chemistry
    Creatinine: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Creatinine'
    },
    HDL: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'HDL Cholesterol'
    },
    Bilirubin: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Bilirubin'
    },
    Glucose: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Glucose'
    },
    Sodium: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Sodium'
    },
    AlPhosphate: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Alkaline Phosphate'
    },
    GotASAT: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'AST (SGOT)'
    },
    Potassium: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Potassium'
    },
    Amylase: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Amylase'
    },
    GPTALAT: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'ALT (SGPT)'
    },
    Chloride: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Chloride'
    },
    CK: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Creatine Kinase'
    },
    CHOL: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Total Cholesterol'
    },
    Bicarbonate: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Bicarbonate'
    },
    Lactate: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Lactate'
    },
    Triglyceride: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Triglyceride'
    },
    Urea: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Urea'
    },
    Magnesium: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Magnesium'
    },
    Phosphorus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Phosphorus'
    },
    Calcium: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Calcium'
    },
    // Microbiology
    BHCG: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'Urine BHCG (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    SputumAFB: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'Sputum AFB (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    AFBCulture: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'AFB Culture (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    AFBCulture1: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'AFB Culture result'
    },
    UrineMicroscopy: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'Urine Microscopy (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    UrineComment: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Urine microscopy comment'
    },
    // CSF
    CSFCell: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'CSF Cell count'
    },
    CSFGram: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'CSF Gram stain'
    },
    CSFAFB: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'CSF AFB'
    },
    CSFIndian: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'CSF Indian ink (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    CSFCCag: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'CSF Cryptococcal antigen'
    },
    CSFProtein: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'CSF Protein'
    },
    CSFGlucose: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'CSF Glucose'
    },
    // Blood Culture
    BloodCulture: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'Blood Culture 1 (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    BloodCulture0: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Blood Culture 1 result'
    },
    BloodCulture1: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'Blood Culture 2 (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    BloodCulture10: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Blood Culture 2 result'
    },
    // PCR Tests
    CTNA: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'CT/NA PCR (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    GCNA: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'GC/NA PCR (0=Negative, 1=Positive, 2=Indeterminate)'
    },
    // Imaging
    CXR: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'Chest X-Ray (0=No, 1=Yes)'
    },
    Abdominal: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      comment: 'Abdominal Ultrasound (0=No, 1=Yes)'
    }
  }, {
    tableName: 'tblPatientTest',
    timestamps: false,
    indexes: [
      {
        fields: ['ClinicID']
      },
      {
        fields: ['Dat']
      },
      {
        fields: ['TestID']
      }
    ]
  });

module.exports = PatientTest;