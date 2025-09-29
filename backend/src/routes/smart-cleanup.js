const express = require('express');
const { sequelize } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Smart cleanup - only clean tables that require aggregation (have _site_code)
router.post('/clean-aggregation-tables', [authenticateToken], async (req, res) => {
  const progressLog = [];
  
  const addProgress = (message, type = 'info') => {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, type };
    progressLog.push(logEntry);
    console.log(`[${timestamp}] ${message}`);
  };

  try {
    addProgress('🧹 Starting SMART database cleanup - cleaning only aggregation tables...', 'start');

    // Step 1: Get all tables and identify which ones have _site_code
    addProgress('📋 Step 1: Identifying tables that require aggregation...', 'step');
    
    const [tables] = await sequelize.query('SHOW TABLES');
    const tableNames = tables.map(table => Object.values(table)[0]);
    
    const aggregationTables = [];
    const excludedTables = [];
    
    for (const tableName of tableNames) {
      try {
        const [columns] = await sequelize.query(`DESCRIBE ${tableName}`);
        const hasSiteCode = columns.some(col => col.Field === '_site_code');
        
        if (hasSiteCode) {
          aggregationTables.push(tableName);
        } else {
          excludedTables.push(tableName);
        }
      } catch (error) {
        addProgress(`   - ⚠️ Could not check ${tableName}: ${error.message}`, 'warning');
        excludedTables.push(tableName);
      }
    }
    
    addProgress(`   - Found ${aggregationTables.length} tables requiring aggregation`, 'info');
    addProgress(`   - Found ${excludedTables.length} tables to preserve (no _site_code)`, 'info');

    // Step 2: Define tables to preserve even if they have _site_code
    const preserveTables = [
      'tbluser',           // User accounts
      'tblartsite',        // Site information
      'tblsitename',       // Site names
      'tblnationality',    // Nationality lookup
      'tblprovince',       // Province lookup
      'tblclinic',         // Clinic lookup
      'tblvcctsite',       // VCCT site lookup
      'tbldrug',           // Drug catalog
      'tbldrugtreat',      // Drug treatment types
      'tblreason',         // Referral reasons
      'tblallergy',        // Allergy types
      'tbltargroup',       // Target groups
      'tbloccupation',     // Occupation lookup
      'tbldistrict',       // District lookup
      'tblcommune',        // Commune lookup
      'tbldoctor',         // Doctor lookup
      'tblversion',        // System version
      'tblmargins',        // System margins
      'tblsetlost'         // Lost to follow-up settings
    ];

    // Filter out preserve tables from aggregation tables
    const tablesToClean = aggregationTables.filter(table => !preserveTables.includes(table));
    const tablesToPreserve = aggregationTables.filter(table => preserveTables.includes(table));

    addProgress(`📋 Step 2: Categorizing tables for cleanup...`, 'step');
    addProgress(`   - Tables to clean: ${tablesToClean.length}`, 'info');
    addProgress(`   - Tables to preserve: ${tablesToPreserve.length}`, 'info');
    addProgress(`   - Tables excluded (no _site_code): ${excludedTables.length}`, 'info');

    // Step 3: Clean the aggregation tables
    addProgress('🗑️ Step 3: Cleaning aggregation tables...', 'step');
    
    let cleanedTables = 0;
    let totalRecordsCleaned = 0;
    const errors = [];

    for (const tableName of tablesToClean) {
      try {
        // Get record count before cleaning
        const [countResult] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const recordCount = countResult[0].count;
        
        if (recordCount > 0) {
          addProgress(`   - Cleaning ${tableName} (${recordCount.toLocaleString()} records)...`, 'info');
          await sequelize.query(`DELETE FROM ${tableName}`);
          addProgress(`   - ✅ ${tableName} cleaned (${recordCount.toLocaleString()} records removed)`, 'success');
          totalRecordsCleaned += recordCount;
        } else {
          addProgress(`   - ⏭️ ${tableName} already empty`, 'info');
        }
        
        cleanedTables++;
      } catch (error) {
        const errorMsg = `Could not clean ${tableName}: ${error.message}`;
        addProgress(`   - ❌ ${errorMsg}`, 'error');
        errors.push({ table: tableName, error: errorMsg });
      }
    }

    // Step 4: Reset auto-increment counters for cleaned tables
    addProgress('🔄 Step 4: Resetting auto-increment counters...', 'step');
    
    let resetCounters = 0;
    for (const tableName of tablesToClean) {
      try {
        await sequelize.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`);
        addProgress(`   - ✅ ${tableName} counter reset`, 'info');
        resetCounters++;
      } catch (error) {
        addProgress(`   - ⚠️ Could not reset ${tableName} counter: ${error.message}`, 'warning');
      }
    }

    // Step 5: Show preserved tables
    addProgress('📋 Step 5: Preserved tables (reference data)...', 'step');
    tablesToPreserve.forEach(tableName => {
      addProgress(`   - Preserved: ${tableName}`, 'info');
    });

    // Step 6: Show excluded tables
    addProgress('📋 Step 6: Excluded tables (no _site_code)...', 'step');
    excludedTables.forEach(tableName => {
      addProgress(`   - Excluded: ${tableName}`, 'info');
    });

    // Final summary
    addProgress('🎉 Smart cleanup completed!', 'success');
    
    const results = {
      success: true,
      message: 'Smart cleanup completed successfully. Only aggregation tables were cleaned.',
      statistics: {
        totalTables: tableNames.length,
        aggregationTables: aggregationTables.length,
        cleanedTables: cleanedTables,
        preservedTables: tablesToPreserve.length,
        excludedTables: excludedTables.length,
        totalRecordsCleaned: totalRecordsCleaned,
        resetCounters: resetCounters,
        errors: errors.length
      },
      cleanedTables: tablesToClean,
      preservedTables: tablesToPreserve,
      excludedTables: excludedTables,
      errors: errors,
      progressLog: progressLog,
      timestamp: new Date().toISOString()
    };

    console.log('\n📊 CLEANUP SUMMARY:');
    console.log('==================');
    console.log(`Total tables: ${tableNames.length}`);
    console.log(`Aggregation tables: ${aggregationTables.length}`);
    console.log(`Cleaned tables: ${cleanedTables}`);
    console.log(`Preserved tables: ${tablesToPreserve.length}`);
    console.log(`Excluded tables: ${excludedTables.length}`);
    console.log(`Total records cleaned: ${totalRecordsCleaned.toLocaleString()}`);
    console.log(`Reset counters: ${resetCounters}`);
    console.log(`Errors: ${errors.length}`);

    res.json(results);

  } catch (error) {
    console.error('❌ Smart cleanup error:', error);
    addProgress(`❌ Smart cleanup failed: ${error.message}`, 'error');
    
    res.status(500).json({
      success: false,
      message: 'Smart cleanup failed',
      error: error.message,
      progressLog: progressLog
    });
  }
});

// Clean only core patient data tables
router.post('/clean-core-patient-data', [authenticateToken], async (req, res) => {
  const progressLog = [];
  
  const addProgress = (message, type = 'info') => {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, type };
    progressLog.push(logEntry);
    console.log(`[${timestamp}] ${message}`);
  };

  try {
    addProgress('🧹 Starting CORE PATIENT DATA cleanup...', 'start');

    // Core patient data tables only
    const coreTables = [
      'tblaimain',           // Adult patients
      'tblcimain',           // Child patients
      'tbleimain',           // Infant patients
      'tblavmain',           // Adult visits
      'tblcvmain',           // Child visits
      'tblevmain',           // Infant visits
      'tblaart',             // Adult ART
      'tblcart',             // Child ART
      'tbleart',             // Infant ART
      'tblavpatientstatus',  // Adult status
      'tblcvpatientstatus',  // Child status
      'tblevpatientstatus',  // Infant status
      'tblavarvdrug',        // Adult ARV drugs
      'tblcvarvdrug',        // Child ARV drugs
      'tblevarvdrug',        // Infant ARV drugs
      'tblpatienttest'       // Patient tests
    ];

    let cleanedTables = 0;
    let totalRecordsCleaned = 0;
    const errors = [];

    for (const tableName of coreTables) {
      try {
        // Check if table exists
        const [tables] = await sequelize.query(`SHOW TABLES LIKE '${tableName}'`);
        if (tables.length === 0) {
          addProgress(`   - ⚠️ ${tableName} does not exist, skipping`, 'warning');
          continue;
        }

        // Get record count before cleaning
        const [countResult] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const recordCount = countResult[0].count;
        
        if (recordCount > 0) {
          addProgress(`   - Cleaning ${tableName} (${recordCount.toLocaleString()} records)...`, 'info');
          await sequelize.query(`DELETE FROM ${tableName}`);
          addProgress(`   - ✅ ${tableName} cleaned (${recordCount.toLocaleString()} records removed)`, 'success');
          totalRecordsCleaned += recordCount;
        } else {
          addProgress(`   - ⏭️ ${tableName} already empty`, 'info');
        }
        
        // Reset auto-increment
        try {
          await sequelize.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`);
          addProgress(`   - 🔄 ${tableName} counter reset`, 'info');
        } catch (resetError) {
          addProgress(`   - ⚠️ Could not reset ${tableName} counter: ${resetError.message}`, 'warning');
        }
        
        cleanedTables++;
      } catch (error) {
        const errorMsg = `Could not clean ${tableName}: ${error.message}`;
        addProgress(`   - ❌ ${errorMsg}`, 'error');
        errors.push({ table: tableName, error: errorMsg });
      }
    }

    addProgress('🎉 Core patient data cleanup completed!', 'success');
    
    const results = {
      success: true,
      message: 'Core patient data cleanup completed successfully.',
      statistics: {
        totalTables: coreTables.length,
        cleanedTables: cleanedTables,
        totalRecordsCleaned: totalRecordsCleaned,
        errors: errors.length
      },
      cleanedTables: coreTables,
      errors: errors,
      progressLog: progressLog,
      timestamp: new Date().toISOString()
    };

    res.json(results);

  } catch (error) {
    console.error('❌ Core patient data cleanup error:', error);
    addProgress(`❌ Core patient data cleanup failed: ${error.message}`, 'error');
    
    res.status(500).json({
      success: false,
      message: 'Core patient data cleanup failed',
      error: error.message,
      progressLog: progressLog
    });
  }
});

module.exports = router;
