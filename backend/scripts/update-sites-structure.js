const { siteDatabaseManager } = require('../src/config/siteDatabase');

async function updateSitesStructure() {
  try {
    console.log('🔄 Updating sites database structure...');
    
    const registryConnection = siteDatabaseManager.getRegistryConnection();
    
    // Add new columns to the sites table
    await registryConnection.query(`
      ALTER TABLE sites 
      ADD COLUMN IF NOT EXISTS short_name VARCHAR(100) AFTER name,
      ADD COLUMN IF NOT EXISTS display_name VARCHAR(100) AFTER short_name,
      ADD COLUMN IF NOT EXISTS search_terms TEXT AFTER display_name
    `);
    
    console.log('✅ Added new columns to sites table');
    
    // Update existing sites with proper names and search terms
    const sites = [
      {
        code: '0201',
        name: 'Maung Ruessei Referral Hospital',
        short_name: 'Maung Russey RH',
        display_name: 'Maung Russey RH',
        search_terms: 'Maung Russey RH,Maung Ruessei Referral Hospital,Maung Russey,Maung Ruessei'
      },
      {
        code: '0202', 
        name: 'Battambang Provincial Hospital',
        short_name: 'Battambang PH',
        display_name: 'Battambang PH',
        search_terms: 'Battambang PH,Battambang Provincial Hospital,Battambang'
      },
      {
        code: '0301',
        name: 'Kampong Cham Provincial Hospital', 
        short_name: 'Kampong Cham PH',
        display_name: 'Kampong Cham PH',
        search_terms: 'Kampong Cham PH,Kampong Cham Provincial Hospital,Kampong Cham'
      },
      {
        code: '0306',
        name: 'Chamkar Leu Referral Hospital',
        short_name: 'Chamkar Leu RH', 
        display_name: 'Chamkar Leu RH',
        search_terms: 'Chamkar Leu RH,Chamkar Leu Referral Hospital,Chamkar Leu'
      },
      {
        code: '1209',
        name: 'Chhuk Sor Health Center',
        short_name: 'Chhuk Sor',
        display_name: 'Chhuk Sor',
        search_terms: 'Chhuk Sor,Chhuk Sor Health Center'
      },
      {
        code: '1801',
        name: 'Preah Sihanouk Provincial Hospital',
        short_name: 'Preah Sihanouk PH',
        display_name: 'Preah Sihanouk PH', 
        search_terms: 'Preah Sihanouk PH,Preah Sihanouk Provincial Hospital,Preah Sihanouk'
      }
    ];
    
    // Update each site
    for (const site of sites) {
      await registryConnection.query(`
        UPDATE sites 
        SET name = ?, short_name = ?, display_name = ?, search_terms = ?
        WHERE code = ?
      `, [
        site.name,
        site.short_name, 
        site.display_name,
        site.search_terms,
        site.code
      ]);
      
      console.log(`✅ Updated site ${site.code}: ${site.display_name}`);
    }
    
    // Verify the updates
    const updatedSites = await registryConnection.query(`
      SELECT code, name, short_name, display_name, search_terms 
      FROM sites 
      ORDER BY code
    `);
    
    console.log('\n📋 Updated sites:');
    console.table(updatedSites[0]);
    
    console.log('\n🎉 Sites database structure updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating sites structure:', error);
    throw error;
  }
}

// Run the update
if (require.main === module) {
  updateSitesStructure()
    .then(() => {
      console.log('✅ Sites structure update completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Sites structure update failed:', error);
      process.exit(1);
    });
}

module.exports = { updateSitesStructure };
