const { siteDatabaseManager } = require('../src/config/siteDatabase');

async function checkFileNameData() {
  try {
    console.log('🔍 Checking file_name data in database...');
    
    const registryConnection = siteDatabaseManager.getRegistryConnection();
    
    // Check the actual data in the database
    const [sites] = await registryConnection.query(`
      SELECT code, name, file_name 
      FROM sites 
      ORDER BY code
    `);
    
    console.log('\n📋 Sites with file_name data:');
    console.table(sites);
    
    // Test the getAllSites method
    console.log('\n🔍 Testing getAllSites method:');
    const allSites = await siteDatabaseManager.getAllSites();
    console.table(allSites.map(site => ({
      code: site.code,
      name: site.name,
      file_name: site.file_name
    })));
    
  } catch (error) {
    console.error('❌ Error checking file_name data:', error);
  }
}

// Run the check
if (require.main === module) {
  checkFileNameData()
    .then(() => {
      console.log('✅ File name data check completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ File name data check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkFileNameData };
