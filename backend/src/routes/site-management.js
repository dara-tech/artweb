const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { populateSites } = require('../../scripts/populate-sites');

// Populate all ART sites from JSON data
router.post('/populate', authenticateToken, async (req, res) => {
  try {
    console.log('Starting site population...');
    
    // Run the population script
    await populateSites();
    
    res.json({
      success: true,
      message: 'All ART sites have been populated successfully!'
    });
    
  } catch (error) {
    console.error('Site population error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to populate sites',
      error: error.message
    });
  }
});

// Get site statistics
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    // Total sites
    const [totalSites] = await sequelize.query(`
      SELECT COUNT(*) as total FROM tblsitename
    `, { type: sequelize.QueryTypes.SELECT });

    // Active sites
    const [activeSites] = await sequelize.query(`
      SELECT COUNT(*) as active FROM tblsitename WHERE Status = 1
    `, { type: sequelize.QueryTypes.SELECT });

    // Inactive sites
    const [inactiveSites] = await sequelize.query(`
      SELECT COUNT(*) as inactive FROM tblsitename WHERE Status = 0
    `, { type: sequelize.QueryTypes.SELECT });

    // Sites by province
    const [provinceStats] = await sequelize.query(`
      SELECT 
        SUBSTRING(SiteCode, 1, 2) as provinceCode,
        COUNT(*) as siteCount
      FROM tblsitename 
      WHERE Status = 1
      GROUP BY SUBSTRING(SiteCode, 1, 2)
      ORDER BY provinceCode
    `, { type: sequelize.QueryTypes.SELECT });

    // Sites by type (based on name patterns)
    const [typeStats] = await sequelize.query(`
      SELECT 
        CASE 
          WHEN NameEn LIKE '%PH%' THEN 'Provincial Hospital'
          WHEN NameEn LIKE '%RH%' THEN 'Referral Hospital'
          WHEN NameEn LIKE '%Hospital%' THEN 'Specialized Hospital'
          WHEN NameEn LIKE '%Clinic%' THEN 'Clinic'
          ELSE 'Other'
        END as siteType,
        COUNT(*) as count
      FROM tblsitename 
      WHERE Status = 1
      GROUP BY 
        CASE 
          WHEN NameEn LIKE '%PH%' THEN 'Provincial Hospital'
          WHEN NameEn LIKE '%RH%' THEN 'Referral Hospital'
          WHEN NameEn LIKE '%Hospital%' THEN 'Specialized Hospital'
          WHEN NameEn LIKE '%Clinic%' THEN 'Clinic'
          ELSE 'Other'
        END
      ORDER BY count DESC
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({
      success: true,
      statistics: {
        total: totalSites.total,
        active: activeSites.active,
        inactive: inactiveSites.inactive,
        byProvince: provinceStats,
        byType: typeStats
      }
    });

  } catch (error) {
    console.error('Get site statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get site statistics',
      error: error.message
    });
  }
});

// Export sites to JSON
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const sites = await sequelize.query(`
      SELECT SiteCode as code, NameEn as name, 1 as status
      FROM tblsitename 
      ORDER BY SiteCode
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    const exportData = {
      exportedAt: new Date().toISOString(),
      totalSites: sites.length,
      sites: sites
    };

    res.json({
      success: true,
      data: exportData
    });

  } catch (error) {
    console.error('Export sites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export sites',
      error: error.message
    });
  }
});

// Clear all sites (for testing)
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    await sequelize.query('DELETE FROM tblsitename');
    
    res.json({
      success: true,
      message: 'All sites have been cleared'
    });

  } catch (error) {
    console.error('Clear sites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear sites',
      error: error.message
    });
  }
});

module.exports = router;
