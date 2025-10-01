const { siteDatabaseManager } = require('../src/config/siteDatabase');

async function addFileNameField() {
  try {
    console.log('🔄 Adding file_name field to sites table...');
    
    const registryConnection = siteDatabaseManager.getRegistryConnection();
    
    // Check if file_name column already exists
    const [columns] = await registryConnection.query(`
      SHOW COLUMNS FROM sites LIKE 'file_name'
    `);
    
    if (columns.length === 0) {
      // Add file_name column to the sites table
      await registryConnection.query(`
        ALTER TABLE sites 
        ADD COLUMN file_name VARCHAR(255) AFTER search_terms
      `);
      console.log('✅ Added file_name column to sites table');
    } else {
      console.log('✅ file_name column already exists in sites table');
    }
    
    // Update existing sites with file names based on the provided data
    const sitesWithFileNames = [
      {
        code: '0201',
        file_name: '0201_29_08_2025_03_27_43.h149'
      },
      {
        code: '0202',
        file_name: '0202_01_09_2025_09_20_18.h149'
      },
      {
        code: '0301',
        file_name: '0301_02_09_2025_10_21_57.h149'
      },
      {
        code: '0306',
        file_name: '0306_29_08_2025_02_24_12.h149'
      },
      {
        code: '1209',
        file_name: '1209_03_09_2025_03_49_47.h149'
      },
      {
        code: '1801',
        file_name: '1801_03_09_2025_03_12_00.h149'
      }
    ];
    
    // Update each site with its file name
    for (const site of sitesWithFileNames) {
      await registryConnection.query(`
        UPDATE sites 
        SET file_name = :file_name
        WHERE code = :code
      `, {
        replacements: { file_name: site.file_name, code: site.code },
        type: registryConnection.QueryTypes.UPDATE
      });
      
      console.log(`✅ Updated site ${site.code} with file_name: ${site.file_name}`);
    }
    
    // Verify the updates
    const [updatedSites] = await registryConnection.query(`
      SELECT code, name, short_name, display_name, file_name 
      FROM sites 
      ORDER BY code
    `);
    
    console.log('\n📋 Updated sites with file names:');
    console.table(updatedSites);
    
    console.log('\n🎉 File name field added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding file_name field:', error);
    throw error;
  }
}

// Run the update
if (require.main === module) {
  addFileNameField()
    .then(() => {
      console.log('✅ File name field addition completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ File name field addition failed:', error);
      process.exit(1);
    });
}

module.exports = { addFileNameField };
