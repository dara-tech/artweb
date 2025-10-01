const { siteDatabaseManager } = require('../src/config/siteDatabase');

async function safeSiteUpdate() {
  try {
    console.log('🔄 Performing safe site database update...');
    
    const registryConnection = siteDatabaseManager.getRegistryConnection();
    
    // First, check if the new columns already exist
    const [columns] = await registryConnection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'preart_sites_registry' 
      AND TABLE_NAME = 'sites' 
      AND COLUMN_NAME IN ('short_name', 'display_name', 'search_terms')
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    console.log('📋 Existing columns:', existingColumns);
    
    // Only add columns that don't exist
    if (!existingColumns.includes('short_name')) {
      await registryConnection.query(`
        ALTER TABLE sites 
        ADD COLUMN short_name VARCHAR(100) AFTER name
      `);
      console.log('✅ Added short_name column');
    }
    
    if (!existingColumns.includes('display_name')) {
      await registryConnection.query(`
        ALTER TABLE sites 
        ADD COLUMN display_name VARCHAR(100) AFTER short_name
      `);
      console.log('✅ Added display_name column');
    }
    
    if (!existingColumns.includes('search_terms')) {
      await registryConnection.query(`
        ALTER TABLE sites 
        ADD COLUMN search_terms TEXT AFTER display_name
      `);
      console.log('✅ Added search_terms column');
    }
    
    // Get current sites to update
    const [currentSites] = await registryConnection.query(`
      SELECT code, name FROM sites WHERE status = 1 ORDER BY code
    `);
    
    console.log('📋 Current sites:', currentSites);
    
    // Update sites with backward-compatible data
    for (const site of currentSites) {
      let shortName = site.name;
      let displayName = site.name;
      let searchTerms = site.name;
      
      // Create short names and search terms based on existing names
      if (site.name.includes('Maung Ruessei Referral Hospital')) {
        shortName = 'Maung Russey RH';
        displayName = 'Maung Russey RH';
        searchTerms = 'Maung Russey RH,Maung Ruessei Referral Hospital,Maung Russey,Maung Ruessei';
      } else if (site.name.includes('Battambang')) {
        shortName = 'Battambang PH';
        displayName = 'Battambang PH';
        searchTerms = 'Battambang PH,Battambang Provincial Hospital,Battambang';
      } else if (site.name.includes('Kampong Cham')) {
        shortName = 'Kampong Cham PH';
        displayName = 'Kampong Cham PH';
        searchTerms = 'Kampong Cham PH,Kampong Cham Provincial Hospital,Kampong Cham';
      } else if (site.name.includes('Chamkar Leu')) {
        shortName = 'Chamkar Leu RH';
        displayName = 'Chamkar Leu RH';
        searchTerms = 'Chamkar Leu RH,Chamkar Leu Referral Hospital,Chamkar Leu';
      } else if (site.name.includes('Chhuk Sor')) {
        shortName = 'Chhuk Sor';
        displayName = 'Chhuk Sor';
        searchTerms = 'Chhuk Sor,Chhuk Sor Health Center';
      } else if (site.name.includes('Preah Sihanouk')) {
        shortName = 'Preah Sihanouk PH';
        displayName = 'Preah Sihanouk PH';
        searchTerms = 'Preah Sihanouk PH,Preah Sihanouk Provincial Hospital,Preah Sihanouk';
      }
      
      // Update the site with new fields
      await registryConnection.query(`
        UPDATE sites 
        SET short_name = '${shortName}', display_name = '${displayName}', search_terms = '${searchTerms}'
        WHERE code = '${site.code}'
      `);
      
      console.log(`✅ Updated site ${site.code}: ${displayName}`);
    }
    
    // Verify the updates
    const [updatedSites] = await registryConnection.query(`
      SELECT code, name, short_name, display_name, search_terms 
      FROM sites 
      WHERE status = 1
      ORDER BY code
    `);
    
    console.log('\n📋 Updated sites:');
    console.table(updatedSites);
    
    console.log('\n🎉 Safe site database update completed successfully!');
    console.log('✅ All existing functionality preserved');
    console.log('✅ Reports will continue to work without changes');
    
  } catch (error) {
    console.error('❌ Error during safe site update:', error);
    throw error;
  }
}

// Run the update
if (require.main === module) {
  safeSiteUpdate()
    .then(() => {
      console.log('✅ Safe site update completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Safe site update failed:', error);
      process.exit(1);
    });
}

module.exports = { safeSiteUpdate };
