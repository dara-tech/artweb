const { sequelize } = require('../src/config/database');

/**
 * Reset auto-increment counters to 1 for all tables
 * This is useful when you want to start fresh with ID numbering
 */
async function resetAutoIncrement() {
  try {
    console.log('🔄 Resetting auto-increment counters to 1...');
    
    // Tables in the main registry database
    const registryTables = [
      'analytics_indicators',
      'tblsitename',
      'users'
    ];
    
    console.log('📁 Processing registry database...');
    for (const tableName of registryTables) {
      try {
        // Check if table exists
        const [tables] = await sequelize.query(`SHOW TABLES LIKE '${tableName}'`);
        if (tables.length === 0) {
          console.log(`   - ⚠️ ${tableName} does not exist, skipping`);
          continue;
        }
        
        // Reset auto-increment
        await sequelize.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`);
        console.log(`   - ✅ ${tableName} counter reset to 1`);
      } catch (error) {
        console.log(`   - ❌ Could not reset ${tableName}: ${error.message}`);
      }
    }
    
    // Get list of site databases
    const [databases] = await sequelize.query("SHOW DATABASES LIKE 'test_site_%'");
    
    for (const db of databases) {
      const dbName = db.Database;
      console.log(`\n📁 Processing site database: ${dbName}`);
      
      // Switch to the site database
      await sequelize.query(`USE ${dbName}`);
      
      // List of tables to reset in each site database
      const siteTables = [
        'tblaimain',
        'tblcimain', 
        'tblaart',
        'tblcart',
        'tblavmain',
        'tblcvmain',
        'tblavarvdrug',
        'tblcvarvdrug',
        'tblavpatientstatus',
        'tblcvpatientstatus',
        'tblpatienttest',
        'tblavtptdrug',
        'tblcvtptdrug'
      ];
      
      for (const tableName of siteTables) {
        try {
          // Check if table exists
          const [tables] = await sequelize.query(`SHOW TABLES LIKE '${tableName}'`);
          if (tables.length === 0) {
            console.log(`   - ⚠️ ${tableName} does not exist`);
            continue;
          }
          
          // Reset auto-increment
          await sequelize.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`);
          console.log(`   - ✅ ${tableName} counter reset to 1`);
        } catch (error) {
          console.log(`   - ❌ Could not reset ${tableName}: ${error.message}`);
        }
      }
    }
    
    console.log('\n🎉 Auto-increment reset completed!');
    console.log('📝 Note: This only resets the counter, it does not delete existing data.');
    console.log('📝 New records will start with ID = 1, but existing records keep their current IDs.');
    
  } catch (error) {
    console.error('❌ Error resetting auto-increment:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  resetAutoIncrement()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { resetAutoIncrement };
