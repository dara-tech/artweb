const express = require('express');
const { siteDatabaseManager } = require('../config/siteDatabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all sites
router.get('/sites', authenticateToken, async (req, res) => {
  try {
    const sites = await siteDatabaseManager.getAllSites();
    res.json({ success: true, sites });
  } catch (error) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch sites',
      details: error.message 
    });
  }
});

// Get site information
router.get('/sites/:siteCode', authenticateToken, async (req, res) => {
  try {
    const { siteCode } = req.params;
    const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
    
    if (!siteInfo) {
      return res.status(404).json({ 
        success: false, 
        error: 'Site not found' 
      });
    }
    
    res.json({ success: true, site: siteInfo });
  } catch (error) {
    console.error('Error fetching site info:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch site information',
      details: error.message 
    });
  }
});

// Execute query on specific site database
router.post('/sites/:siteCode/query', authenticateToken, async (req, res) => {
  try {
    const { siteCode } = req.params;
    const { query, replacements = [] } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query is required' 
      });
    }
    
    // Validate site exists
    const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
    if (!siteInfo) {
      return res.status(404).json({ 
        success: false, 
        error: 'Site not found' 
      });
    }
    
    const results = await siteDatabaseManager.executeSiteQuery(siteCode, query, replacements);
    res.json({ success: true, results, site: siteInfo.name });
  } catch (error) {
    console.error('Error executing site query:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to execute query',
      details: error.message 
    });
  }
});

// Get database statistics for a site
router.get('/sites/:siteCode/stats', authenticateToken, async (req, res) => {
  try {
    const { siteCode } = req.params;
    
    // Validate site exists
    const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
    if (!siteInfo) {
      return res.status(404).json({ 
        success: false, 
        error: 'Site not found' 
      });
    }
    
    // Get table list
    const tablesQuery = 'SHOW TABLES';
    const tables = await siteDatabaseManager.executeSiteQuery(siteCode, tablesQuery);
    
    // Get record counts for each table
    const tableStats = [];
    let totalRecords = 0;
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      try {
        const countQuery = `SELECT COUNT(*) as count FROM \`${tableName}\``;
        const countResult = await siteDatabaseManager.executeSiteQuery(siteCode, countQuery);
        const recordCount = countResult[0].count;
        
        tableStats.push({
          table: tableName,
          records: recordCount
        });
        
        totalRecords += recordCount;
      } catch (err) {
        // Skip tables that can't be counted (views, etc.)
        tableStats.push({
          table: tableName,
          records: 'N/A',
          error: err.message
        });
      }
    }
    
    res.json({ 
      success: true, 
      site: siteInfo,
      stats: {
        totalTables: tables.length,
        totalRecords,
        tableStats
      }
    });
  } catch (error) {
    console.error('Error fetching site stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch site statistics',
      details: error.message 
    });
  }
});

// Test site database connection
router.get('/sites/:siteCode/test', authenticateToken, async (req, res) => {
  try {
    const { siteCode } = req.params;
    
    // Validate site exists
    const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
    if (!siteInfo) {
      return res.status(404).json({ 
        success: false, 
        error: 'Site not found' 
      });
    }
    
    // Test connection
    const connection = await siteDatabaseManager.getSiteConnection(siteCode);
    await connection.authenticate();
    
    res.json({ 
      success: true, 
      message: `Connection to ${siteInfo.name} database successful`,
      site: siteInfo
    });
  } catch (error) {
    console.error('Error testing site connection:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to connect to site database',
      details: error.message 
    });
  }
});

// Get site-specific indicators (placeholder for future implementation)
router.get('/sites/:siteCode/indicators', authenticateToken, async (req, res) => {
  try {
    const { siteCode } = req.params;
    const { indicatorId } = req.query;
    
    // Validate site exists
    const siteInfo = await siteDatabaseManager.getSiteInfo(siteCode);
    if (!siteInfo) {
      return res.status(404).json({ 
        success: false, 
        error: 'Site not found' 
      });
    }
    
    // For now, return a placeholder response
    // This would be implemented to run indicators on specific site databases
    res.json({ 
      success: true, 
      message: 'Site-specific indicators endpoint - to be implemented',
      site: siteInfo,
      indicatorId: indicatorId || 'all'
    });
  } catch (error) {
    console.error('Error fetching site indicators:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch site indicators',
      details: error.message 
    });
  }
});

module.exports = router;
