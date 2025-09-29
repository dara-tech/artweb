#!/usr/bin/env node

/**
 * Script to check and fix site codes in art_aggregate database
 * - Check all tables with site_code columns
 * - Verify site codes are in correct format (4 digits)
 * - Fix 3-digit codes by adding leading zero
 */

const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password123',
  database: 'art_aggregates'
};

const expectedSiteCodes = ['0201', '0202', '0301', '0306', '1209', '1801'];

async function checkAndFixSiteCodes() {
  let connection;
  
  try {
    console.log('🔍 Connecting to art_aggregate database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully\n');

    // Step 1: Find all tables with site_code column
    console.log('📋 Step 1: Finding tables with site_code column...');
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'art_aggregates' 
      AND COLUMN_NAME = 'site_code'
      ORDER BY TABLE_NAME
    `);

    console.log(`Found ${tables.length} tables with site_code column:`);
    tables.forEach(table => console.log(`  - ${table.TABLE_NAME}`));
    console.log('');

    // Step 2: Check current site codes in each table
    console.log('📊 Step 2: Checking current site codes...');
    const siteCodeAnalysis = {};
    
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      console.log(`\n🔍 Analyzing ${tableName}...`);
      
      try {
        // Get unique site codes and their counts
        const [siteCodes] = await connection.execute(`
          SELECT site_code, COUNT(*) as count 
          FROM \`${tableName}\` 
          WHERE site_code IS NOT NULL 
          GROUP BY site_code 
          ORDER BY site_code
        `);
        
        siteCodeAnalysis[tableName] = siteCodes;
        
        console.log(`  Found ${siteCodes.length} unique site codes:`);
        siteCodes.forEach(row => {
          const isCorrectFormat = /^\d{4}$/.test(row.site_code);
          const isExpected = expectedSiteCodes.includes(row.site_code);
          const status = isCorrectFormat ? (isExpected ? '✅' : '⚠️') : '❌';
          console.log(`    ${status} ${row.site_code}: ${row.count} records`);
        });
        
      } catch (error) {
        console.log(`  ❌ Error analyzing ${tableName}: ${error.message}`);
        siteCodeAnalysis[tableName] = [];
      }
    }

    // Step 3: Identify tables that need fixing
    console.log('\n🔧 Step 3: Identifying tables that need fixing...');
    const tablesToFix = [];
    
    for (const [tableName, siteCodes] of Object.entries(siteCodeAnalysis)) {
      const needsFixing = siteCodes.some(row => !/^\d{4}$/.test(row.site_code));
      if (needsFixing) {
        tablesToFix.push(tableName);
        console.log(`  ❌ ${tableName}: Needs fixing (has malformed site codes)`);
      } else {
        console.log(`  ✅ ${tableName}: All site codes are properly formatted`);
      }
    }

    if (tablesToFix.length === 0) {
      console.log('\n🎉 All tables have properly formatted site codes!');
      return;
    }

    // Step 4: Fix site codes
    console.log(`\n🔧 Step 4: Fixing site codes in ${tablesToFix.length} tables...`);
    
    for (const tableName of tablesToFix) {
      console.log(`\n🔧 Fixing ${tableName}...`);
      
      try {
        // Get all malformed site codes (3 digits)
        const [malformedCodes] = await connection.execute(`
          SELECT DISTINCT site_code 
          FROM \`${tableName}\` 
          WHERE site_code REGEXP '^[0-9]{3}$'
        `);
        
        console.log(`  Found ${malformedCodes.length} malformed site codes:`);
        malformedCodes.forEach(row => console.log(`    - ${row.site_code}`));
        
        // Fix each malformed code
        for (const row of malformedCodes) {
          const oldCode = row.site_code;
          const newCode = oldCode.padStart(4, '0');
          
          console.log(`  Fixing ${oldCode} → ${newCode}...`);
          
          const [result] = await connection.execute(`
            UPDATE \`${tableName}\` 
            SET site_code = ? 
            WHERE site_code = ?
          `, [newCode, oldCode]);
          
          console.log(`    ✅ Updated ${result.affectedRows} records`);
        }
        
        // Verify the fix
        const [updatedCodes] = await connection.execute(`
          SELECT site_code, COUNT(*) as count 
          FROM \`${tableName}\` 
          WHERE site_code IS NOT NULL 
          GROUP BY site_code 
          ORDER BY site_code
        `);
        
        console.log(`  ✅ ${tableName} now has ${updatedCodes.length} unique site codes:`);
        updatedCodes.forEach(row => {
          const isExpected = expectedSiteCodes.includes(row.site_code);
          const status = isExpected ? '✅' : '⚠️';
          console.log(`    ${status} ${row.site_code}: ${row.count} records`);
        });
        
      } catch (error) {
        console.log(`  ❌ Error fixing ${tableName}: ${error.message}`);
      }
    }

    // Step 5: Final verification
    console.log('\n📊 Step 5: Final verification...');
    
    for (const tableName of tablesToFix) {
      try {
        const [finalCodes] = await connection.execute(`
          SELECT site_code, COUNT(*) as count 
          FROM \`${tableName}\` 
          WHERE site_code IS NOT NULL 
          GROUP BY site_code 
          ORDER BY site_code
        `);
        
        const allCorrectFormat = finalCodes.every(row => /^\d{4}$/.test(row.site_code));
        const hasUnexpectedCodes = finalCodes.some(row => !expectedSiteCodes.includes(row.site_code));
        
        if (allCorrectFormat && !hasUnexpectedCodes) {
          console.log(`  ✅ ${tableName}: Perfect! All site codes are correct format and expected values`);
        } else if (allCorrectFormat) {
          console.log(`  ⚠️  ${tableName}: Correct format but has unexpected values`);
          finalCodes.forEach(row => {
            const isExpected = expectedSiteCodes.includes(row.site_code);
            console.log(`    ${isExpected ? '✅' : '❌'} ${row.site_code}: ${row.count} records`);
          });
        } else {
          console.log(`  ❌ ${tableName}: Still has malformed site codes`);
        }
        
      } catch (error) {
        console.log(`  ❌ Error verifying ${tableName}: ${error.message}`);
      }
    }

    // Step 6: Summary
    console.log('\n📈 Summary:');
    console.log(`  - Tables analyzed: ${tables.length}`);
    console.log(`  - Tables fixed: ${tablesToFix.length}`);
    console.log(`  - Expected site codes: ${expectedSiteCodes.join(', ')}`);
    
    console.log('\n🎉 Site code check and fix completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the script
if (require.main === module) {
  checkAndFixSiteCodes().catch(console.error);
}

module.exports = { checkAndFixSiteCodes };
