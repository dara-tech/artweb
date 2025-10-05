#!/usr/bin/env node

/**
 * Main script to run the site database setup process
 * This script will create separate databases for each site and import data
 */

const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function runSiteSetup() {
  console.log('🚀 Starting PreART Site Database Setup');
  console.log('=====================================\n');
  
  try {
    // Step 1: Run the database creation script
    console.log('📋 Step 1: Creating site databases and importing data...');
    const createScriptPath = path.join(__dirname, 'create-site-databases.js');
    
    const { stdout, stderr } = await execAsync(`node "${createScriptPath}"`);
    
    if (stderr && !stderr.includes('Warning')) {
      console.error('❌ Error during database creation:', stderr);
      return false;
    }
    
    console.log(stdout);
    console.log('✅ Database creation completed successfully!\n');
    
    // Step 2: Test the new database connections
    console.log('🧪 Step 2: Testing database connections...');
    
    // Create a simple test script
    const testScript = `
      const { siteDatabaseManager } = require('../src/config/siteDatabase');
      
      async function testConnections() {
        try {
          await siteDatabaseManager.testAllConnections();
          console.log('✅ All database connections are working correctly!');
          process.exit(0);
        } catch (error) {
          console.error('❌ Database connection test failed:', error);
          process.exit(1);
        }
      }
      
      testConnections();
    `;
    
    const testScriptPath = path.join(__dirname, 'test-connections.js');
    require('fs').writeFileSync(testScriptPath, testScript);
    
    const { stdout: testOutput, stderr: testError } = await execAsync(`node "${testScriptPath}"`);
    
    if (testError && !testError.includes('Warning')) {
      console.error('❌ Error during connection test:', testError);
      return false;
    }
    
    console.log(testOutput);
    
    // Clean up test script
    require('fs').unlinkSync(testScriptPath);
    
    console.log('✅ Connection test completed successfully!\n');
    
    // Step 3: Display next steps
    console.log('🎉 Site Database Setup Complete!');
    console.log('================================\n');
    
    console.log('📊 What was created:');
    console.log('   - preart_sites_registry: Registry database for site management');
    console.log('   - preart_0201: Maung Russey RH (Battambang)');
    console.log('   - preart_0202: Battambang PH (Battambang)');
    console.log('   - preart_0301: Kampong Cham PH (Kampong Cham)');
    console.log('   - preart_0306: Tbong Khmum RH (Tbong Khmum)');
    console.log('   - preart_1209: Phnom Penh RH (Phnom Penh)');
    console.log('   - preart_1801: Siem Reap RH (Siem Reap)\n');
    
    console.log('🔧 Next steps:');
    console.log('   1. Update your .env file if needed');
    console.log('   2. Restart your backend server');
    console.log('   3. Test the new site-specific endpoints:');
    console.log('      - GET /api/site-operations/sites');
    console.log('      - GET /api/site-operations/sites/:siteCode/stats');
    console.log('      - GET /api/site-operations/sites/:siteCode/test');
    console.log('   4. Update your frontend to use site-specific data');
    console.log('   5. Gradually migrate from aggregated to site-specific queries\n');
    
    console.log('📚 API Documentation:');
    console.log('   - Site Operations: /api/site-operations');
    console.log('   - Site Management: /api/site-management');
    console.log('   - Sites: /api/sites\n');
    
    console.log('⚠️  Important Notes:');
    console.log('   - The old aggregated database is still available for backward compatibility');
    console.log('   - You can run both systems in parallel during migration');
    console.log('   - Site-specific databases are independent and can be managed separately');
    console.log('   - Each site database contains only data for that specific site\n');
    
    return true;
    
  } catch (error) {
    console.error('💥 Fatal error during setup:', error);
    return false;
  }
}

// Run the setup
if (require.main === module) {
  runSiteSetup()
    .then(success => {
      if (success) {
        console.log('🎉 Setup completed successfully!');
        process.exit(0);
      } else {
        console.log('❌ Setup failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = runSiteSetup;
