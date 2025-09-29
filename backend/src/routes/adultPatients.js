const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { AdultPatient, AdultArvTreatment, AdultAllergy, AdultMedicalTreatment } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Helper function to calculate age
const calculateAge = (dateOfBirth, dateFirstVisit) => {
  if (!dateOfBirth || !dateFirstVisit) return 0;
  
  const birthDate = new Date(dateOfBirth);
  const visitDate = new Date(dateFirstVisit);
  
  let age = visitDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = visitDate.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && visitDate.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Helper function to get referred text
const getReferredText = (referred) => {
  const referredOptions = {
    0: 'Self',
    1: 'VCCT',
    2: 'TB Program',
    3: 'Community Care',
    4: 'PMTCT',
    5: 'Blood Bank',
    6: 'Other'
  };
  return referredOptions[referred] || 'Unknown';
};

const router = express.Router();

// Get patient status counts
router.get('/status-counts', [authenticateToken], async (req, res, next) => {
  try {
    const { site } = req.query;
    
    let whereCondition = '';
    let replacements = {};
    let conditions = [];
    
    if (site) {
      conditions.push('s.NameEn = :site');
      replacements.site = site;
    }
    
    if (conditions.length > 0) {
      whereCondition = 'WHERE ' + conditions.join(' AND ');
    }
    
    // Get status counts
    const statusCounts = await sequelize.query(`
      SELECT 
        COALESCE(ps.Status, -1) as status,
        COUNT(*) as count
      FROM tblaimain p
      LEFT JOIN tblsitename s ON p._site_code = s.SiteCode
      LEFT JOIN tblavpatientstatus ps ON p.ClinicID = ps.ClinicID
      ${whereCondition}
      GROUP BY COALESCE(ps.Status, -1)
    `, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });
    
    // Get total count
    const totalResult = await sequelize.query(`
      SELECT COUNT(*) as total
      FROM tblaimain p
      LEFT JOIN tblsitename s ON p._site_code = s.SiteCode
      ${whereCondition}
    `, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });
    
    // Format status counts
    const counts = {
      total: totalResult[0].total,
      active: 0,
      dead: 0,
      lost: 0,
      transferred_out: 0,
      new: 0,
      return_in: 0,
      return_out: 0
    };
    
    statusCounts.forEach(item => {
      switch (item.status) {
        case -1:
          counts.active = item.count;
          break;
        case 0:
          counts.lost = item.count;
          break;
        case 1:
          counts.dead = item.count;
          break;
        case 3:
          counts.transferred_out = item.count;
          break;
      }
    });
    
    // Get type of return counts for active patients
    const returnCounts = await sequelize.query(`
      SELECT 
        p.TypeofReturn as typeOfReturn,
        COUNT(*) as count
      FROM tblaimain p
      LEFT JOIN tblsitename s ON p._site_code = s.SiteCode
      LEFT JOIN tblavpatientstatus ps ON p.ClinicID = ps.ClinicID
      WHERE COALESCE(ps.Status, -1) = -1
      ${site ? 'AND s.NameEn = :site' : ''}
      GROUP BY p.TypeofReturn
    `, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });
    
    returnCounts.forEach(item => {
      switch (item.typeOfReturn) {
        case -1:
          counts.new = item.count;
          break;
        case 0:
          counts.return_in = item.count;
          break;
        case 1:
          counts.return_out = item.count;
          break;
      }
    });
    
    res.json({
      success: true,
      counts: counts
    });
    
  } catch (error) {
    next(error);
  }
});

// Get all adult patients with search and pagination
router.get('/', [authenticateToken], async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit, 
      search, 
      clinicId, 
      site, 
      gender, 
      status, 
      ageRange, 
      dateRange, 
      artNumber, 
      referral, 
      nationality,
      sortBy = 'clinicId',
      sortOrder = 'asc'
    } = req.query;
    // Smart pagination: only apply limit/offset if explicitly provided
    const limitNum = limit ? parseInt(limit) : null;
    const offset = limitNum ? (parseInt(page) - 1) * limitNum : 0;
    
    let whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { clinicId: { [Op.like]: `%${search}%` } },
        sequelize.where(
          sequelize.fn('CONCAT', 
            sequelize.fn('LPAD', sequelize.col('clinicId'), 6, '0')
          ), 
          { [Op.like]: `%${search}%` }
        )
      ];
    }
    
    if (clinicId) {
      whereClause.clinicId = clinicId;
    }

    // Build WHERE clause for raw query
    let whereCondition = '';
    let replacements = {};
    let conditions = [];
    
    if (clinicId) {
      conditions.push('p.ClinicID = :clinicId');
      replacements.clinicId = clinicId;
    }
    
    if (search) {
      conditions.push('(p.ClinicID LIKE :search OR CONCAT(LPAD(p.ClinicID, 6, "0")) LIKE :search)');
      replacements.search = `%${search}%`;
    }
    
    if (site) {
      conditions.push('s.NameEn = :site');
      replacements.site = site;
    }
    
    // Add gender filter
    if (gender) {
      if (gender === 'male') {
        conditions.push('p.Sex = 1');
      } else if (gender === 'female') {
        conditions.push('p.Sex = 0');
      }
    }
    
    // Add status filter (based on patient status from tblpatientstatus)
    if (status) {
      if (status === 'active') {
        conditions.push('COALESCE(ps.Status, -1) = -1'); // Active patients
      } else if (status === 'dead') {
        conditions.push('COALESCE(ps.Status, -1) = 1'); // Dead patients
      } else if (status === 'lost') {
        conditions.push('COALESCE(ps.Status, -1) = 0'); // Lost patients
      } else if (status === 'transferred_out') {
        conditions.push('COALESCE(ps.Status, -1) = 3'); // Transferred out patients
      } else if (status === 'new') {
        conditions.push('p.TypeofReturn = -1'); // New patients
      } else if (status === 'return_in') {
        conditions.push('p.TypeofReturn = 0'); // Return In
      } else if (status === 'return_out') {
        conditions.push('p.TypeofReturn = 1'); // Return Out
      }
    }
    
    // Add age range filter
    if (ageRange) {
      const now = new Date();
      if (ageRange === '0-17') {
        conditions.push('YEAR(now()) - YEAR(p.DaBirth) BETWEEN 0 AND 17');
      } else if (ageRange === '18-35') {
        conditions.push('YEAR(now()) - YEAR(p.DaBirth) BETWEEN 18 AND 35');
      } else if (ageRange === '36-50') {
        conditions.push('YEAR(now()) - YEAR(p.DaBirth) BETWEEN 36 AND 50');
      } else if (ageRange === '50+') {
        conditions.push('YEAR(now()) - YEAR(p.DaBirth) > 50');
      }
    }
    
    // Add date range filter (first visit date)
    if (dateRange) {
      const now = new Date();
      if (dateRange === '30days') {
        conditions.push('p.DafirstVisit >= DATE_SUB(NOW(), INTERVAL 30 DAY)');
      } else if (dateRange === '90days') {
        conditions.push('p.DafirstVisit >= DATE_SUB(NOW(), INTERVAL 90 DAY)');
      } else if (dateRange === '1year') {
        conditions.push('p.DafirstVisit >= DATE_SUB(NOW(), INTERVAL 1 YEAR)');
      }
    }
    
    // Add ART number filter
    if (artNumber) {
      conditions.push('p.Artnum LIKE :artNumber');
      replacements.artNumber = `%${artNumber}%`;
    }
    
    // Add referral filter
    if (referral) {
      if (referral === 'referred') {
        conditions.push('p.Referred > 0'); // Any referral code > 0
      } else if (referral === 'not_referred') {
        conditions.push('p.Referred = 0'); // Self referral
      }
    }
    
    // Add nationality filter
    if (nationality) {
      conditions.push('p.Nationality = :nationality');
      replacements.nationality = nationality;
    }
    
    if (conditions.length > 0) {
      whereCondition = 'WHERE ' + conditions.join(' AND ');
    }

    // Build ORDER BY clause
    let orderByClause = 'ORDER BY p.ClinicID ASC'; // Default sorting - show lowest Clinic ID first
    
    // Map frontend sort fields to database columns
    const sortFieldMap = {
      'clinicId': 'p.ClinicID',
      'dateFirst': 'p.DafirstVisit',
      'age': 'YEAR(NOW()) - YEAR(p.DaBirth)',
      'sex': 'p.Sex',
      'patientStatus': 'p.TypeofReturn',
      'referred': 'p.Referred',
      'siteName': 's.NameEn'
    };
    
    const dbSortField = sortFieldMap[sortBy] || 'p.ClinicID';
    const dbSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';
    orderByClause = `ORDER BY ${dbSortField} ${dbSortOrder}`;

    // Get count first
    const countResult = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM tblaimain p
      LEFT JOIN tblsitename s ON p._site_code = s.SiteCode
      LEFT JOIN tblavpatientstatus ps ON p.ClinicID = ps.ClinicID
      ${whereCondition}
    `, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });
    const count = countResult[0].count;

    // Get patients with essential data only
    const rows = await sequelize.query(`
      SELECT 
        p.ClinicID as clinicId,
        p.DafirstVisit as dateFirstVisit,
        p.DaBirth as dateOfBirth,
        p.Sex as sex,
        p.Referred as referred,
        p.OffIn as offIn,
        p._site_code as _site_code,
        s.NameEn as siteName,
        p.Artnum as artNumber,
        p.TypeofReturn as typeOfReturn,
        p.VcctID as vcctId,
        p.Targroup as targetGroup,
        p.Nationality as nationality,
        COALESCE(ps.Status, -1) as patientStatus,
        ps.Cause as statusCause,
        ps.Da as statusDate
      FROM tblaimain p
      LEFT JOIN tblsitename s ON p._site_code = s.SiteCode
      LEFT JOIN tblavpatientstatus ps ON p.ClinicID = ps.ClinicID
      ${whereCondition}
      ${orderByClause}
      ${limitNum ? `LIMIT ${limitNum} OFFSET ${offset}` : ''}
    `, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });

    // Helper function to get patient status text
    const getPatientStatusText = (patientStatus, typeOfReturn) => {
      // Patient status from tblpatientstatus: -1 = Active, 0 = Lost, 1 = Dead, 3 = Transferred Out
      if (patientStatus === 1) return 'Dead';
      if (patientStatus === 0) return 'Lost';
      if (patientStatus === 3) return 'Transferred Out';
      if (patientStatus === -1) {
        // Active patients - show type of return
        if (typeOfReturn === -1) return 'New';
        if (typeOfReturn === 0) return 'Return In';
        if (typeOfReturn === 1) return 'Return Out';
        return 'Active';
      }
      return 'Active';
    };

    // Format the data like the VB.NET ViewData function
    const formattedRows = rows.map((row, index) => ({
      no: offset + index + 1,
      clinicId: String(row.clinicId).padStart(6, '0'),
      dateFirst: row.dateFirstVisit,
      age: calculateAge(row.dateOfBirth, row.dateFirstVisit),
      sex: row.sex === 0 ? 'Female' : 'Male',
      referred: getReferredText(row.referred),
      transferIn: row.offIn === 1,
      _site_code: row._site_code || '',
      siteName: row.siteName || '',
      artNumber: row.artNumber || '',
      lostReturn: row.typeOfReturn !== -1 ? (row.typeOfReturn === 0 ? 'In' : 'Out') : 'New',
      vcctCode: row.vcctId || '',
      targetGroup: row.targetGroup || '',
      nationality: row.nationality || '',
      patientStatus: getPatientStatusText(row.patientStatus, row.typeOfReturn),
      patientStatusValue: row.patientStatus,
      statusCause: row.statusCause || '',
      statusDate: row.statusDate || ''
    }));

    res.json({
      patients: formattedRows,
      total: count,
      page: parseInt(page),
      totalPages: limitNum ? Math.ceil(count / limitNum) : 1,
      limit: limitNum
    });

  } catch (error) {
    next(error);
  }
});

// Get single adult patient by clinic ID
router.get('/:clinicId', [
  authenticateToken,
  param('clinicId').isNumeric().withMessage('Clinic ID must be numeric')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { clinicId } = req.params;

    // Get main patient data
    const patient = await AdultPatient.findOne({
      where: { clinicId: parseInt(clinicId) }
    });

    if (!patient) {
      return res.status(404).json({
        error: 'Patient not found'
      });
    }

    // Get related data like in VB.NET Search function
    const [
      arvHistory,
      allergies,
      medicalTreatments
    ] = await Promise.all([
      // ARV Treatment History (tblaiarvtreathis)
      sequelize.query(`
        SELECT * FROM tblaiarvtreathis 
        WHERE ClinicID = :clinicId
      `, {
        replacements: { clinicId },
        type: sequelize.QueryTypes.SELECT
      }),
      
      // Allergies (tblaiallergy)
      sequelize.query(`
        SELECT * FROM tblaiallergy 
        WHERE ClinicID = :clinicId
      `, {
        replacements: { clinicId },
        type: sequelize.QueryTypes.SELECT
      }),
      
      // Medical treatments (multiple tables)
      Promise.all([
        sequelize.query(`SELECT * FROM tblaiothmeddiabete WHERE ClinicID = :clinicId`, 
          { replacements: { clinicId }, type: sequelize.QueryTypes.SELECT }),
        sequelize.query(`SELECT * FROM tblaiothmedhyper WHERE ClinicID = :clinicId`, 
          { replacements: { clinicId }, type: sequelize.QueryTypes.SELECT }),
        sequelize.query(`SELECT * FROM tblaiothmedabnormal WHERE ClinicID = :clinicId`, 
          { replacements: { clinicId }, type: sequelize.QueryTypes.SELECT }),
        sequelize.query(`SELECT * FROM tblaiothmedrenal WHERE ClinicID = :clinicId`, 
          { replacements: { clinicId }, type: sequelize.QueryTypes.SELECT }),
        sequelize.query(`SELECT * FROM tblaiothmedanemia WHERE ClinicID = :clinicId`, 
          { replacements: { clinicId }, type: sequelize.QueryTypes.SELECT }),
        sequelize.query(`SELECT * FROM tblaiothmedliver WHERE ClinicID = :clinicId`, 
          { replacements: { clinicId }, type: sequelize.QueryTypes.SELECT }),
        sequelize.query(`SELECT * FROM tblaiothmedhepbc WHERE ClinicID = :clinicId`, 
          { replacements: { clinicId }, type: sequelize.QueryTypes.SELECT }),
        sequelize.query(`SELECT * FROM tblaiothmedother WHERE ClinicID = :clinicId`, 
          { replacements: { clinicId }, type: sequelize.QueryTypes.SELECT })
      ])
    ]);

    const [diabetes, hypertension, abnormal, renal, anemia, liver, hepatitisB, other] = medicalTreatments;

    // Map database fields to frontend expected field names
    const patientData = {
      // Basic Information
      clinicId: patient.clinicId,
      dateFirstVisit: patient.dateFirstVisit,
      lostReturn: patient.typeOfReturn !== -1,
      typeOfReturn: patient.typeOfReturn,
      returnClinicId: patient.lClinicId,
      oldSiteName: patient.siteNameOld,
      patientName: '', // Field not available in database
      
      // Demographics
      dateOfBirth: patient.dateOfBirth,
      age: calculateAge(patient.dateOfBirth, patient.dateFirstVisit),
      sex: patient.sex,
      education: patient.education,
      canRead: patient.read,
      canWrite: patient.write,
      nationality: patient.nationality?.toString() || 'none',
      
      // HIV Testing & Referral
      referred: patient.referred,
      referredOther: patient.otherReferred,
      dateTestHIV: patient.dateHIV,
      vcctSite: patient.vcctCode,
      vcctId: patient.vcctId,
      previousClinicId: patient.pClinicId,
      
      // Target Group and Transfer Information
      targetGroup: patient.targetGroup,
      refugeeStatus: -1, // Field not available in database
      childrenClinicId: '', // Field not available in database
      
      // ART Information
      artNumber: patient.artNumber,
      dateART: patient.dateART,
      transferIn: patient.offIn,
      transferFrom: '', // Field not available in database
      transferDate: '', // Field not available in database
      
      // TB Past Medical History
      tbPast: patient.tbPast,
      tptHistory: patient.tpt,
      tptRegimen: patient.tptDrug,
      tptDateStart: patient.dateStartTPT,
      tptDateEnd: patient.dateEndTPT,
      tbType: patient.typeTB,
      tbResult: patient.resultTB,
      tbDateOnset: patient.dateOnset,
      tbTreatment: patient.tbTreat,
      tbDateTreatment: patient.dateTreat,
      tbResultTreatment: patient.resultTreat,
      tbDateResultTreatment: patient.dateResultTreat,
      tbDateComplete: '', // Field not available in database
      
      // TPT Treatment
      inh: -1, // Field not available in database
      tptDrug: patient.tptDrug,
      
      // Other Medical History
      otherPast: -1, // Field not available in database
      otherPastDetails: '', // Field not available in database
      
      // Current Medications
      cotrimoxazole: -1, // Field not available in database
      fluconazole: -1, // Field not available in database
      
      // Medical History Checkboxes
      diabetes: patient.diabetes === 'True',
      hypertension: patient.hyper === 'True',
      abnormal: patient.abnormal === 'True',
      renal: patient.renal === 'True',
      anemia: patient.anemia === 'True',
      liver: patient.liver === 'True',
      hepatitis: patient.hepBC === 'True',
      other: patient.medOther === 'True',
      otherIllness: '', // Field not available in database
      
      // Allergies
      allergy: patient.allergy,
      allergyDetails: '', // Field not available in database
      
      // Related data
      arvHistory: arvHistory || [],
      allergies: allergies || [],
      medicalTreatments: {
        diabetes: diabetes[0] || null,
        hypertension: hypertension[0] || null,
        abnormal: abnormal[0] || null,
        renal: renal[0] || null,
        anemia: anemia[0] || null,
        liver: liver[0] || null,
        hepatitisB: hepatitisB[0] || null,
        other: other[0] || null
      }
    };

    res.json(patientData);

  } catch (error) {
    next(error);
  }
});

// Create new adult patient
router.post('/', [
  authenticateToken,
  requireRole(['admin', 'doctor', 'nurse']),
  
  // Validation matching VB.NET Save() function
  body('clinicId').notEmpty().withMessage('Please input Clinic ID'),
  body('dateFirstVisit').isISO8601().withMessage('Please input Date First Visit'),
  body('sex').isIn([0, 1]).withMessage('Please select Patient Sex'),
  body('dateOfBirth').isISO8601().withMessage('Date of birth is required'),
  
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const {
      clinicId,
      dateFirstVisit,
      typeOfReturn = -1,
      lClinicId = '',
      siteNameOld = '',
      dateOfBirth,
      sex,
      education = -1,
      read = -1,
      write = -1,
      referred = -1,
      otherReferred = '',
      dateHIV = '1900-01-01',
      vcctCode = '',
      vcctId = '',
      pClinicId = '',
      offIn = -1,
      siteName = '',
      dateART = '1900-01-01',
      artNumber = '',
      tbPast = -1,
      tpt = -1,
      tptDrug = -1,
      dateStartTPT = '1900-01-01',
      dateEndTPT = '1900-01-01',
      typeTB = -1,
      resultTB = -1,
      dateOnset = '1900-01-01',
      tbTreat = -1,
      dateTreat = '1900-01-01',
      resultTreat = -1,
      dateResultTreat = '1900-01-01',
      arvTreatHis = -1,
      diabetes = false,
      hyper = false,
      abnormal = false,
      renal = false,
      anemia = false,
      liver = false,
      hepBC = false,
      medOther = false,
      allergy = -1,
      nationality = 0,
      targetGroup = 0,
      refugStatus = -1,
      refugART = '',
      refugSite = '',
      
      // Related data
      arvTreatments = [],
      allergies = [],
      medicalTreatments = {}
    } = req.body;

    // Additional validation like in VB.NET
    const age = calculateAge(dateOfBirth, dateFirstVisit);
    if (age < 15) {
      return res.status(400).json({
        error: 'Invalid Patient Age',
        message: 'Age must be 15 or older for adult patients'
      });
    }

    if (offIn === 1 && !artNumber.trim()) {
      return res.status(400).json({
        error: 'ART Number Required',
        message: 'Please input ART Number for transfer in patients'
      });
    }

    // Start transaction like VB.NET
    const transaction = await sequelize.transaction();

    try {
      // Insert main record (tblaimain)
      const patient = await AdultPatient.create({
        clinicId: parseInt(clinicId),
        dateFirstVisit,
        typeOfReturn,
        lClinicId,
        siteNameOld,
        dateOfBirth,
        sex,
        education,
        read,
        write,
        referred,
        otherReferred,
        dateHIV,
        vcctCode,
        vcctId,
        pClinicId,
        offIn,
        siteName,
        dateART,
        artNumber,
        tbPast,
        tpt,
        tptDrug,
        dateStartTPT,
        dateEndTPT,
        typeTB,
        resultTB,
        dateOnset,
        tbTreat,
        dateTreat,
        resultTreat,
        dateResultTreat,
        arvTreatHis,
        diabetes,
        hyper,
        abnormal,
        renal,
        anemia,
        liver,
        hepBC,
        medOther,
        allergy,
        nationality,
        targetGroup,
        refugStatus,
        refugART,
        refugSite
      }, { transaction });

      // Insert ARV Treatment History
      for (let i = 0; i < arvTreatments.length; i++) {
        const arv = arvTreatments[i];
        if (arv.drug && arv.drug.trim()) {
          await sequelize.query(`
            INSERT INTO tblaiarvtreathis 
            (ClinicID, DrugName, ClinicName, DaStart, DaStop, Note) 
            VALUES (?, ?, ?, ?, ?, ?)
          `, {
            replacements: [
              clinicId,
              arv.drug,
              arv.clinic || '',
              arv.startDate || '1900-01-01',
              arv.stopDate || '1900-01-01',
              arv.note || ''
            ],
            transaction
          });
        }
      }

      // Insert Medical Treatments
      if (diabetes && medicalTreatments.diabetes) {
        const med = medicalTreatments.diabetes;
        await sequelize.query(`
          INSERT INTO tblaiothmeddiabete 
          (ClinicID, DrugName, ClinicName, DaStart, DaStop, Note) 
          VALUES (?, ?, ?, ?, ?, ?)
        `, {
          replacements: [
            clinicId,
            med.drug || '',
            med.clinic || '',
            med.startDate || '1900-01-01',
            med.stopDate || '1900-01-01',
            med.note || ''
          ],
          transaction
        });
      }

      // Similar for other medical conditions...

      // Insert Allergies
      for (const allergy of allergies) {
        if (allergy.drug && allergy.drug.trim()) {
          await sequelize.query(`
            INSERT INTO tblaiallergy 
            (ClinicID, DrugName, Allergy, DaAllergy) 
            VALUES (?, ?, ?, ?)
          `, {
            replacements: [
              clinicId,
              allergy.drug,
              allergy.allergy || '',
              allergy.date || '1900-01-01'
            ],
            transaction
          });
        }
      }

      // Insert ART record if transfer in
      if (offIn === 1 && artNumber.trim()) {
        await sequelize.query(`
          INSERT INTO tblaart (ClinicID, ARTnum, DaART) 
          VALUES (?, ?, ?)
        `, {
          replacements: [clinicId, artNumber, dateART],
          transaction
        });
      }

      // Log the action
      await sequelize.query(`
        INSERT INTO tbllog (ClinicID, TableName, Action, DateTime) 
        VALUES (?, 'tblAImain', '1', NOW())
      `, {
        replacements: [clinicId],
        transaction
      });

      await transaction.commit();

      res.status(201).json({
        message: 'Adult patient created successfully',
        patient: patient.toJSON()
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    next(error);
  }
});

// Update adult patient
router.put('/:clinicId', [
  authenticateToken,
  requireRole(['admin', 'doctor', 'nurse']),
  param('clinicId').isNumeric().withMessage('Clinic ID must be numeric')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const { clinicId } = req.params;
    const updateData = req.body;

    // Find existing patient
    const patient = await AdultPatient.findOne({
      where: { clinicId: parseInt(clinicId) }
    });

    if (!patient) {
      return res.status(404).json({
        error: 'Patient not found'
      });
    }

    const transaction = await sequelize.transaction();

    try {
      // Update main record
      await patient.update(updateData, { transaction });

      // Delete and re-insert related records (like VB.NET edit function)
      await sequelize.query(`DELETE FROM tblaiarvtreathis WHERE ClinicID = ?`, {
        replacements: [clinicId],
        transaction
      });

      await sequelize.query(`DELETE FROM tblaiallergy WHERE ClinicID = ?`, {
        replacements: [clinicId],
        transaction
      });

      // Re-insert updated data...
      // (Similar to create logic)

      // Log the action
      await sequelize.query(`
        INSERT INTO tbllog (ClinicID, TableName, Action, DateTime) 
        VALUES (?, 'tblAImain', '2', NOW())
      `, {
        replacements: [clinicId],
        transaction
      });

      await transaction.commit();

      res.json({
        message: 'Adult patient updated successfully',
        patient: patient.toJSON()
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    next(error);
  }
});

// Delete adult patient
router.delete('/:clinicId', [
  authenticateToken,
  requireRole(['admin']),
  param('clinicId').isNumeric().withMessage('Clinic ID must be numeric')
], async (req, res, next) => {
  try {
    const { clinicId } = req.params;

    const transaction = await sequelize.transaction();

    try {
      // Delete all related records first (like VB.NET Delete function)
      await sequelize.query(`DELETE FROM tblaiallergy WHERE ClinicID = ?`, {
        replacements: [clinicId],
        transaction
      });

      await sequelize.query(`DELETE FROM tblaiothmedother WHERE ClinicID = ?`, {
        replacements: [clinicId],
        transaction
      });

      // Delete other related tables...

      // Delete main record
      await sequelize.query(`DELETE FROM tblaimain WHERE ClinicID = ?`, {
        replacements: [clinicId],
        transaction
      });

      // Log the action
      await sequelize.query(`
        INSERT INTO tbllog (ClinicID, TableName, Action, DateTime) 
        VALUES (?, 'tblAImain', '3', NOW())
      `, {
        replacements: [clinicId],
        transaction
      });

      await transaction.commit();

      res.json({
        message: 'Adult patient deleted successfully'
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    next(error);
  }
});

module.exports = router;
