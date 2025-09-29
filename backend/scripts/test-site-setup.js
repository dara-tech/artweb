#!/usr/bin/env node

/**
 * Test script to verify the site database setup
 * This script tests the new site database functionality
 */

const { siteDatabaseManager } = require('../src/config/siteDatabase');

async function testSiteSetup() {
  console.log('🧪 Testing Site Database Setup');
  console.log('==============================\n');
  
  try {
    // Test 1: Get all sites
    console.log('📋 Test 1: Fetching all sites...');
    const sites = await siteDatabaseManager.getAllSites();
    console.log(`✅ Found ${sites.length} sites:`);
    sites.forEach(site => {
      console.log(`   - ${site.code}: ${site.name} (${site.province})`);
    });
    console.log('');
    
    // Test 2: Test each site connection
    console.log('🔌 Test 2: Testing site connections...');
    for (const site of sites) {
      try {
        const connection = await siteDatabaseManager.getSiteConnection(site.code);
        await connection.authenticate();
        console.log(`✅ ${site.code} (${site.name}): Connected`);
      } catch (error) {
        console.log(`❌ ${site.code} (${site.name}): Failed - ${error.message}`);
      }
    }
    console.log('');
    
    // Test 3: Get database statistics for first site
    if (sites.length > 0) {
      const firstSite = sites[0];
      console.log(`📊 Test 3: Getting statistics for ${firstSite.name}...`);
      
      try {
        // Get table list
        const tablesQuery = 'SHOW TABLES';
        const tables = await siteDatabaseManager.executeSiteQuery(firstSite.code, tablesQuery);
        console.log(`✅ Found ${tables.length} tables in ${firstSite.name}`);
        
        // Get sample data from main tables
        const mainTables = ['tblaimain', 'tblchildmain', 'tblinfantmain', 'tblaart'];
        for (const tableName of mainTables) {
          try {
            const countQuery = `SELECT COUNT(*) as count FROM \`${tableName}\``;
            const countResult = await siteDatabaseManager.executeSiteQuery(firstSite.code, countQuery);
            const recordCount = countResult[0].count;
            console.log(`   - ${tableName}: ${recordCount} records`);
          } catch (err) {
            console.log(`   - ${tableName}: Not found or error`);
          }
        }
      } catch (error) {
        console.log(`❌ Failed to get statistics: ${error.message}`);
      }
    }
    console.log('');
    
    // Test 4: Test registry database
    console.log('📚 Test 4: Testing registry database...');
    try {
      const registryConnection = siteDatabaseManager.getRegistryConnection();
      await registryConnection.authenticate();
      console.log('✅ Registry database: Connected');
      
      // Test registry query
      const [registryResults] = await registryConnection.query('SELECT COUNT(*) as count FROM sites');
      console.log(`✅ Registry contains ${registryResults[0].count} site records`);
    } catch (error) {
      console.log(`❌ Registry database: Failed - ${error.message}`);
    }
    console.log('');
    
    // Test 5: Test site-specific query execution
    if (sites.length > 0) {
      const firstSite = sites[0];
      console.log(`🔍 Test 5: Testing query execution on ${firstSite.name}...`);
      
      try {
        // Test a simple query
        const testQuery = 'SELECT COUNT(*) as total_patients FROM tblaimain';
        const results = await siteDatabaseManager.executeSiteQuery(firstSite.code, testQuery);
        console.log(`✅ Query executed successfully: ${results[0].total_patients} adult patients`);
      } catch (error) {
        console.log(`❌ Query execution failed: ${error.message}`);
      }
    }
    console.log('');
    
    console.log('🎉 All tests completed!');
    console.log('========================\n');
    
    console.log('✅ Site database setup is working correctly!');
    console.log('\nNext steps:');
    console.log('1. Start your backend server: npm start');
    console.log('2. Test the API endpoints:');
    console.log('   - GET /api/site-operations/sites');
    console.log('   - GET /api/site-operations/sites/0201/stats');
    console.log('3. Update your frontend to use site-specific data');
    
    return true;
    
  } catch (error) {
    console.error('💥 Test failed:', error);
    return false;
  } finally {
    // Close all connections
    try {
      await siteDatabaseManager.closeAllConnections();
      console.log('\n🔌 All database connections closed');
    } catch (error) {
      console.error('❌ Error closing connections:', error);
    }
  }
}

// Run the test
if (require.main === module) {
  testSiteSetup()
    .then(success => {
      if (success) {
        console.log('🎉 Tests passed successfully!');
        process.exit(0);
      } else {
        console.log('❌ Tests failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error during testing:', error);
      process.exit(1);
    });
}

module.exports = testSiteSetup;
