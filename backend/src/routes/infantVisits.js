const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { InfantVisit } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { sequelize } = require('../config/database');
const { siteDatabaseManager } = require('../config/siteDatabase');
const { resolveSite } = require('../utils/siteUtils');

const router = express.Router();

// Get all infant visits (for visit list)
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
        FROM tblevmain v
        LEFT JOIN tbleimain p ON v.ClinicID = p.ClinicID
        LEFT JOIN tblevpatientstatus ps ON v.ClinicID = ps.ClinicID
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
          p.MArt as artNumber,
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
          p.Sex as sex,
          p.ClinicID as patientId,
          NULL as notes,
          '${siteCode}' as siteCode,
          '${siteName}' as siteName
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

    // Map status values to readable text for Infant Visits (0=Positive: Waiting for confirmatory test, 1=HIV(+) Register/Transfer to ART, 2=HIV(-), 3=Dead, 4=Lost)
    const statusMap = {
      '0': 'Positive: Waiting for confirmatory test',
      '1': 'HIV(+) Register/Transfer to ART',
      '2': 'HIV(-)',
      '3': 'Dead',
      '4': 'Lost'
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

    // Get ART site lookup for transferred out patients
    const artSiteLookup = {};
    try {
      const artSiteData = await siteConnection.query('SELECT Sid, SiteName FROM tblartsite WHERE Status = 1', {
        type: siteConnection.QueryTypes.SELECT
      });
      
      artSiteData.forEach(site => {
        artSiteLookup[site.Sid] = site.SiteName.trim();
      });
    } catch (error) {
      console.log('Error loading ART site lookup:', error.message);
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
        siteName: siteName,
        site_code: extractedSiteCode,
        patientStatus: statusText,
        rawPatientStatus: finalStatus,
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
