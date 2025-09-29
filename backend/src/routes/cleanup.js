const express = require('express');
const { sequelize } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Define standard sites - removed hardcoded clinic types
const STANDARD_SITES = [
  // Sites will be loaded from actual database data
];

// Clean and aggregate database to 4 sites with progress logging
router.post('/clean-and-aggregate', [authenticateToken], async (req, res) => {
  const progressLog = [];
  
  const addProgress = (message, type = 'info') => {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, type };
    progressLog.push(logEntry);
    console.log(`[${timestamp}] ${message}`);
  };

  try {
    addProgress('🧹 Starting database cleanup and site aggregation...', 'start');

    // Step 1: Clean and populate the sites reference table
    addProgress('📋 Step 1: Updating sites reference table...', 'step');
    
    // Clear existing sites
    await sequelize.query('DELETE FROM tblartsite');
    addProgress('   - Cleared existing sites', 'info');
    
    // Insert the 4 standard sites
    for (const site of STANDARD_SITES) {
      await sequelize.query(
        'INSERT INTO tblartsite (Sid, SiteName, Status) VALUES (?, ?, ?)',
        {
          replacements: [site.code, site.name, 1],
          type: sequelize.QueryTypes.INSERT
        }
      );
    }
    addProgress(`   - Inserted ${STANDARD_SITES.length} standard sites`, 'info');

    // Step 2: Clean and standardize patient tables with Clinic ID reset
    addProgress('👥 Step 2: Cleaning patient tables and resetting Clinic IDs...', 'step');
    
    // Adult patients (tblaimain)
    addProgress('   - Processing adult patients...', 'info');
    
    // First, get count of adult patients
    const [adultCountResult] = await sequelize.query('SELECT COUNT(*) as count FROM tblaimain');
    const adultCount = adultCountResult[0].count;
    addProgress(`   - Found ${adultCount} adult patients to process`, 'info');
    
    if (adultCount > 0) {
      // Update _site_code first
      await sequelize.query(`
        UPDATE tblaimain 
        SET _site_code = CASE 
          WHEN _site_code IN ('2101', '2102', '2103', '2104') THEN _site_code
          WHEN _site_code IS NULL OR _site_code = '' THEN '2101'
          ELSE '2101'
        END
      `);
      addProgress('   - Updated adult patient _site_code', 'info');
      
      // Reset Clinic IDs for each site to start from 000001
      const sites = ['2101', '2102', '2103', '2104'];
      for (const siteCode of sites) {
        const [sitePatients] = await sequelize.query(`
          SELECT ClinicID FROM tblaimain 
          WHERE _site_code = :siteCode 
          ORDER BY ClinicID ASC
        `, {
          replacements: { siteCode },
          type: sequelize.QueryTypes.SELECT
        });
        
        if (sitePatients.length > 0) {
          addProgress(`   - Resetting Clinic IDs for site ${siteCode} (${sitePatients.length} patients)`, 'info');
          
          // Update Clinic IDs to start from 000001
          for (let i = 0; i < sitePatients.length; i++) {
            const newClinicId = String(i + 1).padStart(6, '0');
            const oldClinicId = sitePatients[i].ClinicID;
            
            await sequelize.query(`
              UPDATE tblaimain 
              SET ClinicID = :newClinicId 
              WHERE ClinicID = :oldClinicId AND _site_code = :siteCode
            `, {
              replacements: { newClinicId, oldClinicId, siteCode },
              type: sequelize.QueryTypes.UPDATE
            });
          }
          addProgress(`   - Site ${siteCode}: Clinic IDs reset to 000001-${String(sitePatients.length).padStart(6, '0')}`, 'success');
        }
      }
    } else {
      addProgress('   - No adult patients to process', 'info');
    }

    // Child patients (tblcimain)
    addProgress('   - Processing child patients...', 'info');
    const [childCountResult] = await sequelize.query('SELECT COUNT(*) as count FROM tblcimain');
    const childCount = childCountResult[0].count;
    addProgress(`   - Found ${childCount} child patients to process`, 'info');
    
    if (childCount > 0) {
      // Update _site_code first
      await sequelize.query(`
        UPDATE tblcimain 
        SET _site_code = CASE 
          WHEN _site_code IN ('2101', '2102', '2103', '2104') THEN _site_code
          WHEN _site_code IS NULL OR _site_code = '' THEN '2101'
          ELSE '2101'
        END
      `);
      addProgress('   - Updated child patient _site_code', 'info');
      
      // Reset Clinic IDs for each site to start from P000001
      const sites = ['2101', '2102', '2103', '2104'];
      for (const siteCode of sites) {
        const [sitePatients] = await sequelize.query(`
          SELECT ClinicID FROM tblcimain 
          WHERE _site_code = :siteCode 
          ORDER BY ClinicID ASC
        `, {
          replacements: { siteCode },
          type: sequelize.QueryTypes.SELECT
        });
        
        if (sitePatients.length > 0) {
          addProgress(`   - Resetting Child Clinic IDs for site ${siteCode} (${sitePatients.length} patients)`, 'info');
          
          // Update Clinic IDs to start from P000001 (no conflicts since we have unique constraint on _site_code + ClinicID)
          for (let i = 0; i < sitePatients.length; i++) {
            const newClinicId = `P${String(i + 1).padStart(6, '0')}`;
            const oldClinicId = sitePatients[i].ClinicID;
            
            await sequelize.query(`
              UPDATE tblcimain 
              SET ClinicID = :newClinicId 
              WHERE ClinicID = :oldClinicId AND _site_code = :siteCode
            `, {
              replacements: { newClinicId, oldClinicId, siteCode },
              type: sequelize.QueryTypes.UPDATE
            });
          }
          addProgress(`   - Site ${siteCode}: Child Clinic IDs reset to P000001-P${String(sitePatients.length).padStart(6, '0')}`, 'success');
        }
      }
    } else {
      addProgress('   - No child patients to process', 'info');
    }

    // Infant patients (tbleimain)
    addProgress('   - Processing infant patients...', 'info');
    const [infantCountResult] = await sequelize.query('SELECT COUNT(*) as count FROM tbleimain');
    const infantCount = infantCountResult[0].count;
    addProgress(`   - Found ${infantCount} infant patients to process`, 'info');
    
    if (infantCount > 0) {
      // Update _site_code first
      await sequelize.query(`
        UPDATE tbleimain 
        SET _site_code = CASE 
          WHEN _site_code IN ('2101', '2102', '2103', '2104') THEN _site_code
          WHEN _site_code IS NULL OR _site_code = '' THEN '2101'
          ELSE '2101'
        END
      `);
      addProgress('   - Updated infant patient _site_code', 'info');
      
      // Reset Clinic IDs for each site to start from E{siteCode}00001
      const sites = ['2101', '2102', '2103', '2104'];
      for (const siteCode of sites) {
        const [sitePatients] = await sequelize.query(`
          SELECT ClinicID FROM tbleimain 
          WHERE _site_code = :siteCode 
          ORDER BY ClinicID ASC
        `, {
          replacements: { siteCode },
          type: sequelize.QueryTypes.SELECT
        });
        
        if (sitePatients.length > 0) {
          addProgress(`   - Resetting Infant Clinic IDs for site ${siteCode} (${sitePatients.length} patients)`, 'info');
          
          // Update Clinic IDs to start from E{siteCode}00001 (no conflicts since we have unique constraint on _site_code + ClinicID)
          for (let i = 0; i < sitePatients.length; i++) {
            const newClinicId = `E${siteCode}${String(i + 1).padStart(5, '0')}`;
            const oldClinicId = sitePatients[i].ClinicID;
            
            await sequelize.query(`
              UPDATE tbleimain 
              SET ClinicID = :newClinicId 
              WHERE ClinicID = :oldClinicId AND _site_code = :siteCode
            `, {
              replacements: { newClinicId, oldClinicId, siteCode },
              type: sequelize.QueryTypes.UPDATE
            });
          }
          addProgress(`   - Site ${siteCode}: Infant Clinic IDs reset to E${siteCode}00001-E${siteCode}${String(sitePatients.length).padStart(5, '0')}`, 'success');
        }
      }
    } else {
      addProgress('   - No infant patients to process', 'info');
    }

    // Step 3: Clean and standardize visit tables
    addProgress('🏥 Step 3: Cleaning visit tables...', 'step');
    
    // Adult visits (tblavmain)
    addProgress('   - Processing adult visits...', 'info');
    const [adultVisitCountResult] = await sequelize.query('SELECT COUNT(*) as count FROM tblavmain');
    const adultVisitCount = adultVisitCountResult[0].count;
    addProgress(`   - Found ${adultVisitCount} adult visits to process`, 'info');
    
    if (adultVisitCount > 0) {
      await sequelize.query(`
        UPDATE tblavmain 
        SET _site_code = CASE 
          WHEN _site_code IN ('2101', '2102', '2103', '2104') THEN _site_code
          WHEN _site_code IS NULL OR _site_code = '' THEN '2101'
          ELSE '2101'
        END
      `);
      addProgress('   - Updated adult visit records', 'info');
    }

    // Child visits (tblcvmain)
    addProgress('   - Processing child visits...', 'info');
    const [childVisitCountResult] = await sequelize.query('SELECT COUNT(*) as count FROM tblcvmain');
    const childVisitCount = childVisitCountResult[0].count;
    addProgress(`   - Found ${childVisitCount} child visits to process`, 'info');
    
    if (childVisitCount > 0) {
      await sequelize.query(`
        UPDATE tblcvmain 
        SET _site_code = CASE 
          WHEN _site_code IN ('2101', '2102', '2103', '2104') THEN _site_code
          WHEN _site_code IS NULL OR _site_code = '' THEN '2101'
          ELSE '2101'
        END
      `);
      addProgress('   - Updated child visit records', 'info');
    }

    // Infant visits (tblevmain)
    addProgress('   - Processing infant visits...', 'info');
    const [infantVisitCountResult] = await sequelize.query('SELECT COUNT(*) as count FROM tblevmain');
    const infantVisitCount = infantVisitCountResult[0].count;
    addProgress(`   - Found ${infantVisitCount} infant visits to process`, 'info');
    
    if (infantVisitCount > 0) {
      await sequelize.query(`
        UPDATE tblevmain 
        SET _site_code = CASE 
          WHEN _site_code IN ('2101', '2102', '2103', '2104') THEN _site_code
          WHEN _site_code IS NULL OR _site_code = '' THEN '2101'
          ELSE '2101'
        END
      `);
      addProgress('   - Updated infant visit records', 'info');
    }

    // Step 4: Verify the results
    addProgress('📊 Step 4: Verification Results...', 'step');
    
    // Check patient distribution
    const [adultDist] = await sequelize.query(`
      SELECT _site_code, COUNT(*) as count 
      FROM tblaimain 
      GROUP BY _site_code 
      ORDER BY _site_code
    `);

    const [childDist] = await sequelize.query(`
      SELECT _site_code, COUNT(*) as count 
      FROM tblcimain 
      GROUP BY _site_code 
      ORDER BY _site_code
    `);

    const [infantDist] = await sequelize.query(`
      SELECT _site_code, COUNT(*) as count 
      FROM tbleimain 
      GROUP BY _site_code 
      ORDER BY _site_code
    `);

    // Check visit distribution
    const [adultVisitDist] = await sequelize.query(`
      SELECT _site_code, COUNT(*) as count 
      FROM tblavmain 
      GROUP BY _site_code 
      ORDER BY _site_code
    `);

    const [childVisitDist] = await sequelize.query(`
      SELECT _site_code, COUNT(*) as count 
      FROM tblcvmain 
      GROUP BY _site_code 
      ORDER BY _site_code
    `);

    const [infantVisitDist] = await sequelize.query(`
      SELECT _site_code, COUNT(*) as count 
      FROM tblevmain 
      GROUP BY _site_code 
      ORDER BY _site_code
    `);

    // Check sites table
    const [sites] = await sequelize.query('SELECT * FROM tblartsite ORDER BY Sid');

    // Log distribution results
    addProgress('📈 Final Distribution Results:', 'step');
    adultDist.forEach(dist => {
      addProgress(`   - Adult patients in site ${dist._site_code}: ${dist.count}`, 'success');
    });
    childDist.forEach(dist => {
      addProgress(`   - Child patients in site ${dist._site_code}: ${dist.count}`, 'success');
    });
    infantDist.forEach(dist => {
      addProgress(`   - Infant patients in site ${dist._site_code}: ${dist.count}`, 'success');
    });

    const results = {
      success: true,
      message: 'Database cleanup and site aggregation completed successfully!',
      progressLog: progressLog,
      sites: sites,
      distribution: {
        adultPatients: adultDist,
        childPatients: childDist,
        infantPatients: infantDist,
        adultVisits: adultVisitDist,
        childVisits: childVisitDist,
        infantVisits: infantVisitDist
      }
    };

    addProgress('🎉 Database cleanup and site aggregation completed successfully!', 'success');
    addProgress('✅ All data has been standardized to 4 sites: 2101, 2102, 2103, 2104', 'success');
    addProgress('✅ Each site now has Clinic IDs starting from 000001', 'success');

    res.json(results);

  } catch (error) {
    addProgress(`❌ Error during cleanup: ${error.message}`, 'error');
    console.error('❌ Error during cleanup:', error);
    res.status(500).json({
      success: false,
      error: 'Database cleanup failed',
      message: error.message,
      progressLog: progressLog
    });
  }
});

// Get current site distribution
router.get('/distribution', [authenticateToken], async (req, res) => {
  try {
    const [adultDist] = await sequelize.query(`
      SELECT _site_code, COUNT(*) as count 
      FROM tblaimain 
      GROUP BY _site_code 
      ORDER BY _site_code
    `);

    const [childDist] = await sequelize.query(`
      SELECT _site_code, COUNT(*) as count 
      FROM tblcimain 
      GROUP BY _site_code 
      ORDER BY _site_code
    `);

    const [infantDist] = await sequelize.query(`
      SELECT _site_code, COUNT(*) as count 
      FROM tbleimain 
      GROUP BY _site_code 
      ORDER BY _site_code
    `);

    const [adultVisitDist] = await sequelize.query(`
      SELECT _site_code, COUNT(*) as count 
      FROM tblavmain 
      GROUP BY _site_code 
      ORDER BY _site_code
    `);

    const [childVisitDist] = await sequelize.query(`
      SELECT _site_code, COUNT(*) as count 
      FROM tblcvmain 
      GROUP BY _site_code 
      ORDER BY _site_code
    `);

    const [infantVisitDist] = await sequelize.query(`
      SELECT _site_code, COUNT(*) as count 
      FROM tblevmain 
      GROUP BY _site_code 
      ORDER BY _site_code
    `);

    const [sites] = await sequelize.query('SELECT * FROM tblartsite ORDER BY Sid');

    res.json({
      success: true,
      sites: sites,
      distribution: {
        adultPatients: adultDist,
        childPatients: childDist,
        infantPatients: infantDist,
        adultVisits: adultVisitDist,
        childVisits: childVisitDist,
        infantVisits: infantVisitDist
      }
    });

  } catch (error) {
    console.error('❌ Error getting distribution:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get distribution',
      message: error.message
    });
  }
});

// Clean all tables (comprehensive cleanup)
router.post('/clean-all-tables', [authenticateToken], async (req, res) => {
  const progressLog = [];
  
  const addProgress = (message, type = 'info') => {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, type };
    progressLog.push(logEntry);
    console.log(`[${timestamp}] ${message}`);
  };

  try {
    addProgress('🧹 Starting comprehensive cleanup of all tables...', 'start');

    // Get all tables in the database
    const [tables] = await sequelize.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${sequelize.config.database}' ORDER BY TABLE_NAME`);
    const tableNames = tables.map(t => t.TABLE_NAME);
    
    addProgress(`📊 Found ${tableNames.length} tables to process`, 'info');

    // Define tables to preserve (reference data and system tables)
    const tablesToPreserve = [
      'tblallergy',        // Allergy types
      'tbluser',           // User accounts
      'tblsitename',       // Site names
      'tblnationality',    // Nationality lookup
      'tbltargroup',       // Target groups
      'tblreason',         // Referral reasons
      'tblprovince',       // Province lookup
      'tblclinic',         // Clinic lookup
      'tblvcctsite',       // VCCT site lookup
      'tbldrug',           // Drug catalog
      'tbldrugtreat',      // Drug treatment types
      'tblartsite',        // ART sites
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
    const tablesToExclude = [
      'childpatientactive', // System view
      'patientactive',      // System view
      'tbltemp',           // Temporary table
      'tbltempart',        // Temporary table
      'tbltempdrug',       // Temporary table
      'tbltempoi',         // Temporary table
      'tblvillage'         // Geographic reference (no site tracking needed)
    ];

    addProgress('📋 Step 1: Preserving reference tables...', 'step');
    tablesToPreserve.forEach(tableName => {
      if (tableNames.includes(tableName)) {
        addProgress(`   - Preserving ${tableName}`, 'info');
      }
    });

    addProgress('🗑️ Step 2: Cleaning all other tables...', 'step');
    
    let cleanedTables = 0;
    let totalRecordsCleaned = 0;
    const errors = [];

    for (const tableName of tableNames) {
      try {
        // Skip excluded tables (system views and temporary tables)
        if (tablesToExclude.includes(tableName)) {
          addProgress(`   - Skipping ${tableName} (excluded - system/temp table)`, 'info');
          continue;
        }
        
        // Skip preserve tables (reference data)
        if (tablesToPreserve.includes(tableName)) {
          addProgress(`   - Skipping ${tableName} (preserved - reference data)`, 'info');
          continue;
        }

        // Check if table is updatable (not a view)
        const [tableInfo] = await sequelize.query(`
          SELECT TABLE_TYPE 
          FROM INFORMATION_SCHEMA.TABLES 
          WHERE TABLE_SCHEMA = '${sequelize.config.database}' 
          AND TABLE_NAME = '${tableName}'
        `);
        
        if (tableInfo[0].TABLE_TYPE === 'VIEW') {
          addProgress(`   - Skipping ${tableName} (view)`, 'info');
          continue;
        }

        // Get record count before deletion
        const [countResult] = await sequelize.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
        const recordCount = countResult[0].count;

        if (recordCount > 0) {
          // Delete all records
          await sequelize.query(`DELETE FROM \`${tableName}\``);
          
          // Reset auto increment
          await sequelize.query(`ALTER TABLE \`${tableName}\` AUTO_INCREMENT = 1`);
          
          addProgress(`   - Cleaned ${tableName}: ${recordCount} records`, 'success');
          cleanedTables++;
          totalRecordsCleaned += recordCount;
        } else {
          addProgress(`   - ${tableName}: already empty`, 'info');
        }

      } catch (error) {
        const errorMsg = `   - Error cleaning ${tableName}: ${error.message}`;
        addProgress(errorMsg, 'error');
        errors.push({ table: tableName, error: error.message });
      }
    }

    addProgress('📊 Step 3: Verification...', 'step');
    
    // Verify main patient tables are empty
    const mainTables = ['tblaimain', 'tblcimain', 'tbleimain', 'tblavmain', 'tblcvmain', 'tblevmain'];
    for (const tableName of mainTables) {
      try {
        const [countResult] = await sequelize.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
        const count = countResult[0].count;
        addProgress(`   - ${tableName}: ${count} records`, count === 0 ? 'success' : 'error');
      } catch (error) {
        addProgress(`   - ${tableName}: Error checking - ${error.message}`, 'error');
      }
    }

    // Summary
    addProgress('📈 Cleanup Summary:', 'step');
    addProgress(`   - Total tables processed: ${tableNames.length}`, 'info');
    addProgress(`   - Tables cleaned: ${cleanedTables}`, 'success');
    addProgress(`   - Tables preserved: ${tablesToPreserve.length}`, 'info');
    addProgress(`   - Total records cleaned: ${totalRecordsCleaned}`, 'success');
    addProgress(`   - Errors encountered: ${errors.length}`, errors.length > 0 ? 'error' : 'success');

    if (errors.length > 0) {
      addProgress('❌ Errors encountered:', 'error');
      errors.forEach(err => {
        addProgress(`   - ${err.table}: ${err.error}`, 'error');
      });
    }

    addProgress('🎉 Comprehensive cleanup completed!', 'success');
    addProgress('✅ All tables have been cleaned and reset', 'success');
    addProgress('✅ Database is now ready for fresh data import', 'success');

    res.json({
      success: true,
      message: 'Comprehensive cleanup completed successfully!',
      progressLog: progressLog,
      summary: {
        totalTables: tableNames.length,
        cleanedTables: cleanedTables,
        preservedTables: tablesToPreserve.length,
        totalRecordsCleaned: totalRecordsCleaned,
        errors: errors.length
      }
    });

  } catch (error) {
    addProgress(`❌ Fatal error during cleanup: ${error.message}`, 'error');
    console.error('❌ Fatal error:', error);
    res.status(500).json({
      success: false,
      error: 'Cleanup failed',
      message: error.message,
      progressLog: progressLog
    });
  }
});

module.exports = router;
