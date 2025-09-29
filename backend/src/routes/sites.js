const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all ART sites
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sites = await sequelize.query(`
      SELECT DISTINCT Sid as code, SiteName as name, Status as status
      FROM tblartsite 
      ORDER BY Sid
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      sites: sites,
      total: sites.length
    });
  } catch (error) {
    console.error('Get sites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sites',
      error: error.message
    });
  }
});

// Get active ART sites only
router.get('/active', authenticateToken, async (req, res) => {
  try {
    const sites = await sequelize.query(`
      SELECT Sid as code, SiteName as name
      FROM tblartsite 
      WHERE Status = 1
      ORDER BY Sid
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      sites: sites,
      total: sites.length
    });
  } catch (error) {
    console.error('Get active sites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get active sites',
      error: error.message
    });
  }
});

// Get sites by province
router.get('/province/:provinceCode', authenticateToken, async (req, res) => {
  try {
    const { provinceCode } = req.params;
    
    const sites = await sequelize.query(`
      SELECT Sid as code, SiteName as name, Status as status
      FROM tblartsite 
      WHERE Sid LIKE :provinceCode
      ORDER BY Sid
    `, {
      replacements: { provinceCode: `${provinceCode}%` },
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      sites: sites,
      total: sites.length,
      provinceCode: provinceCode
    });
  } catch (error) {
    console.error('Get sites by province error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sites by province',
      error: error.message
    });
  }
});

// Create new ART site
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { code, name, status = 1 } = req.body;

    // Validate required fields
    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: 'Site code and name are required'
      });
    }

    // Check if site code already exists
    const [existingSite] = await sequelize.query(`
      SELECT Sid FROM tblartsite WHERE Sid = :code
    `, {
      replacements: { code },
      type: sequelize.QueryTypes.SELECT
    });

    if (existingSite) {
      return res.status(400).json({
        success: false,
        message: 'Site code already exists'
      });
    }

    // Insert new site
    await sequelize.query(`
      INSERT INTO tblartsite (Sid, SiteName, Status) 
      VALUES (:code, :name, :status)
    `, {
      replacements: { code, name, status },
      type: sequelize.QueryTypes.INSERT
    });

    res.json({
      success: true,
      message: 'Site created successfully',
      site: { code, name, status }
    });

  } catch (error) {
    console.error('Create site error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create site',
      error: error.message
    });
  }
});

// Update ART site
router.put('/:code', authenticateToken, async (req, res) => {
  try {
    const { code } = req.params;
    const { name, status } = req.body;

    // Check if site exists
    const [existingSite] = await sequelize.query(`
      SELECT Sid FROM tblartsite WHERE Sid = :code
    `, {
      replacements: { code },
      type: sequelize.QueryTypes.SELECT
    });

    if (!existingSite) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    // Update site
    await sequelize.query(`
      UPDATE tblartsite 
      SET SiteName = :name, Status = :status 
      WHERE Sid = :code
    `, {
      replacements: { code, name, status },
      type: sequelize.QueryTypes.UPDATE
    });

    res.json({
      success: true,
      message: 'Site updated successfully',
      site: { code, name, status }
    });

  } catch (error) {
    console.error('Update site error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update site',
      error: error.message
    });
  }
});

// Delete ART site (soft delete - set status to 0)
router.delete('/:code', authenticateToken, async (req, res) => {
  try {
    const { code } = req.params;

    // Check if site exists
    const [existingSite] = await sequelize.query(`
      SELECT Sid FROM tblartsite WHERE Sid = :code
    `, {
      replacements: { code },
      type: sequelize.QueryTypes.SELECT
    });

    if (!existingSite) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    // Soft delete (set status to 0)
    await sequelize.query(`
      UPDATE tblartsite 
      SET Status = 0 
      WHERE Sid = :code
    `, {
      replacements: { code },
      type: sequelize.QueryTypes.UPDATE
    });

    res.json({
      success: true,
      message: 'Site deactivated successfully'
    });

  } catch (error) {
    console.error('Delete site error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete site',
      error: error.message
    });
  }
});

// Bulk create sites
router.post('/bulk', authenticateToken, async (req, res) => {
  try {
    const { sites } = req.body;

    if (!Array.isArray(sites) || sites.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Sites array is required'
      });
    }

    const results = {
      created: [],
      skipped: [],
      errors: []
    };

    for (const site of sites) {
      try {
        const { code, name, status = 1 } = site;

        if (!code || !name) {
          results.errors.push({
            site,
            error: 'Site code and name are required'
          });
          continue;
        }

        // Check if site already exists
        const [existingSite] = await sequelize.query(`
          SELECT Sid FROM tblartsite WHERE Sid = :code
        `, {
          replacements: { code },
          type: sequelize.QueryTypes.SELECT
        });

        if (existingSite) {
          results.skipped.push({
            code,
            name,
            reason: 'Site code already exists'
          });
          continue;
        }

        // Insert new site
        await sequelize.query(`
          INSERT INTO tblartsite (Sid, SiteName, Status) 
          VALUES (:code, :name, :status)
        `, {
          replacements: { code, name, status },
          type: sequelize.QueryTypes.INSERT
        });

        results.created.push({ code, name, status });

      } catch (error) {
        results.errors.push({
          site,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Bulk operation completed. Created: ${results.created.length}, Skipped: ${results.skipped.length}, Errors: ${results.errors.length}`,
      results
    });

  } catch (error) {
    console.error('Bulk create sites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk create sites',
      error: error.message
    });
  }
});

// Get sites that have data in the database
router.get('/with-data', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Getting sites with data...');
    
    // Get unique site codes from all existing patient tables
    const sitesWithData = await sequelize.query(`
      SELECT DISTINCT all_sites.site_code as code, 
             COALESCE(s.SiteName, CONCAT('Site ', all_sites.site_code)) as name,
             COALESCE(s.Status, 1) as status,
             COUNT(*) as patientCount
      FROM (
        SELECT site_code FROM tblaimain WHERE site_code IS NOT NULL AND site_code != ''
        UNION ALL
        SELECT site_code FROM tblcimain WHERE site_code IS NOT NULL AND site_code != ''
        UNION ALL
        SELECT site_code FROM tbleimain WHERE site_code IS NOT NULL AND site_code != ''
        UNION ALL
        SELECT site_code FROM tblavmain WHERE site_code IS NOT NULL AND site_code != ''
        UNION ALL
        SELECT site_code FROM tblcvmain WHERE site_code IS NOT NULL AND site_code != ''
        UNION ALL
        SELECT site_code FROM tblevmain WHERE site_code IS NOT NULL AND site_code != ''
        UNION ALL
        SELECT site_code FROM tblaart WHERE site_code IS NOT NULL AND site_code != ''
        UNION ALL
        SELECT site_code FROM tblcart WHERE site_code IS NOT NULL AND site_code != ''
        UNION ALL
        SELECT site_code FROM tblavpatientstatus WHERE site_code IS NOT NULL AND site_code != ''
        UNION ALL
        SELECT site_code FROM tblcvpatientstatus WHERE site_code IS NOT NULL AND site_code != ''
        UNION ALL
        SELECT site_code FROM tblevpatientstatus WHERE site_code IS NOT NULL AND site_code != ''
      ) all_sites
      LEFT JOIN tblartsite s ON s.Sid = all_sites.site_code
      GROUP BY all_sites.site_code, s.SiteName, s.Status
      HAVING patientCount > 0
      ORDER BY all_sites.site_code
    `, { type: sequelize.QueryTypes.SELECT });

    console.log(`✅ Found ${sitesWithData.length} sites with data`);

    res.json({
      success: true,
      sites: sitesWithData,
      total: sitesWithData.length
    });

  } catch (error) {
    console.error('Get sites with data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sites with data',
      error: error.message
    });
  }
});

// Get site statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [totalSites] = await sequelize.query(`
      SELECT COUNT(*) as total FROM tblartsite
    `, { type: sequelize.QueryTypes.SELECT });

    const [activeSites] = await sequelize.query(`
      SELECT COUNT(*) as active FROM tblartsite WHERE Status = 1
    `, { type: sequelize.QueryTypes.SELECT });

    const [inactiveSites] = await sequelize.query(`
      SELECT COUNT(*) as inactive FROM tblartsite WHERE Status = 0
    `, { type: sequelize.QueryTypes.SELECT });

    // Group by province
    const [provinceStats] = await sequelize.query(`
      SELECT 
        SUBSTRING(Sid, 1, 2) as provinceCode,
        COUNT(*) as siteCount
      FROM tblartsite 
      WHERE Status = 1
      GROUP BY SUBSTRING(Sid, 1, 2)
      ORDER BY provinceCode
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({
      success: true,
      statistics: {
        total: totalSites.total,
        active: activeSites.active,
        inactive: inactiveSites.inactive,
        byProvince: provinceStats
      }
    });

  } catch (error) {
    console.error('Get site stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get site statistics',
      error: error.message
    });
  }
});

module.exports = router;
