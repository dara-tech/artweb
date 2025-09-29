const express = require('express');
const { sequelize } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Simple cleanup - only standardize site_code values
router.post('/clean-site-codes', [authenticateToken], async (req, res) => {
  try {
    console.log('🧹 Starting simple site code cleanup...');

    // Step 1: Standardize site_code values to only 2101, 2102, 2103, 2104
    console.log('📋 Step 1: Standardizing site_code values...');
    
    // Adult patients
    console.log('   - Cleaning adult patients...');
    const [adultResult] = await sequelize.query(`
      UPDATE tblaimain 
      SET site_code = CASE 
        WHEN site_code IS NULL OR site_code = '' THEN '2101'
        WHEN site_code NOT IN ('2101', '2102', '2103', '2104') THEN '2101'
        ELSE site_code
      END
    `);
    console.log(`   - Updated adult patients`);

    // Child patients
    console.log('   - Cleaning child patients...');
    const [childResult] = await sequelize.query(`
      UPDATE tblcimain 
      SET site_code = CASE 
        WHEN site_code IS NULL OR site_code = '' THEN '2101'
        WHEN site_code NOT IN ('2101', '2102', '2103', '2104') THEN '2101'
        ELSE site_code
      END
    `);
    console.log(`   - Updated child patients`);

    // Infant patients
    console.log('   - Cleaning infant patients...');
    const [infantResult] = await sequelize.query(`
      UPDATE tbleimain 
      SET site_code = CASE 
        WHEN site_code IS NULL OR site_code = '' THEN '2101'
        WHEN site_code NOT IN ('2101', '2102', '2103', '2104') THEN '2101'
        ELSE site_code
      END
    `);
    console.log(`   - Updated infant patients`);

    // Adult visits
    console.log('   - Cleaning adult visits...');
    const [adultVisitResult] = await sequelize.query(`
      UPDATE tblavmain 
      SET site_code = CASE 
        WHEN site_code IS NULL OR site_code = '' THEN '2101'
        WHEN site_code NOT IN ('2101', '2102', '2103', '2104') THEN '2101'
        ELSE site_code
      END
    `);
    console.log(`   - Updated adult visits`);

    // Child visits
    console.log('   - Cleaning child visits...');
    const [childVisitResult] = await sequelize.query(`
      UPDATE tblcvmain 
      SET site_code = CASE 
        WHEN site_code IS NULL OR site_code = '' THEN '2101'
        WHEN site_code NOT IN ('2101', '2102', '2103', '2104') THEN '2101'
        ELSE site_code
      END
    `);
    console.log(`   - Updated child visits`);

    // Infant visits
    console.log('   - Cleaning infant visits...');
    const [infantVisitResult] = await sequelize.query(`
      UPDATE tblevmain 
      SET site_code = CASE 
        WHEN site_code IS NULL OR site_code = '' THEN '2101'
        WHEN site_code NOT IN ('2101', '2102', '2103', '2104') THEN '2101'
        ELSE site_code
      END
    `);
    console.log(`   - Updated infant visits`);

    // Step 2: Get final distribution
    console.log('\n📊 Step 2: Final Distribution...');
    
    const [adultDist] = await sequelize.query(`
      SELECT site_code, COUNT(*) as count 
      FROM tblaimain 
      GROUP BY site_code 
      ORDER BY site_code
    `);

    const [childDist] = await sequelize.query(`
      SELECT site_code, COUNT(*) as count 
      FROM tblcimain 
      GROUP BY site_code 
      ORDER BY site_code
    `);

    const [infantDist] = await sequelize.query(`
      SELECT site_code, COUNT(*) as count 
      FROM tbleimain 
      GROUP BY site_code 
      ORDER BY site_code
    `);

    const [adultVisitDist] = await sequelize.query(`
      SELECT site_code, COUNT(*) as count 
      FROM tblavmain 
      GROUP BY site_code 
      ORDER BY site_code
    `);

    const [childVisitDist] = await sequelize.query(`
      SELECT site_code, COUNT(*) as count 
      FROM tblcvmain 
      GROUP BY site_code 
      ORDER BY site_code
    `);

    const [infantVisitDist] = await sequelize.query(`
      SELECT site_code, COUNT(*) as count 
      FROM tblevmain 
      GROUP BY site_code 
      ORDER BY site_code
    `);

    const results = {
      success: true,
      message: 'Site code cleanup completed successfully!',
      distribution: {
        adultPatients: adultDist,
        childPatients: childDist,
        infantPatients: infantDist,
        adultVisits: adultVisitDist,
        childVisits: childVisitDist,
        infantVisits: infantVisitDist
      }
    };

    console.log('\n🎉 Site code cleanup completed successfully!');
    console.log('✅ All site_code values standardized to 2101, 2102, 2103, 2104');

    res.json(results);

  } catch (error) {
    console.error('❌ Error during site code cleanup:', error);
    res.status(500).json({
      success: false,
      error: 'Site code cleanup failed',
      message: error.message
    });
  }
});

module.exports = router;
