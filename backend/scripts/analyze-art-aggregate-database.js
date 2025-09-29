#!/usr/bin/env node

/**
 * Comprehensive analysis of art_aggregate database
 * - Lists all tables with site_code columns
 * - Shows current site code distribution
 * - Identifies malformed site codes
 * - Provides fix recommendations
 */

const mysql = require('mysql2/promise');

// Database configuration for art_aggregate
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password123',
  database: 'art_aggregates'
};

const expectedSiteCodes = ['0201', '0202', '0301', '0306', '1209', '1801'];

async function analyzeArtAggregateDatabase() {
  let connection;
  
  try {
    console.log('🔍 Connecting to art_aggregate database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully\n');

    // Step 1: Get all tables with site_code column
    console.log('📋 Step 1: Finding all tables with site_code column...');
    const [tables] = await connection.execute(`
      SELECT t.TABLE_NAME, t.TABLE_ROWS
      FROM INFORMATION_SCHEMA.TABLES t
      JOIN INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME
      WHERE t.TABLE_SCHEMA = 'art_aggregates' 
      AND c.COLUMN_NAME = 'site_code'
      ORDER BY t.TABLE_NAME
    `);

    console.log(`Found ${tables.length} tables with site_code column:\n`);
    
    const tableAnalysis = {};
    
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      const estimatedRows = table.TABLE_ROWS;
      
      console.log(`📊 Analyzing ${tableName} (estimated ${estimatedRows} rows)...`);
      
      try {
        // Get actual row count
        const [countResult] = await connection.execute(`SELECT COUNT(*) as total FROM \`${tableName}\``);
        const totalRows = countResult[0].total;
        
        // Get site code distribution
        const [siteCodes] = await connection.execute(`
          SELECT site_code, COUNT(*) as count 
          FROM \`${tableName}\` 
          WHERE site_code IS NOT NULL 
          GROUP BY site_code 
          ORDER BY site_code
        `);
        
        // Get null site codes count
        const [nullCount] = await connection.execute(`
          SELECT COUNT(*) as null_count 
          FROM \`${tableName}\` 
          WHERE site_code IS NULL
        `);
        
        // Analyze site codes
        const analysis = {
          tableName,
          totalRows,
          nullSiteCodes: nullCount[0].null_count,
          siteCodeDistribution: siteCodes,
          malformedCodes: siteCodes.filter(row => !/^\d{4}$/.test(row.site_code)),
          unexpectedCodes: siteCodes.filter(row => !expectedSiteCodes.includes(row.site_code)),
          needsFixing: false
        };
        
        // Check if needs fixing
        analysis.needsFixing = analysis.malformedCodes.length > 0 || analysis.unexpectedCodes.length > 0;
        
        tableAnalysis[tableName] = analysis;
        
        // Display results
        console.log(`  Total rows: ${totalRows}`);
        console.log(`  Rows with site_code: ${totalRows - analysis.nullSiteCodes}`);
        console.log(`  Rows with NULL site_code: ${analysis.nullSiteCodes}`);
        console.log(`  Unique site codes: ${siteCodes.length}`);
        
        if (siteCodes.length > 0) {
          console.log(`  Site code distribution:`);
          siteCodes.forEach(row => {
            const isCorrectFormat = /^\d{4}$/.test(row.site_code);
            const isExpected = expectedSiteCodes.includes(row.site_code);
            let status = '✅';
            if (!isCorrectFormat) status = '❌';
            else if (!isExpected) status = '⚠️';
            
            console.log(`    ${status} ${row.site_code}: ${row.count} records`);
          });
        }
        
        if (analysis.needsFixing) {
          console.log(`  ⚠️  This table needs fixing!`);
          if (analysis.malformedCodes.length > 0) {
            console.log(`    Malformed codes: ${analysis.malformedCodes.map(c => c.site_code).join(', ')}`);
          }
          if (analysis.unexpectedCodes.length > 0) {
            console.log(`    Unexpected codes: ${analysis.unexpectedCodes.map(c => c.site_code).join(', ')}`);
          }
        } else {
          console.log(`  ✅ This table looks good!`);
        }
        
        console.log('');
        
      } catch (error) {
        console.log(`  ❌ Error analyzing ${tableName}: ${error.message}\n`);
        tableAnalysis[tableName] = {
          tableName,
          error: error.message,
          needsFixing: false
        };
      }
    }

    // Step 2: Summary and recommendations
    console.log('📈 Summary Report:');
    console.log('==================\n');
    
    const totalTables = tables.length;
    const tablesNeedingFixing = Object.values(tableAnalysis).filter(t => t.needsFixing).length;
    const tablesWithErrors = Object.values(tableAnalysis).filter(t => t.error).length;
    
    console.log(`Total tables analyzed: ${totalTables}`);
    console.log(`Tables needing fixing: ${tablesNeedingFixing}`);
    console.log(`Tables with errors: ${tablesWithErrors}`);
    console.log(`Tables in good state: ${totalTables - tablesNeedingFixing - tablesWithErrors}\n`);
    
    // Show expected vs actual site codes
    console.log('Expected site codes: 0201, 0202, 0301, 0306, 1209, 1801\n');
    
    // Show all unique site codes found across all tables
    const allSiteCodes = new Set();
    Object.values(tableAnalysis).forEach(table => {
      if (table.siteCodeDistribution) {
        table.siteCodeDistribution.forEach(row => allSiteCodes.add(row.site_code));
      }
    });
    
    console.log(`All unique site codes found: ${Array.from(allSiteCodes).sort().join(', ')}\n`);
    
    // Show tables that need fixing
    if (tablesNeedingFixing > 0) {
      console.log('🔧 Tables that need fixing:');
      Object.values(tableAnalysis).forEach(table => {
        if (table.needsFixing) {
          console.log(`  - ${table.tableName}`);
          if (table.malformedCodes && table.malformedCodes.length > 0) {
            console.log(`    Malformed: ${table.malformedCodes.map(c => c.site_code).join(', ')}`);
          }
          if (table.unexpectedCodes && table.unexpectedCodes.length > 0) {
            console.log(`    Unexpected: ${table.unexpectedCodes.map(c => c.site_code).join(', ')}`);
          }
        }
      });
      console.log('');
    }
    
    // Generate fix recommendations
    console.log('💡 Recommendations:');
    console.log('===================\n');
    
    if (tablesNeedingFixing > 0) {
      console.log('1. Run the fix script: node scripts/check-art-aggregate-site-codes.js');
      console.log('2. Or run the SQL script: mysql -u username -p art_aggregate < scripts/fix-art-aggregate-site-codes.sql');
      console.log('3. Verify the fixes by running this analysis again\n');
    } else {
      console.log('✅ All tables are in good state! No fixes needed.\n');
    }
    
    // Show specific fix commands for malformed codes
    const malformedCodes = new Set();
    Object.values(tableAnalysis).forEach(table => {
      if (table.malformedCodes) {
        table.malformedCodes.forEach(code => malformedCodes.add(code.site_code));
      }
    });
    
    if (malformedCodes.size > 0) {
      console.log('🔧 Specific fixes needed:');
      malformedCodes.forEach(code => {
        const paddedCode = code.padStart(4, '0');
        console.log(`  ${code} → ${paddedCode}`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the analysis
if (require.main === module) {
  analyzeArtAggregateDatabase().catch(console.error);
}

module.exports = { analyzeArtAggregateDatabase };
