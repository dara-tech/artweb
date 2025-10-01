const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { ChildVisit } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { sequelize } = require('../config/database');
const { siteDatabaseManager } = require('../config/siteDatabase');
const { resolveSite } = require('../utils/siteUtils');

const router = express.Router();

// Get all child visits (for visit list)
router.get('/', async (req, res, next) => {
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
      'artNumber': 'ARTnum',
      'weight': 'Weight',
      'whoStage': 'WHO',
      'hivViral': 'ReVL',
      'visitId': 'Vid'
    };
    const allowedSortFields = ['visitDate', 'clinicId', 'artNumber', 'weight', 'whoStage', 'hivViral', 'visitId'];
    const sortField = allowedSortFields.includes(sortBy) ? fieldMapping[sortBy] : 'DatVisit';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Use raw SQL to include patient status and VL data
    let whereConditions = [];
    
    // Add search condition
    if (search) {
      whereConditions.push(`(v.ClinicID LIKE '%${search}%' OR v.ARTnum LIKE '%${search}%' OR v.DatVisit LIKE '%${search}%' OR v.TestID LIKE '%${search}%')`);
    }
    
    // Site filtering is handled by connecting to the correct site database
    // No need to filter by _site_code since we're already in the correct database
    
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
        case '0-17':
          whereConditions.push(`TIMESTAMPDIFF(YEAR, p.DaBirth, v.DatVisit) BETWEEN 0 AND 17`);
          break;
        case '18-24':
          whereConditions.push(`TIMESTAMPDIFF(YEAR, p.DaBirth, v.DatVisit) BETWEEN 18 AND 24`);
          break;
        case '25-34':
          whereConditions.push(`TIMESTAMPDIFF(YEAR, p.DaBirth, v.DatVisit) BETWEEN 25 AND 34`);
          break;
        case '35-44':
          whereConditions.push(`TIMESTAMPDIFF(YEAR, p.DaBirth, v.DatVisit) BETWEEN 35 AND 44`);
          break;
        case '45-54':
          whereConditions.push(`TIMESTAMPDIFF(YEAR, p.DaBirth, v.DatVisit) BETWEEN 45 AND 54`);
          break;
        case '55+':
          whereConditions.push(`TIMESTAMPDIFF(YEAR, p.DaBirth, v.DatVisit) >= 55`);
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

    // Determine which database(s) to use
    let siteCodes = [];
    
    // If site is provided, use specific site
    if (site) {
      try {
        const { siteCode: resolvedSiteCode } = await resolveSite(site);
        siteCodes = [resolvedSiteCode];
      } catch (error) {
        return res.status(404).json({
          error: 'Site not found',
          message: error.message,
          availableSites: (await siteDatabaseManager.getAllSites()).map(s => ({ 
            code: s.code, 
            name: s.display_name || s.short_name || s.name 
          }))
        });
      }
    } else {
      // If no site specified, query all available sites
      const allSites = await siteDatabaseManager.getAllSites();
      siteCodes = allSites.map(s => s.code);
    }

    // Get count from all sites
    let totalCount = 0;
    for (const siteCode of siteCodes) {
      const siteConnection = await siteDatabaseManager.getSiteConnection(siteCode);
      const countQuery = `
        SELECT COUNT(*) as count
        FROM tblcvmain v
        LEFT JOIN tblcimain p ON v.ClinicID = p.ClinicID
        LEFT JOIN tblcvpatientstatus ps ON v.ClinicID = ps.ClinicID
        WHERE 1=1
        ${whereCondition ? 'AND ' + whereCondition.replace('WHERE ', '') : ''}
      `;
      const countResult = await siteConnection.query(countQuery, {
        type: siteConnection.QueryTypes.SELECT
      });
      totalCount += countResult[0].count;
    }

    // Get visits from all sites
    let allVisits = [];
    for (const siteCode of siteCodes) {
      const siteConnection = await siteDatabaseManager.getSiteConnection(siteCode);
      const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
      const siteName = siteInfo?.display_name || siteInfo?.short_name || siteInfo?.name || siteCode;
      const visitsQuery = `
        SELECT 
          v.ClinicID as clinicId,
          v.ARTnum as artNumber,
          v.DatVisit as visitDate,
          v.TypeVisit as visitStatus,
          v.Weight as weight,
          v.Height as height,
          v.WHO as whoStage,
          v.Eligible as eligible,
          COALESCE(pt.HIVLoad, v.ReVL) as hivViral,
          COALESCE(pt.HIVLog, '') as hivViralLog,
          v.ReCD4 as cd4,
          v.Vid as visitId,
          v.DaApp as nextAppointment,
          COALESCE(ps.Status, -1) as patientStatus,
          ps.Status as rawPatientStatus,
          ps.Da as patientStatusDate,
          ps.Place as statusPlace,
          ps.OPlace as statusOtherPlace,
          ps.Cause as statusCause,
          TIMESTAMPDIFF(YEAR, p.DaBirth, v.DatVisit) as age,
          p.Sex as sex,
          p.ClinicID as patientId,
          NULL as notes,
          '${siteCode}' as siteCode,
          '${siteName}' as siteName
        FROM tblcvmain v
        LEFT JOIN tblcimain p ON v.ClinicID = p.ClinicID
        LEFT JOIN (
          SELECT ClinicID, HIVLoad, HIVLog, Dat,
                 ROW_NUMBER() OVER (PARTITION BY ClinicID ORDER BY Dat DESC) as rn
          FROM tblpatienttest
          WHERE HIVLoad IS NOT NULL AND HIVLoad != '' AND HIVLoad != '0'
        ) pt ON v.ClinicID = pt.ClinicID AND pt.rn = 1
        LEFT JOIN (
          SELECT ClinicID, Status, Da, Place, OPlace, Cause,
                 ROW_NUMBER() OVER (PARTITION BY ClinicID ORDER BY Da DESC) as rn
          FROM tblcvpatientstatus
        ) ps ON v.ClinicID = ps.ClinicID AND ps.rn = 1
        WHERE 1=1
        ${whereCondition ? 'AND ' + whereCondition.replace('WHERE ', '') : ''}
      `;

      const visits = await siteConnection.query(visitsQuery, {
        type: siteConnection.QueryTypes.SELECT
      });
      
      allVisits = allVisits.concat(visits);
    }
    
    // Sort all results and apply pagination
    allVisits.sort((a, b) => {
      if (sortBy === 'visitDate') {
        return sortOrder === 'asc' ? new Date(a.visitDate) - new Date(b.visitDate) : new Date(b.visitDate) - new Date(a.visitDate);
      }
      if (sortBy === 'clinicId') {
        return sortOrder === 'asc' ? a.clinicId - b.clinicId : b.clinicId - a.clinicId;
      }
      return new Date(b.visitDate) - new Date(a.visitDate);
    });
    
    const paginatedVisits = limitNum ? allVisits.slice(offset, offset + limitNum) : allVisits;

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
      const causeData = await siteConnection.query('SELECT ID, Ctype, Cause FROM tblcausedeath WHERE Status = 1', {
        type: siteConnection.QueryTypes.SELECT
      });
      
      causeData.forEach(cause => {
        const key = `${cause.Ctype}/${cause.ID}`;
        causeLookup[key] = cause.Cause.trim();
      });
    } catch (error) {
      console.log('Error loading cause of death lookup:', error.message);
    }

    const formattedVisits = paginatedVisits.map(visit => {
      // Use site information directly from the query results (from registry database)
      const artNumber = visit.artNumber || '';
      const extractedSiteCode = visit.siteCode || '';
      const siteName = visit.siteName || '';
      
      // Map sex values to readable text (-1=not selected, 0=Female, 1=Male)
      const sexMap = {
        1: 'Male',
        0: 'Female',
        '-1': 'Not Selected'
      };
      const sexText = sexMap[visit.sex] || 'Not Selected';
      
      // Map patient status values for Child Visits (-1=not selected, 0=Lost, 1=Dead, 3=Transferred out)
      const statusMap = {
        '-1': 'Active',
        '0': 'Lost',
        '1': 'Dead',
        '3': 'Transferred Out'
      };
      
      let statusText = statusMap[visit.patientStatus] || 'Active';
      
      // If patient is dead, create advanced status display with cause and place
      if (visit.patientStatus === 1) {
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
        siteName: siteName,
        site_code: extractedSiteCode,
        patientStatus: statusText,
        sex: sexText
      };
    });

    res.json({
      visits: formattedVisits,
      total: totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / limitNum),
      limit: limitNum,
      hasNextPage: parseInt(page) < Math.ceil(totalCount / limitNum),
      hasPrevPage: parseInt(page) > 1
    });
  } catch (error) {
    next(error);
  }
});

// Get all child visits for a patient
router.get('/:clinicId', [authenticateToken], async (req, res, next) => {
  try {
    const { clinicId } = req.params;
    
    const visits = await ChildVisit.findAll({
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
    
    const visit = await ChildVisit.findOne({
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
  body('artNumber').notEmpty().withMessage('ART Number is required'),
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
    const existingVisit = await ChildVisit.findOne({
      where: { 
        clinicId: visitData.clinicId, 
        visitId: visitData.visitId 
      }
    });

    if (existingVisit) {
      return res.status(400).json({ error: 'Visit already exists' });
    }

    const visit = await ChildVisit.create(visitData);
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

    const [updatedRows] = await ChildVisit.update(updateData, {
      where: { clinicId, visitId }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Visit not found' });
    }

    const updatedVisit = await ChildVisit.findOne({
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

    const deletedRows = await ChildVisit.destroy({
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
