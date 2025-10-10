const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

// Reset auto-increment counters for all tables
router.post('/reset-auto-increment', async (req, res) => {
  try {
    console.log('🔄 Starting auto-increment reset...');
    
    const progressLog = [];
    const addProgress = (message, level = 'info') => {
      progressLog.push({ message, level, timestamp: new Date().toISOString() });
      console.log(message);
    };

    // 1. Process registry database tables
    addProgress('📁 Processing registry database...', 'step');
    const registryTables = [
      'analytics_indicators',
      'sites',
      'tbluser'
    ];

    for (const tableName of registryTables) {
      try {
        // Check if table exists before attempting to reset
        const [tables] = await sequelize.query(`SHOW TABLES LIKE '${tableName}'`);
        if (tables.length > 0) {
          await sequelize.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`);
          addProgress(`   - ✅ ${tableName} counter reset to 1`, 'info');
        } else {
          addProgress(`   - ⚠️ ${tableName} does not exist, skipping`, 'warning');
        }
      } catch (error) {
        addProgress(`   - ❌ Could not reset ${tableName} counter: ${error.message}`, 'error');
      }
    }

    // 2. Process site databases
    addProgress('🌐 Processing site databases...', 'step');
    const [sites] = await sequelize.query('SELECT database_name FROM sites');
    const siteTables = [
      'tblaimain', 'tblcimain', 'tblaart', 'tblcart', 'tblavmain', 'tblcvmain',
      'tblavarvdrug', 'tblcvarvdrug', 'tblavpatientstatus', 'tblcvpatientstatus',
      'tblpatienttest', 'tblavtptdrug', 'tblcvtptdrug'
    ];

    for (const site of sites) {
      const dbName = site.database_name;
      addProgress(`   - Connecting to site database: ${dbName}`, 'info');
      for (const tableName of siteTables) {
        try {
          // Check if table exists in the specific site database
          const [tables] = await sequelize.query(`SHOW TABLES FROM \`${dbName}\` LIKE '${tableName}'`);
          if (tables.length > 0) {
            await sequelize.query(`ALTER TABLE \`${dbName}\`.${tableName} AUTO_INCREMENT = 1`);
            addProgress(`     - ✅ ${dbName}.${tableName} counter reset to 1`, 'info');
          } else {
            addProgress(`     - ⚠️ ${dbName}.${tableName} does not exist, skipping`, 'warning');
          }
        } catch (error) {
          addProgress(`     - ❌ Could not reset ${dbName}.${tableName} counter: ${error.message}`, 'error');
        }
      }
    }

    addProgress('🎉 Auto-increment reset completed!', 'success');
    addProgress('📝 Note: This only resets the counter, it does not delete existing data.', 'info');
    addProgress('📝 New records will start with ID = 1, but existing records keep their current IDs.', 'info');

    res.json({
      success: true,
      message: 'Auto-increment counters reset successfully',
      progressLog: progressLog
    });

  } catch (error) {
    console.error('❌ Auto-increment reset failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset auto-increment counters',
      message: error.message
    });
  }
});

module.exports = router;
