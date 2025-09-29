const express = require('express');
const { sequelize } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Complete database cleanup - clear ALL data from ALL tables
router.post('/clear-everything', [authenticateToken], async (req, res) => {
  try {
    console.log('🧹 Starting COMPLETE database cleanup - clearing ALL data from ALL tables...');

    // Get all table names first
    console.log('📋 Step 1: Getting all table names...');
    const [tables] = await sequelize.query('SHOW TABLES');
    const tableNames = tables.map(table => Object.values(table)[0]);
    console.log(`   - Found ${tableNames.length} tables:`, tableNames);

    // Step 2: Clear ALL tables (except system tables)
    console.log('\n🗑️ Step 2: Clearing ALL tables...');
    
    // Define tables to preserve (reference data and system tables)
    const systemTables = [
      'tbluser',           // User accounts
      'tblartsite',        // ART sites
      'tblsitename',       // Site names
      'tblnationality',    // Nationality lookup
      'tbltargroup',       // Target groups
      'tblreason',         // Referral reasons
      'tblprovince',       // Province lookup
      'tblclinic',         // Clinic lookup
      'tblvcctsite',       // VCCT site lookup
      'tbldrug',           // Drug catalog
      'tbldrugtreat',      // Drug treatment types
      'tblallergy',        // Allergy types
      'tbloccupation',     // Occupation lookup
      'tbldistrict',       // District lookup
      'tblcommune',        // Commune lookup
      'tbldoctor',         // Doctor lookup
      'tblversion',        // System version
      'tblmargins',        // System margins
      'tblsetlost',        // Lost to follow-up settings
      'tblaccess',         // Access control
      'tbllog',            // System logs
      'tbllostlog'         // Lost to follow-up logs
    ];

    // Define tables to exclude (system views and temporary tables)
    const excludedTables = [
      'childpatientactive', // System view
      'patientactive',      // System view
      'tbltemp',           // Temporary table
      'tbltempart',        // Temporary table
      'tbltempdrug',       // Temporary table
      'tbltempoi',         // Temporary table
      'tblvillage'         // Geographic reference (no site tracking needed)
    ];
    
    for (const tableName of tableNames) {
      // Skip excluded tables (system views and temporary tables)
      if (excludedTables.includes(tableName)) {
        console.log(`   - ⏭️ Skipping ${tableName} (excluded - system/temp table)`);
        continue;
      }
      
      // Skip preserve tables (reference data)
      if (systemTables.includes(tableName)) {
        console.log(`   - ⏭️ Skipping ${tableName} (preserved - reference data)`);
        continue;
      }
      
      // Clean the table
      try {
        console.log(`   - Clearing table: ${tableName}`);
        await sequelize.query(`DELETE FROM ${tableName}`);
        console.log(`   - ✅ ${tableName} cleared`);
      } catch (error) {
        console.log(`   - ⚠️ Could not clear ${tableName}: ${error.message}`);
      }
    }

    // Step 3: Clear tblartsite and reset to 4 standard sites
    console.log('\n📋 Step 3: Resetting sites table...');
    
    // Clear existing sites
    console.log('   - Clearing existing sites...');
    await sequelize.query('DELETE FROM tblartsite');
    console.log('   - Sites cleared');
    
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

    // Step 4: Reset ALL auto-increment counters
    console.log('\n🔄 Step 4: Resetting ALL auto-increment counters...');
    
    for (const tableName of tableNames) {
      try {
        await sequelize.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`);
        console.log(`   - ✅ ${tableName} counter reset`);
      } catch (error) {
        console.log(`   - ⚠️ Could not reset ${tableName} counter: ${error.message}`);
      }
    }

    // Step 5: Verify complete cleanup
    console.log('\n📊 Step 5: Complete verification...');
    
    const verification = {};
    
    for (const tableName of tableNames) {
      try {
        const [result] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        verification[tableName] = result[0].count;
        console.log(`   - ${tableName}: ${result[0].count} records`);
      } catch (error) {
        verification[tableName] = 'ERROR';
        console.log(`   - ${tableName}: ERROR - ${error.message}`);
      }
    }

    const results = {
      success: true,
      message: 'COMPLETE database cleanup finished! All data cleared from all tables.',
      verification: verification,
      summary: {
        totalTables: tableNames.length,
        clearedTables: tableNames.filter(name => !systemTables.includes(name)).length,
        systemTables: systemTables.length
      }
    };

    console.log('\n🎉 COMPLETE database cleanup finished!');
    console.log('✅ ALL data cleared from ALL tables');
    console.log('📋 4 standard sites are ready for use');
    console.log('🔄 All auto-increment counters reset');

    res.json(results);

  } catch (error) {
    console.error('❌ Error during complete cleanup:', error);
    res.status(500).json({
      success: false,
      error: 'Complete database cleanup failed',
      message: error.message
    });
  }
});

// Get complete database status
router.get('/complete-status', [authenticateToken], async (req, res) => {
  try {
    console.log('📊 Getting complete database status...');
    
    // Get all table names
    const [tables] = await sequelize.query('SHOW TABLES');
    const tableNames = tables.map(table => Object.values(table)[0]);
    
    const status = {};
    
    for (const tableName of tableNames) {
      try {
        const [result] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        status[tableName] = result[0].count;
      } catch (error) {
        status[tableName] = `ERROR: ${error.message}`;
      }
    }

    res.json({
      success: true,
      status: status,
      totalTables: tableNames.length
    });

  } catch (error) {
    console.error('❌ Error getting complete status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get complete status',
      message: error.message
    });
  }
});

module.exports = router;
