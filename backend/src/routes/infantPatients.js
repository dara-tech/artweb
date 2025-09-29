const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { InfantPatient } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const router = express.Router();

// Get infant patient status counts
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
      FROM tbleimain i
      LEFT JOIN tblsitename s ON i._site_code = s.SiteCode
      LEFT JOIN tblevpatientstatus ps ON i.ClinicID = ps.ClinicID
      ${whereCondition}
      GROUP BY COALESCE(ps.Status, -1)
    `, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });
    
    // Get total count
    const totalResult = await sequelize.query(`
      SELECT COUNT(*) as total
      FROM tbleimain i
      LEFT JOIN tblsitename s ON i._site_code = s.SiteCode
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
    
    // Infant patients don't have TypeofReturn column, so set counts to 0
    counts.new = 0;
    counts.return_in = 0;
    counts.return_out = 0;
    
    res.json({
      success: true,
      counts: counts
    });
    
  } catch (error) {
    next(error);
  }
});

// Get all infant patients with search and pagination
router.get('/', [authenticateToken], async (req, res, next) => {
  try {
    const { page = 1, limit, search, clinicId, site, status } = req.query;
    
    // Smart pagination: only apply limit/offset if explicitly provided
    const limitNum = limit ? parseInt(limit) : null;
    const offset = limitNum ? (parseInt(page) - 1) * limitNum : 0;
    
    let whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { clinicId: { [Op.like]: `%${search}%` } },
        sequelize.where(
          sequelize.fn('CONCAT', 
            sequelize.fn('LPAD', sequelize.col('clinicId'), 10, '0')
          ), 
          { [Op.like]: `%${search}%` }
        )
      ];
    }
    
    if (clinicId) {
      whereClause.clinicId = clinicId;
    }
    
    // Build WHERE conditions for raw query
    const conditions = [];
    const replacements = {};
    
    if (search) {
      conditions.push('(i.ClinicID LIKE :search OR CONCAT(LPAD(i.ClinicID, 6, "0")) LIKE :search)');
      replacements.search = `%${search}%`;
    }
    
    if (clinicId) {
      conditions.push('i.ClinicID = :clinicId');
      replacements.clinicId = clinicId;
    }
    
    if (site) {
      conditions.push('s.NameEn = :site');
      replacements.site = site;
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
        conditions.push('i.TypeofReturn = -1'); // New patients
      } else if (status === 'return_in') {
        conditions.push('i.TypeofReturn = 0'); // Return In
      } else if (status === 'return_out') {
        conditions.push('i.TypeofReturn = 1'); // Return Out
      }
    }
    
    const whereCondition = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    // Get count first
    const countResult = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM tbleimain i
      LEFT JOIN tblsitename s ON i._site_code = s.SiteCode
      LEFT JOIN tblevpatientstatus ps ON i.ClinicID = ps.ClinicID
      ${whereCondition}
    `, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });
    const count = countResult[0].count;

    // Get patients with essential data only
    const rows = await sequelize.query(`
      SELECT 
        i.ClinicID as clinicId,
        i.DafirstVisit as dateFirstVisit,
        i.DaBirth as dateOfBirth,
        i.Sex as sex,
        i.AddGuardian as addGuardian,
        i.DeliveryStatus as deliveryStatus,
        i.Syrup as syrup,
        i.Offin as offIn,
        i._site_code as _site_code,
        s.NameEn as siteName,
        i.MArt as mArt,
        COALESCE(ps.Status, -1) as patientStatus,
        NULL as statusCause,
        ps.DaStatus as statusDate
      FROM tbleimain i
      LEFT JOIN tblsitename s ON i._site_code = s.SiteCode
      LEFT JOIN tblevpatientstatus ps ON i.ClinicID = ps.ClinicID
      ${whereCondition}
      ORDER BY i.ClinicID DESC
      ${limitNum ? `LIMIT ${limitNum} OFFSET ${offset}` : ''}
    `, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });

    // Format the data like the VB.NET ViewData function
    const formattedRows = rows.map((row, index) => ({
      no: offset + index + 1,
      clinicId: String(row.clinicId),
      dateFirst: row.dateFirstVisit || 'N/A',
      age: calculateAgeInMonths(row.dateOfBirth, row.dateFirstVisit),
      sex: row.sex === 0 ? 'Female' : row.sex === 1 ? 'Male' : 'Unknown',
      group: 'N/A', // Group field removed due to SQL syntax issues
      guardian: getGuardianText(row.addGuardian),
      deliveryStatus: getDeliveryStatusText(row.deliveryStatus),
      syrup: getSyrupText(row.syrup),
      transferIn: row.offIn === 1,
      _site_code: row._site_code || '',
      siteName: row.siteName || '',
      artNumber: row.mArt || '',
      lostReturn: 'N/A', // Infant patients don't have TypeofReturn column
      patientStatus: getPatientStatusText(row.patientStatus, null),
      patientStatusValue: row.patientStatus,
      statusCause: row.statusCause || '',
      statusDate: row.statusDate || ''
    }));

    res.json({
      patients: formattedRows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });

  } catch (error) {
    next(error);
  }
});

// Get single infant patient by clinic ID
router.get('/:clinicId', [
  authenticateToken,
  param('clinicId').isLength({ min: 1 }).withMessage('Clinic ID is required')
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
    const patient = await InfantPatient.findOne({
      where: { clinicId: clinicId }
    });

    if (!patient) {
      return res.status(404).json({
        error: 'Patient not found'
      });
    }

    res.json(patient.toJSON());

  } catch (error) {
    next(error);
  }
});

// Create new infant patient
router.post('/', [
  authenticateToken,
  requireRole(['admin', 'doctor', 'nurse']),
  
  // Validation matching VB.NET Save() function
  body('clinicId').notEmpty().withMessage('Please input Clinic ID!'),
  body('dateFirstVisit').isISO8601().withMessage('Please input Date First Visit'),
  body('sex').isIn([0, 1]).withMessage('Please Select Patient Sex!'),
  body('dateOfBirth').isISO8601().withMessage('Date of birth is required'),
  body('age').notEmpty().withMessage('Please Input Exposed Infant Age!'),
  body('mAge').notEmpty().withMessage('Please Input Mother Age!'),
  body('lenBaby').notEmpty().withMessage('Please Input Length of baby!'),
  body('wBaby').notEmpty().withMessage('Please Input Weight of baby!'),
  
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
      dateOfBirth,
      sex,
      addGuardian = -1,
      group = '',
      house = '',
      street = '',
      village = '',
      commune = '',
      district = '',
      province = '',
      nameContact = '',
      addressContact = '',
      phone = '',
      fAge = '',
      fHIV = -1,
      fStatus = -1,
      mAge = '',
      mClinicId = '',
      mArt = '',
      hospitalName = '',
      mStatus = -1,
      catPlaceDelivery = '',
      placeDelivery = '',
      pmtct = '',
      dateDelivery = '1900-01-01',
      deliveryStatus = -1,
      lenBaby = '',
      wBaby = '',
      knownHIV = -1,
      received = -1,
      syrup = -1,
      cotrim = -1,
      offIn = -1,
      siteName = '',
      hivTest = -1,
      mHIV = -1,
      mLastVl = '',
      dateMLastVl = '1900-01-01',
      eoClinicId = ''
    } = req.body;

    // Additional validation like in VB.NET
    const age = calculateAgeInMonths(dateOfBirth, dateFirstVisit);
    if (age < 0 || age > 24) {
      return res.status(400).json({
        error: 'Invalid Patient Age',
        message: 'Age must be 0-24 months for infant patients'
      });
    }

    if (dateFirstVisit < dateOfBirth) {
      return res.status(400).json({
        error: 'Invalid Register Date',
        message: 'Date of Birth should be equal to Date of Delivery'
      });
    }

    if (mHIV === 0) {
      if (!mClinicId.trim()) {
        return res.status(400).json({
          error: 'Mother ClinicID Required',
          message: 'Please Input Mother ClinicID!'
        });
      }
      if (!mArt.trim()) {
        return res.status(400).json({
          error: 'Mother ART Number Required',
          message: 'Please Input Mother ART Number!'
        });
      }
    }

    if (dateOfBirth !== dateDelivery) {
      return res.status(400).json({
        error: 'Date Mismatch',
        message: 'Date of Birth should be equal to Date of Delivery'
      });
    }

    // Start transaction like VB.NET
    const transaction = await sequelize.transaction();

    try {
      // Insert main record (tbleimain)
      const patient = await InfantPatient.create({
        clinicId: parseInt(clinicId),
        dateFirstVisit,
        dateOfBirth,
        sex,
        addGuardian,
        group,
        house,
        street,
        village,
        commune,
        district,
        province,
        nameContact,
        addressContact,
        phone,
        fAge: fAge ? parseInt(fAge) : null,
        fHIV,
        fStatus,
        mAge: mAge ? parseInt(mAge) : null,
        mClinicId: mClinicId ? parseInt(mClinicId) : null,
        mArt,
        hospitalName,
        mStatus,
        catPlaceDelivery,
        placeDelivery,
        pmtct,
        dateDelivery,
        deliveryStatus,
        lenBaby: lenBaby ? parseFloat(lenBaby) : null,
        wBaby: wBaby ? parseFloat(wBaby) : null,
        knownHIV,
        received,
        syrup,
        cotrim,
        offIn,
        siteName,
        hivTest,
        mHIV,
        mLastVl,
        dateMLastVl,
        eoClinicId
      }, { transaction });

      // Log the action
      await sequelize.query(`
        INSERT INTO tbllog (ClinicID, TableName, Action, DateTime) 
        VALUES (?, 'tblEImain', '1', NOW())
      `, {
        replacements: [clinicId],
        transaction
      });

      await transaction.commit();

      res.status(201).json({
        message: 'Infant patient created successfully',
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

// Update infant patient
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
    const patient = await InfantPatient.findOne({
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

      // Log the action
      await sequelize.query(`
        INSERT INTO tbllog (ClinicID, TableName, Action, DateTime) 
        VALUES (?, 'tblEImain', '2', NOW())
      `, {
        replacements: [clinicId],
        transaction
      });

      await transaction.commit();

      res.json({
        message: 'Infant patient updated successfully',
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

// Delete infant patient
router.delete('/:clinicId', [
  authenticateToken,
  requireRole(['admin']),
  param('clinicId').isNumeric().withMessage('Clinic ID must be numeric')
], async (req, res, next) => {
  try {
    const { clinicId } = req.params;

    const transaction = await sequelize.transaction();

    try {
      // Delete main record
      await sequelize.query(`DELETE FROM tbleimain WHERE ClinicID = ?`, {
        replacements: [clinicId],
        transaction
      });

      // Log the action
      await sequelize.query(`
        INSERT INTO tbllog (ClinicID, TableName, Action, DateTime) 
        VALUES (?, 'tblEImain', '3', NOW())
      `, {
        replacements: [clinicId],
        transaction
      });

      await transaction.commit();

      res.json({
        message: 'Infant patient deleted successfully'
      });

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  } catch (error) {
    next(error);
  }
});

// Helper functions
function calculateAgeInMonths(dateOfBirth, dateFirstVisit) {
  if (!dateOfBirth || !dateFirstVisit) return 'N/A';
  
  const birth = new Date(dateOfBirth);
  const visit = new Date(dateFirstVisit);
  
  if (isNaN(birth.getTime()) || isNaN(visit.getTime())) return 'N/A';
  
  const ageInMonths = (visit.getFullYear() - birth.getFullYear()) * 12 + 
                     (visit.getMonth() - birth.getMonth());
  
  if (ageInMonths < 0) return 'N/A';
  
  return ageInMonths;
}

function getDeliveryStatusText(status) {
  const statusOptions = {
    0: 'Normal',
    1: 'Complicated',
    2: 'Unknown'
  };
  return statusOptions[status] || '';
}

function getSyrupText(syrup) {
  const syrupOptions = {
    0: 'No',
    1: 'Yes'
  };
  return syrupOptions[syrup] || '';
}

function getGuardianText(guardian) {
  const guardianOptions = {
    0: 'No',
    1: 'Yes'
  };
  return guardianOptions[guardian] || 'N/A';
}

// Helper function to get patient status text
function getPatientStatusText(patientStatus, typeOfReturn) {
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
}

module.exports = router;
