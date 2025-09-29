const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { siteDatabaseManager } = require('../config/siteDatabase');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Get all available audit reports
router.get('/reports', authenticateToken, async (req, res) => {
  try {
    const auditDir = path.join(__dirname, '../queries/audit');
    const files = fs.readdirSync(auditDir).filter(file => file.endsWith('.sql'));
    
    const reports = files.map(file => {
      const name = file.replace('.sql', '');
      const displayName = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return {
        id: name,
        name: displayName,
        filename: file
      };
    });

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Error getting audit reports:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Execute audit report for specific site
router.get('/reports/:reportId/sites/:siteCode', authenticateToken, async (req, res) => {
  try {
    const { reportId, siteCode } = req.params;
    const { startDate = '2025-01-01', endDate = '2025-03-31' } = req.query;

    // Validate site exists
    const site = await siteDatabaseManager.getSite(siteCode);
    if (!site) {
      return res.status(404).json({
        success: false,
        error: 'Site not found'
      });
    }

    // Load the audit query
    const queryPath = path.join(__dirname, '../queries/audit', `${reportId}.sql`);
    if (!fs.existsSync(queryPath)) {
      return res.status(404).json({
        success: false,
        error: 'Audit report not found'
      });
    }

    let query = fs.readFileSync(queryPath, 'utf8');
    
    // Replace date variables with actual dates
    query = query.replace(/@datestart='[^']*'/g, `@datestart='${startDate}'`);
    query = query.replace(/@datestope='[^']*'/g, `@datestope='${endDate}'`);

    // Execute the query
    const results = await siteDatabaseManager.executeSiteQuery(siteCode, query);

    res.json({
      success: true,
      data: {
        siteCode,
        reportId,
        startDate,
        endDate,
        results,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error executing audit report:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Execute audit report for all sites (aggregated)
router.get('/reports/:reportId/all-sites', authenticateToken, async (req, res) => {
  try {
    const { reportId } = req.params;
    const { startDate = '2025-01-01', endDate = '2025-03-31' } = req.query;

    // Load the audit query
    const queryPath = path.join(__dirname, '../queries/audit', `${reportId}.sql`);
    if (!fs.existsSync(queryPath)) {
      return res.status(404).json({
        success: false,
        error: 'Audit report not found'
      });
    }

    let query = fs.readFileSync(queryPath, 'utf8');
    
    // Replace date variables with actual dates
    query = query.replace(/@datestart='[^']*'/g, `@datestart='${startDate}'`);
    query = query.replace(/@datestope='[^']*'/g, `@datestope='${endDate}'`);

    // Get all sites
    const sites = await siteDatabaseManager.getAllSites();
    const allResults = [];

    for (const site of sites) {
      try {
        const results = await siteDatabaseManager.executeSiteQuery(site.code, query);
        allResults.push({
          siteCode: site.code,
          siteName: site.name,
          results
        });
      } catch (error) {
        console.error(`Error executing audit for site ${site.code}:`, error);
        allResults.push({
          siteCode: site.code,
          siteName: site.name,
          error: error.message,
          results: []
        });
      }
    }

    res.json({
      success: true,
      data: {
        reportId,
        startDate,
        endDate,
        sites: allResults,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error executing audit report for all sites:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get audit log entries (user actions)
router.get('/logs', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 50, siteCode, action, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    const replacements = [];

    if (siteCode) {
      whereClause += ' AND ClinicID = ?';
      replacements.push(siteCode);
    }

    if (action) {
      whereClause += ' AND Action = ?';
      replacements.push(action);
    }

    if (startDate) {
      whereClause += ' AND DateTime >= ?';
      replacements.push(startDate);
    }

    if (endDate) {
      whereClause += ' AND DateTime <= ?';
      replacements.push(endDate);
    }

    // Get logs from registry database
    const { sequelize } = require('../config/database');
    
    const logs = await sequelize.query(`
      SELECT 
        l.ClinicID,
        l.TableName,
        l.Action,
        l.DateTime,
        u.User as username,
        u.Fullname as fullName,
        CASE 
          WHEN l.Action = '1' THEN 'Created'
          WHEN l.Action = '2' THEN 'Updated'
          WHEN l.Action = '3' THEN 'Deleted'
          ELSE 'Unknown'
        END as actionDescription
      FROM tbllog l
      LEFT JOIN tbluser u ON l.UserID = u.Uid
      WHERE ${whereClause}
      ORDER BY l.DateTime DESC
      LIMIT ? OFFSET ?
    `, {
      replacements: [...replacements, parseInt(limit), parseInt(offset)],
      type: sequelize.QueryTypes.SELECT
    });

    // Get total count
    const countResult = await sequelize.query(`
      SELECT COUNT(*) as total
      FROM tbllog l
      WHERE ${whereClause}
    `, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error getting audit logs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
