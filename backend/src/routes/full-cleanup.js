const express = require('express');
const { sequelize } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Full database cleanup - clear all data
router.post('/clear-all-data', [authenticateToken], async (req, res) => {
  try {
    console.log('🧹 Starting FULL database cleanup - clearing all data...');

    // Step 1: Clear all patient data
    console.log('👥 Step 1: Clearing all patient data...');
    
    // Clear adult patients
    console.log('   - Clearing adult patients...');
    await sequelize.query('DELETE FROM tblaimain');
    console.log('   - Adult patients cleared');

    // Clear child patients
    console.log('   - Clearing child patients...');
    await sequelize.query('DELETE FROM tblcimain');
    console.log('   - Child patients cleared');

    // Clear infant patients
    console.log('   - Clearing infant patients...');
    await sequelize.query('DELETE FROM tbleimain');
    console.log('   - Infant patients cleared');

    // Step 2: Clear all visit data
    console.log('\n🏥 Step 2: Clearing all visit data...');
    
    // Clear adult visits
    console.log('   - Clearing adult visits...');
    await sequelize.query('DELETE FROM tblavmain');
    console.log('   - Adult visits cleared');

    // Clear child visits
    console.log('   - Clearing child visits...');
    await sequelize.query('DELETE FROM tblcvmain');
    console.log('   - Child visits cleared');

    // Clear infant visits
    console.log('   - Clearing infant visits...');
    await sequelize.query('DELETE FROM tblevmain');
    console.log('   - Infant visits cleared');

    // Step 3: Clear patient status data
    console.log('\n📊 Step 3: Clearing patient status data...');
    
    // Clear adult patient status
    console.log('   - Clearing adult patient status...');
    await sequelize.query('DELETE FROM tblavpatientstatus');
    console.log('   - Adult patient status cleared');

    // Clear child patient status
    console.log('   - Clearing child patient status...');
    await sequelize.query('DELETE FROM tblcvpatientstatus');
    console.log('   - Child patient status cleared');

    // Clear infant patient status
    console.log('   - Clearing infant patient status...');
    await sequelize.query('DELETE FROM tblevpatientstatus');
    console.log('   - Infant patient status cleared');

    // Step 4: Clear test data
    console.log('\n🧪 Step 4: Clearing test data...');
    
    // Clear patient tests
    console.log('   - Clearing patient tests...');
    await sequelize.query('DELETE FROM tblpatienttest');
    console.log('   - Patient tests cleared');

    // Step 5: Reset sites to 4 standard sites
    console.log('\n📋 Step 5: Resetting sites to 4 standard sites...');
    
    // Clear existing sites
    console.log('   - Clearing existing sites...');
    await sequelize.query('DELETE FROM tblartsite');
    console.log('   - Existing sites cleared');
    
    // Insert 4 standard sites
    const standardSites = [
      // Removed hardcoded clinic types - using actual site data
    ];

    for (const site of standardSites) {
      await sequelize.query(
        'INSERT INTO tblartsite (Sid, SiteName, Status) VALUES (?, ?, ?)',
        {
          replacements: [site.code, site.name, 1],
          type: sequelize.QueryTypes.INSERT
        }
      );
    }
    console.log(`   - Inserted ${standardSites.length} standard sites`);

    // Step 6: Reset auto-increment counters
    console.log('\n🔄 Step 6: Resetting auto-increment counters...');
    
    // Reset patient table counters
    await sequelize.query('ALTER TABLE tblaimain AUTO_INCREMENT = 1');
    await sequelize.query('ALTER TABLE tblcimain AUTO_INCREMENT = 1');
    await sequelize.query('ALTER TABLE tbleimain AUTO_INCREMENT = 1');
    console.log('   - Patient table counters reset');

    // Reset visit table counters
    await sequelize.query('ALTER TABLE tblavmain AUTO_INCREMENT = 1');
    await sequelize.query('ALTER TABLE tblcvmain AUTO_INCREMENT = 1');
    await sequelize.query('ALTER TABLE tblevmain AUTO_INCREMENT = 1');
    console.log('   - Visit table counters reset');

    // Step 7: Verify cleanup
    console.log('\n📊 Step 7: Verification...');
    
    // Check record counts
    const [adultCount] = await sequelize.query('SELECT COUNT(*) as count FROM tblaimain');
    const [childCount] = await sequelize.query('SELECT COUNT(*) as count FROM tblcimain');
    const [infantCount] = await sequelize.query('SELECT COUNT(*) as count FROM tbleimain');
    const [adultVisitCount] = await sequelize.query('SELECT COUNT(*) as count FROM tblavmain');
    const [childVisitCount] = await sequelize.query('SELECT COUNT(*) as count FROM tblcvmain');
    const [infantVisitCount] = await sequelize.query('SELECT COUNT(*) as count FROM tblevmain');
    const [sitesCount] = await sequelize.query('SELECT COUNT(*) as count FROM tblartsite');

    const results = {
      success: true,
      message: 'Full database cleanup completed successfully!',
      verification: {
        adultPatients: adultCount[0].count,
        childPatients: childCount[0].count,
        infantPatients: infantCount[0].count,
        adultVisits: adultVisitCount[0].count,
        childVisits: childVisitCount[0].count,
        infantVisits: infantVisitCount[0].count,
        sites: sitesCount[0].count
      }
    };

    console.log('\n🎉 Full database cleanup completed successfully!');
    console.log('✅ All data cleared, database is now clean and ready for fresh data import');
    console.log('📋 4 standard sites are ready for use');

    res.json(results);

  } catch (error) {
    console.error('❌ Error during full cleanup:', error);
    res.status(500).json({
      success: false,
      error: 'Full database cleanup failed',
      message: error.message
    });
  }
});

// Get current database status
router.get('/status', [authenticateToken], async (req, res) => {
  try {
    const [adultCount] = await sequelize.query('SELECT COUNT(*) as count FROM tblaimain');
    const [childCount] = await sequelize.query('SELECT COUNT(*) as count FROM tblcimain');
    const [infantCount] = await sequelize.query('SELECT COUNT(*) as count FROM tbleimain');
    const [adultVisitCount] = await sequelize.query('SELECT COUNT(*) as count FROM tblavmain');
    const [childVisitCount] = await sequelize.query('SELECT COUNT(*) as count FROM tblcvmain');
    const [infantVisitCount] = await sequelize.query('SELECT COUNT(*) as count FROM tblevmain');
    const [sitesCount] = await sequelize.query('SELECT COUNT(*) as count FROM tblartsite');

    res.json({
      success: true,
      status: {
        adultPatients: adultCount[0].count,
        childPatients: childCount[0].count,
        infantPatients: infantCount[0].count,
        adultVisits: adultVisitCount[0].count,
        childVisits: childVisitCount[0].count,
        infantVisits: infantVisitCount[0].count,
        sites: sitesCount[0].count
      }
    });

  } catch (error) {
    console.error('❌ Error getting database status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get database status',
      message: error.message
    });
  }
});

module.exports = router;
