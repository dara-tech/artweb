#!/usr/bin/env node

/**
 * Test script to verify the _site_code to site_code migration
 * This script will test the database schema changes and API endpoints
 */

const mysql = require('mysql2/promise');
const { sequelize } = require('../src/config/database');

async function testSiteCodeMigration() {
  console.log('🧪 Testing site_code migration...\n');

  try {
    // Test 1: Check if columns have been renamed
    console.log('📋 Test 1: Checking column names in database tables...');
    
    const tables = [
      'tblaimain', 'tblcimain', 'tbleimain', 
      'tblavmain', 'tblcvmain', 'tblevmain',
      'tblaart', 'tblcart', 'tbleart',
      'tblavpatientstatus', 'tblcvpatientstatus', 'tblevpatientstatus',
      'tblpatienttest'
    ];

    for (const table of tables) {
      try {
        const [columns] = await sequelize.query(`DESCRIBE ${table}`);
        const hasOldColumn = columns.some(col => col.Field === '_site_code');
        const hasNewColumn = columns.some(col => col.Field === 'site_code');
        
        if (hasOldColumn && !hasNewColumn) {
          console.log(`❌ ${table}: Still has _site_code column, migration not applied`);
        } else if (!hasOldColumn && hasNewColumn) {
          console.log(`✅ ${table}: Successfully migrated to site_code column`);
        } else if (hasOldColumn && hasNewColumn) {
          console.log(`⚠️  ${table}: Has both _site_code and site_code columns`);
        } else {
          console.log(`ℹ️  ${table}: No site code column found`);
        }
      } catch (error) {
        console.log(`❌ ${table}: Error checking columns - ${error.message}`);
      }
    }

    // Test 2: Check data integrity
    console.log('\n📊 Test 2: Checking data integrity...');
    
    const dataTests = [
      { table: 'tblaimain', name: 'Adult Patients' },
      { table: 'tblcimain', name: 'Child Patients' },
      { table: 'tbleimain', name: 'Infant Patients' },
      { table: 'tblavmain', name: 'Adult Visits' },
      { table: 'tblcvmain', name: 'Child Visits' },
      { table: 'tblevmain', name: 'Infant Visits' }
    ];

    for (const test of dataTests) {
      try {
        const [rows] = await sequelize.query(`
          SELECT site_code, COUNT(*) as count 
          FROM ${test.table} 
          WHERE site_code IS NOT NULL 
          GROUP BY site_code 
          ORDER BY site_code
        `);
        
        if (rows.length > 0) {
          console.log(`✅ ${test.name}: Found ${rows.length} unique site codes`);
          rows.forEach(row => {
            console.log(`   - Site ${row.site_code}: ${row.count} records`);
          });
        } else {
          console.log(`ℹ️  ${test.name}: No data with site codes found`);
        }
      } catch (error) {
        console.log(`❌ ${test.name}: Error checking data - ${error.message}`);
      }
    }

    // Test 3: Check indexes
    console.log('\n🔍 Test 3: Checking indexes...');
    
    const indexTests = [
      'idx_avmain_site_code', 'idx_cvmain_site_code', 'idx_evmain_site_code',
      'idx_aimain_site_code', 'idx_cimain_site_code', 'idx_eimain_site_code',
      'idx_patienttest_site_code'
    ];

    for (const indexName of indexTests) {
      try {
        const [indexes] = await sequelize.query(`SHOW INDEX FROM ${indexName.split('_')[1]} WHERE Key_name = '${indexName}'`);
        if (indexes.length > 0) {
          console.log(`✅ ${indexName}: Index exists`);
        } else {
          console.log(`❌ ${indexName}: Index not found`);
        }
      } catch (error) {
        console.log(`❌ ${indexName}: Error checking index - ${error.message}`);
      }
    }

    // Test 4: Test API endpoints
    console.log('\n🌐 Test 4: Testing API endpoints...');
    
    try {
      // Test sites with data endpoint
      const [sitesWithData] = await sequelize.query(`
        SELECT DISTINCT all_sites.site_code as code, 
               COALESCE(s.SiteName, CONCAT('Site ', all_sites.site_code)) as name,
               COALESCE(s.Status, 1) as status,
               COUNT(*) as patientCount
        FROM (
          SELECT site_code FROM tblaimain WHERE site_code IS NOT NULL AND site_code != ''
          UNION ALL
          SELECT site_code FROM tblcimain WHERE site_code IS NOT NULL AND site_code != ''
          UNION ALL
          SELECT site_code FROM tbleimain WHERE site_code IS NOT NULL AND site_code != ''
        ) all_sites
        LEFT JOIN tblartsite s ON s.Sid = all_sites.site_code
        GROUP BY all_sites.site_code, s.SiteName, s.Status
        HAVING patientCount > 0
        ORDER BY all_sites.site_code
        LIMIT 5
      `);
      
      console.log(`✅ Sites with data query: Found ${sitesWithData.length} sites`);
      sitesWithData.forEach(site => {
        console.log(`   - ${site.code}: ${site.name} (${site.patientCount} patients)`);
      });
    } catch (error) {
      console.log(`❌ Sites with data query failed: ${error.message}`);
    }

    console.log('\n🎉 Migration test completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Run the migration script: mysql -u username -p database_name < scripts/rename-site-code-column.sql');
    console.log('2. Restart the backend server');
    console.log('3. Test the frontend application');
    console.log('4. Verify all functionality works as expected');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the test
if (require.main === module) {
  testSiteCodeMigration().catch(console.error);
}

module.exports = { testSiteCodeMigration };
