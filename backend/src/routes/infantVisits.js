const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { InfantVisit } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { sequelize } = require('../config/database');

const router = express.Router();

// Get all infant visits (for visit list)
router.get('/', [authenticateToken], async (req, res, next) => {
  try {
    const { page = 1, limit, search, sortBy = 'visitDate', sortOrder = 'DESC', site, ageRange, dateRange, nationality } = req.query;
    const limitNum = limit ? parseInt(limit) : 50; // Default to 50 items per page
    const offset = (parseInt(page) - 1) * limitNum;

    let whereClause = {};
    
    // Add search functionality
    if (search) {
      whereClause = {
        [Op.or]: [
          { clinicId: { [Op.like]: `%${search}%` } },
          { artNumber: { [Op.like]: `%${search}%` } },
          { visitDate: { [Op.like]: `%${search}%` } },
          { targetGroup: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    // Validate sortBy field and map to actual database column names
    const fieldMapping = {
      'visitDate': 'DatVisit',
      'clinicId': 'ClinicID', 
      'artNumber': 'ClinicID', // Use ClinicID as fallback since ARTnum doesn't exist
      'weight': 'Weight',
      'whoStage': 'ClinicID', // Use ClinicID as fallback since WHO doesn't exist
      'hivViral': 'ClinicID', // Use ClinicID as fallback since ReVL doesn't exist
      'visitId': 'Vid'
    };
    const allowedSortFields = ['visitDate', 'clinicId', 'artNumber', 'weight', 'whoStage', 'hivViral', 'visitId'];
    const sortField = allowedSortFields.includes(sortBy) ? fieldMapping[sortBy] : 'DatVisit';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Use raw SQL to include patient status and VL data
    let whereConditions = [];
    
    if (search) {
      whereConditions.push(`(v.ClinicID LIKE '%${search}%' OR v.ARTnum LIKE '%${search}%' OR v.DatVisit LIKE '%${search}%' OR v.TestID LIKE '%${search}%')`);
    }
    
    if (site) {
      whereConditions.push(`v._site_code = '${site}'`);
    }
    
    // Add status filter condition
    if (req.query.statusFilter && req.query.statusFilter !== 'all') {
      const statusFilter = req.query.statusFilter.toLowerCase();
      switch (statusFilter) {
        case 'active':
          whereConditions.push(`(COALESCE(ps.Status, -1) = -1 OR ps.Status IS NULL)`);
          break;
        case 'lost':
          whereConditions.push(`COALESCE(ps.Status, -1) = 0`);
          break;
        case 'dead':
          whereConditions.push(`COALESCE(ps.Status, -1) = 1`);
          break;
        case 'transferred out':
          whereConditions.push(`COALESCE(ps.Status, -1) = 3`);
          break;
      }
    }
    
    // Add age range filter condition
    if (ageRange && ageRange !== 'all') {
      switch (ageRange) {
        case '0-1':
          whereConditions.push(`TIMESTAMPDIFF(MONTH, p.DaBirth, v.DatVisit) BETWEEN 0 AND 12`);
          break;
        case '1-2':
          whereConditions.push(`TIMESTAMPDIFF(MONTH, p.DaBirth, v.DatVisit) BETWEEN 13 AND 24`);
          break;
        case '2-5':
          whereConditions.push(`TIMESTAMPDIFF(YEAR, p.DaBirth, v.DatVisit) BETWEEN 2 AND 5`);
          break;
        case '5-10':
          whereConditions.push(`TIMESTAMPDIFF(YEAR, p.DaBirth, v.DatVisit) BETWEEN 5 AND 10`);
          break;
        case '10+':
          whereConditions.push(`TIMESTAMPDIFF(YEAR, p.DaBirth, v.DatVisit) > 10`);
          break;
      }
    }
    
    // Add date range filter condition
    if (dateRange && dateRange !== 'all') {
      switch (dateRange) {
        case 'today':
          whereConditions.push(`DATE(v.DatVisit) = CURDATE()`);
          break;
        case 'week':
          whereConditions.push(`v.DatVisit >= DATE_SUB(NOW(), INTERVAL 1 WEEK)`);
          break;
        case 'month':
          whereConditions.push(`v.DatVisit >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`);
          break;
        case 'year':
          whereConditions.push(`v.DatVisit >= DATE_SUB(NOW(), INTERVAL 1 YEAR)`);
          break;
      }
    }
    
    const whereCondition = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as count
      FROM tblevmain v
      LEFT JOIN tbleimain p ON v.ClinicID = p.ClinicID
      LEFT JOIN tblevpatientstatus ps ON v.ClinicID = ps.ClinicID
      ${whereCondition}
    `;
    const countResult = await sequelize.query(countQuery, {
      type: sequelize.QueryTypes.SELECT
    });
    const total = countResult[0].count;

    // Get visits with latest VL data from tblpatienttest, age calculation, and patient status
    const visitsQuery = `
      SELECT 
        v.ClinicID as clinicId,
        NULL as artNumber,
        v.DatVisit as visitDate,
        v.TypeVisit as visitStatus,
        v.Weight as weight,
        v.Height as height,
        NULL as whoStage,
        NULL as eligible,
        NULL as hivViral,
        '' as hivViralLog,
        NULL as cd4,
        v.Vid as visitId,
        v.DaApp as nextAppointment,
        v._site_code as _site_code,
        COALESCE(ps.Status, -1) as patientStatus,
        ps.Status as rawPatientStatus,
        ps.Da as patientStatusDate,
        NULL as statusPlace,
        NULL as statusOtherPlace,
        p.EOClinicID as statusCause,
        CASE 
          WHEN TIMESTAMPDIFF(YEAR, p.DaBirth, v.DatVisit) > 0 THEN TIMESTAMPDIFF(YEAR, p.DaBirth, v.DatVisit)
          ELSE TIMESTAMPDIFF(MONTH, p.DaBirth, v.DatVisit)
        END as age,
        p.Sex as sex
      FROM tblevmain v
      LEFT JOIN tbleimain p ON v.ClinicID = p.ClinicID
      LEFT JOIN (
        SELECT ClinicID, HIVLoad, HIVLog, Dat,
               ROW_NUMBER() OVER (PARTITION BY ClinicID ORDER BY Dat DESC) as rn
        FROM tblpatienttest
        WHERE HIVLoad IS NOT NULL AND HIVLoad != '' AND HIVLoad != '0'
      ) pt ON v.ClinicID = pt.ClinicID AND pt.rn = 1
      LEFT JOIN (
        SELECT ClinicID, Status, DaStatus as Da,
               ROW_NUMBER() OVER (PARTITION BY ClinicID ORDER BY DaStatus DESC) as rn
        FROM tblevpatientstatus
      ) ps ON v.ClinicID = ps.ClinicID AND ps.rn = 1
      ${whereCondition}
      ORDER BY v.${sortField} ${sortDirection}
      LIMIT ${limitNum} OFFSET ${offset}
    `;

    const visits = await sequelize.query(visitsQuery, {
      type: sequelize.QueryTypes.SELECT
    });

    // Map status values to readable text (matching old system)
    const statusMap = {
      '-1': 'Active',
      0: 'Lost',
      1: 'Dead', 
      3: 'Transferred Out'
    };

    // Get cause of death lookup
    const causeLookup = {};
    try {
      const causeData = await sequelize.query('SELECT ID, Ctype, Cause FROM tblcausedeath WHERE Status = 1', {
        type: sequelize.QueryTypes.SELECT
      });
      
      causeData.forEach(cause => {
        const key = `${cause.Ctype}/${cause.ID}`;
        causeLookup[key] = cause.Cause.trim();
      });
    } catch (error) {
      console.log('Error loading cause of death lookup:', error.message);
    }

    // Get ART site lookup for transferred out patients
    const artSiteLookup = {};
    try {
      const artSiteData = await sequelize.query('SELECT Sid, SiteName FROM tblartsite WHERE Status = 1', {
        type: sequelize.QueryTypes.SELECT
      });
      
      artSiteData.forEach(site => {
        artSiteLookup[site.Sid] = site.SiteName.trim();
      });
    } catch (error) {
      console.log('Error loading ART site lookup:', error.message);
    }

    const formattedVisits = visits.map(visit => {
      // Calculate age in months for status determination
      const ageInMonths = visit.age || 0;
      
      // Override status based on age (WHO guidelines)
      let finalStatus = visit.patientStatus;
      let statusText = statusMap[visit.patientStatus] || 'Active';
      
      // Age-based status override
      if (ageInMonths > 24) {
        finalStatus = 0; // Lost
        statusText = 'Lost (Age > 24 months)';
      } else if (ageInMonths <= 3) {
        finalStatus = -1; // Active
        statusText = 'Active (Under 3 months)';
      } else {
        finalStatus = -1; // Active
        statusText = 'Active';
      }
      
      // If patient is transferred out, use EOClinicID as status cause
      if (finalStatus === 3) {
        if (visit.statusCause && visit.statusCause !== '0' && visit.statusCause !== '') {
          // Look up ART site name
          const artSite = artSiteLookup[visit.statusCause];
          if (artSite) {
            statusText = artSite;
          } else {
            statusText = `Site ${visit.statusCause}`;
          }
        } else {
          statusText = 'Unknown Site';
        }
      }
      // If patient is dead, create advanced status display with cause and place
      else if (finalStatus === 1) {
        let causeText = '';
        let placeText = '';
        
        // Handle cause
        if (visit.statusCause) {
          const cause = visit.statusCause.toString().trim();
          
          if (cause === '' || cause === 'null' || cause === 'undefined') {
            causeText = 'Unknown cause';
          } else if (cause.includes('/')) {
            // Handle different code formats
            if (cause.endsWith('/')) {
              // Incomplete code like "0/" - show "Unknown cause"
              causeText = 'Unknown cause';
            } else if (causeLookup[cause]) {
              causeText = causeLookup[cause];
            } else {
              // Try to extract just the ID part for lookup
              const parts = cause.split('/');
              if (parts.length === 2 && parts[1]) {
                const fallbackKey = `0/${parts[1]}`;
                if (causeLookup[fallbackKey]) {
                  causeText = causeLookup[fallbackKey];
                } else {
                  causeText = 'Unknown cause';
                }
              } else {
                causeText = 'Unknown cause';
              }
            }
          } else {
            // Direct text (e.g., Khmer text) - use as is
            causeText = cause;
          }
        } else {
          causeText = 'Unknown cause';
        }
        
        // Handle place
        if (visit.statusPlace !== null && visit.statusPlace !== undefined && visit.statusPlace >= 0) {
          switch (visit.statusPlace) {
            case 0:
              placeText = ' (Home)';
              break;
            case 1:
              placeText = ' (Hospital)';
              break;
            case 2:
              placeText = visit.statusOtherPlace ? ` (${visit.statusOtherPlace})` : ' (Other)';
              break;
            default:
              placeText = '';
          }
        }
        
        // Combine cause and place
        statusText = causeText + placeText;
      }
      
      return {
        ...visit,
        patientStatus: statusText,
        rawPatientStatus: finalStatus
      };
    });

    res.json({
      visits: formattedVisits,
      total: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limitNum),
      limit: limitNum,
      hasNextPage: parseInt(page) < Math.ceil(total / limitNum),
      hasPrevPage: parseInt(page) > 1
    });
  } catch (error) {
    next(error);
  }
});

// Get all infant visits for a patient
router.get('/:clinicId', [authenticateToken], async (req, res, next) => {
  try {
    const { clinicId } = req.params;
    
    const visits = await InfantVisit.findAll({
      where: { clinicId },
      order: [['visitDate', 'DESC']],
      raw: true
    });

    res.json({ visits });
  } catch (error) {
    next(error);
  }
});

// Get a specific visit
router.get('/:clinicId/:visitId', [authenticateToken], async (req, res, next) => {
  try {
    const { clinicId, visitId } = req.params;
    
    const visit = await InfantVisit.findOne({
      where: { clinicId, visitId },
      raw: true
    });

    if (!visit) {
      return res.status(404).json({ error: 'Visit not found' });
    }

    res.json({ visit });
  } catch (error) {
    next(error);
  }
});

// Create a new visit
router.post('/', [
  authenticateToken,
  body('clinicId').notEmpty().withMessage('Clinic ID is required'),
  body('visitDate').isISO8601().withMessage('Valid visit date is required'),
  body('visitId').notEmpty().withMessage('Visit ID is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const visitData = req.body;
    
    // Check if visit already exists
    const existingVisit = await InfantVisit.findOne({
      where: { 
        clinicId: visitData.clinicId, 
        visitId: visitData.visitId 
      }
    });

    if (existingVisit) {
      return res.status(400).json({ error: 'Visit already exists' });
    }

    const visit = await InfantVisit.create(visitData);
    res.status(201).json({ visit });
  } catch (error) {
    next(error);
  }
});

// Update a visit
router.put('/:clinicId/:visitId', [
  authenticateToken,
  body('visitDate').optional().isISO8601().withMessage('Valid visit date is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clinicId, visitId } = req.params;
    const updateData = req.body;

    const [updatedRows] = await InfantVisit.update(updateData, {
      where: { clinicId, visitId }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Visit not found' });
    }

    const updatedVisit = await InfantVisit.findOne({
      where: { clinicId, visitId },
      raw: true
    });

    res.json({ visit: updatedVisit });
  } catch (error) {
    next(error);
  }
});

// Delete a visit
router.delete('/:clinicId/:visitId', [authenticateToken], async (req, res, next) => {
  try {
    const { clinicId, visitId } = req.params;

    const deletedRows = await InfantVisit.destroy({
      where: { clinicId, visitId }
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Visit not found' });
    }

    res.json({ message: 'Visit deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
