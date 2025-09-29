/**
 * Database Structure Comparison Tool
 * Compares table structures between art_aggregates and preart databases
 * to determine data insertion compatibility
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configurations
const artAggregatesConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password123',
  database: 'art_aggregates'
};

const preartConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password123',
  database: 'preart'
};

async function compareDatabaseStructures() {
  let artAggregatesConnection, preartConnection;
  
  try {
    console.log('🔍 Connecting to databases...');
    
    // Connect to both databases
    artAggregatesConnection = await mysql.createConnection(artAggregatesConfig);
    preartConnection = await mysql.createConnection(preartConfig);
    
    console.log('✅ Connected to both databases\n');
    
    // Get all tables from both databases
    console.log('📋 Getting table lists...');
    const [artAggregatesTables] = await artAggregatesConnection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'art_aggregates' 
      ORDER BY TABLE_NAME
    `);
    
    const [preartTables] = await preartConnection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'preart' 
      ORDER BY TABLE_NAME
    `);
    
    const artAggregatesTableNames = artAggregatesTables.map(t => t.TABLE_NAME);
    const preartTableNames = preartTables.map(t => t.TABLE_NAME);
    
    console.log(`📊 art_aggregates: ${artAggregatesTableNames.length} tables`);
    console.log(`📊 preart: ${preartTableNames.length} tables\n`);
    
    // Find common tables
    const commonTables = artAggregatesTableNames.filter(name => preartTableNames.includes(name));
    const artAggregatesOnly = artAggregatesTableNames.filter(name => !preartTableNames.includes(name));
    const preartOnly = preartTableNames.filter(name => !artAggregatesTableNames.includes(name));
    
    console.log(`🔄 Common tables: ${commonTables.length}`);
    console.log(`📤 art_aggregates only: ${artAggregatesOnly.length}`);
    console.log(`📥 preart only: ${preartOnly.length}\n`);
    
    // Compare structures of common tables
    const comparisonResults = {
      compatible: [],
      incompatible: [],
      warnings: []
    };
    
    console.log('🔍 Comparing table structures...\n');
    
    for (const tableName of commonTables) {
      console.log(`📋 Analyzing: ${tableName}`);
      
      // Get column information for both databases
      const [artAggregatesColumns] = await artAggregatesConnection.execute(`
        SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          IS_NULLABLE,
          COLUMN_DEFAULT,
          CHARACTER_MAXIMUM_LENGTH,
          NUMERIC_PRECISION,
          NUMERIC_SCALE,
          COLUMN_KEY,
          EXTRA
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'art_aggregates' 
        AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `, [tableName]);
      
      const [preartColumns] = await preartConnection.execute(`
        SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          IS_NULLABLE,
          COLUMN_DEFAULT,
          CHARACTER_MAXIMUM_LENGTH,
          NUMERIC_PRECISION,
          NUMERIC_SCALE,
          COLUMN_KEY,
          EXTRA
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'preart' 
        AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `, [tableName]);
      
      // Compare column structures
      const comparison = compareTableStructures(tableName, artAggregatesColumns, preartColumns);
      
      if (comparison.compatible) {
        comparisonResults.compatible.push(comparison);
        console.log(`  ✅ Compatible`);
      } else {
        comparisonResults.incompatible.push(comparison);
        console.log(`  ❌ Incompatible`);
      }
      
      if (comparison.warnings.length > 0) {
        comparisonResults.warnings.push(...comparison.warnings);
        console.log(`  ⚠️  ${comparison.warnings.length} warnings`);
      }
      
      console.log('');
    }
    
    // Generate summary report
    generateSummaryReport(comparisonResults, artAggregatesOnly, preartOnly);
    
    // Generate data insertion recommendations
    generateInsertionRecommendations(comparisonResults);
    
  } catch (error) {
    console.error('❌ Error during comparison:', error.message);
  } finally {
    if (artAggregatesConnection) await artAggregatesConnection.end();
    if (preartConnection) await preartConnection.end();
    console.log('🔌 Database connections closed');
  }
}

function compareTableStructures(tableName, artAggregatesColumns, preartColumns) {
  const artAggregatesColMap = new Map(artAggregatesColumns.map(col => [col.COLUMN_NAME, col]));
  const preartColMap = new Map(preartColumns.map(col => [col.COLUMN_NAME, col]));
  
  const comparison = {
    tableName,
    compatible: true,
    differences: [],
    warnings: [],
    artAggregatesColumns: artAggregatesColumns.length,
    preartColumns: preartColumns.length
  };
  
  // Check for missing columns
  for (const artCol of artAggregatesColumns) {
    const preartCol = preartColMap.get(artCol.COLUMN_NAME);
    if (!preartCol) {
      comparison.differences.push({
        type: 'missing_in_preart',
        column: artCol.COLUMN_NAME,
        details: `Column exists in art_aggregates but not in preart`
      });
      comparison.compatible = false;
    } else {
      // Compare column properties
      const columnDiff = compareColumnProperties(artCol, preartCol);
      if (columnDiff.length > 0) {
        comparison.differences.push(...columnDiff);
        if (columnDiff.some(diff => diff.severity === 'error')) {
          comparison.compatible = false;
        }
      }
    }
  }
  
  // Check for extra columns in preart
  for (const preartCol of preartColumns) {
    const artCol = artAggregatesColMap.get(preartCol.COLUMN_NAME);
    if (!artCol) {
      comparison.differences.push({
        type: 'extra_in_preart',
        column: preartCol.COLUMN_NAME,
        details: `Column exists in preart but not in art_aggregates`,
        severity: 'warning'
      });
      comparison.warnings.push(`Extra column in preart: ${preartCol.COLUMN_NAME}`);
    }
  }
  
  return comparison;
}

function compareColumnProperties(artCol, preartCol) {
  const differences = [];
  
  // Compare data types
  if (artCol.DATA_TYPE !== preartCol.DATA_TYPE) {
    differences.push({
      type: 'data_type_mismatch',
      column: artCol.COLUMN_NAME,
      artAggregates: artCol.DATA_TYPE,
      preart: preartCol.DATA_TYPE,
      severity: 'error'
    });
  }
  
  // Compare nullability
  if (artCol.IS_NULLABLE !== preartCol.IS_NULLABLE) {
    differences.push({
      type: 'nullability_mismatch',
      column: artCol.COLUMN_NAME,
      artAggregates: artCol.IS_NULLABLE,
      preart: preartCol.IS_NULLABLE,
      severity: 'warning'
    });
  }
  
  // Compare character length for string types
  if (artCol.CHARACTER_MAXIMUM_LENGTH !== preartCol.CHARACTER_MAXIMUM_LENGTH) {
    differences.push({
      type: 'length_mismatch',
      column: artCol.COLUMN_NAME,
      artAggregates: artCol.CHARACTER_MAXIMUM_LENGTH,
      preart: preartCol.CHARACTER_MAXIMUM_LENGTH,
      severity: 'warning'
    });
  }
  
  // Compare numeric precision
  if (artCol.NUMERIC_PRECISION !== preartCol.NUMERIC_PRECISION) {
    differences.push({
      type: 'precision_mismatch',
      column: artCol.COLUMN_NAME,
      artAggregates: artCol.NUMERIC_PRECISION,
      preart: preartCol.NUMERIC_PRECISION,
      severity: 'warning'
    });
  }
  
  return differences;
}

function generateSummaryReport(comparisonResults, artAggregatesOnly, preartOnly) {
  console.log('📊 STRUCTURE COMPARISON SUMMARY');
  console.log('================================\n');
  
  console.log(`✅ Compatible tables: ${comparisonResults.compatible.length}`);
  console.log(`❌ Incompatible tables: ${comparisonResults.incompatible.length}`);
  console.log(`⚠️  Total warnings: ${comparisonResults.warnings.length}\n`);
  
  if (artAggregatesOnly.length > 0) {
    console.log('📤 Tables only in art_aggregates:');
    artAggregatesOnly.forEach(table => console.log(`  - ${table}`));
    console.log('');
  }
  
  if (preartOnly.length > 0) {
    console.log('📥 Tables only in preart:');
    preartOnly.forEach(table => console.log(`  - ${table}`));
    console.log('');
  }
  
  if (comparisonResults.incompatible.length > 0) {
    console.log('❌ Incompatible tables:');
    comparisonResults.incompatible.forEach(table => {
      console.log(`  - ${table.tableName} (${table.differences.length} differences)`);
    });
    console.log('');
  }
}

function generateInsertionRecommendations(comparisonResults) {
  console.log('💡 DATA INSERTION RECOMMENDATIONS');
  console.log('==================================\n');
  
  if (comparisonResults.compatible.length > 0) {
    console.log('✅ Tables ready for data insertion:');
    comparisonResults.compatible.forEach(table => {
      console.log(`  - ${table.tableName} (${table.artAggregatesColumns} columns)`);
    });
    console.log('');
  }
  
  if (comparisonResults.incompatible.length > 0) {
    console.log('🔧 Tables needing structure fixes:');
    comparisonResults.incompatible.forEach(table => {
      console.log(`  - ${table.tableName}:`);
      table.differences.forEach(diff => {
        console.log(`    • ${diff.details}`);
      });
    });
    console.log('');
  }
  
  console.log('📋 Next steps:');
  console.log('1. Fix incompatible table structures');
  console.log('2. Create data migration script for compatible tables');
  console.log('3. Test data insertion with sample data');
  console.log('4. Run full data migration');
}

// Run the comparison
compareDatabaseStructures().catch(console.error);
