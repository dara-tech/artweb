const express = require('express');
const { sequelize } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Update site names
router.post('/update-names', [authenticateToken], async (req, res) => {
  try {
    const { sites } = req.body;
    
    if (!sites || !Array.isArray(sites)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide sites array with correct names'
      });
    }

    console.log('📝 Updating site names...');

    // Update each site
    for (const site of sites) {
      if (site.code && site.name) {
        await sequelize.query(
          'UPDATE tblartsite SET SiteName = ? WHERE Sid = ?',
          {
            replacements: [site.name, site.code],
            type: sequelize.QueryTypes.UPDATE
          }
        );
        console.log(`   - Updated ${site.code}: ${site.name}`);
      }
    }

    // Get updated sites
    const [updatedSites] = await sequelize.query(`
      SELECT Sid as code, SiteName as name, Status as status
      FROM tblartsite 
      ORDER BY Sid
    `);

    res.json({
      success: true,
      message: 'Site names updated successfully!',
      sites: updatedSites
    });

  } catch (error) {
    console.error('❌ Error updating site names:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update site names',
      message: error.message
    });
  }
});

// Get current site names
router.get('/current', [authenticateToken], async (req, res) => {
  try {
    const [sites] = await sequelize.query(`
      SELECT Sid as code, SiteName as name, Status as status
      FROM tblartsite 
      ORDER BY Sid
    `);

    res.json({
      success: true,
      sites: sites
    });

  } catch (error) {
    console.error('❌ Error getting current sites:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get current sites',
      message: error.message
    });
  }
});

module.exports = router;
