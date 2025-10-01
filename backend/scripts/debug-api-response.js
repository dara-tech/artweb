const { siteDatabaseManager } = require('../src/config/siteDatabase');

async function debugAPIResponse() {
  try {
    console.log('🔍 Debugging API response...');
    
    // Test the getAllSites method directly
    console.log('\n1. Testing getAllSites method:');
    const allSites = await siteDatabaseManager.getAllSites();
    console.log('Raw getAllSites response:');
    console.log(JSON.stringify(allSites, null, 2));
    
    // Test the mapping logic
    console.log('\n2. Testing mapping logic:');
    const formattedSites = allSites.map(site => ({
      code: site.code,
      name: site.display_name || site.short_name || site.name,
      fullName: site.name,
      shortName: site.short_name,
      searchTerms: site.search_terms,
      fileName: site.file_name
    }));
    
    console.log('Formatted sites:');
    console.log(JSON.stringify(formattedSites, null, 2));
    
  } catch (error) {
    console.error('❌ Error debugging API response:', error);
  }
}

// Run the debug
if (require.main === module) {
  debugAPIResponse()
    .then(() => {
      console.log('✅ API response debug completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ API response debug failed:', error);
      process.exit(1);
    });
}

module.exports = { debugAPIResponse };
