/**
 * Detailed Column Analysis
 * Analyzes specific column differences between art_aggregates and preart
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

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

async function analyzeColumnDifferences() {
  let artAggregatesConnection, preartConnection;
  
  try {
    console.log('🔍 Connecting to databases...');
    artAggregatesConnection = await mysql.createConnection(artAggregatesConfig);
    preartConnection = await mysql.createConnection(preartConfig);
    console.log('✅ Connected to both databases\n');
    
    // Focus on key patient tables
    const keyTables = [
      'tblaimain', 'tblcimain', 'tbleimain', 
      'tblavmain', 'tblcvmain', 'tblevmain',
      'tblaart', 'tblcart', 'tbleart',
      'tblpatienttest'
    ];
    
    for (const tableName of keyTables) {
      console.log(`📋 Analyzing: ${tableName}`);
      console.log('='.repeat(50));
      
      // Get columns from both databases
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
      
      if (artAggregatesColumns.length === 0 && preartColumns.length === 0) {
        console.log('❌ Table not found in either database\n');
        continue;
      }
      
      console.log(`📊 art_aggregates: ${artAggregatesColumns.length} columns`);
      console.log(`📊 preart: ${preartColumns.length} columns\n`);
      
      // Show columns in art_aggregates but not in preart
      const artAggregatesColNames = artAggregatesColumns.map(c => c.COLUMN_NAME);
      const preartColNames = preartColumns.map(c => c.COLUMN_NAME);
      
      const onlyInArtAggregates = artAggregatesColNames.filter(name => !preartColNames.includes(name));
      const onlyInPreart = preartColNames.filter(name => !artAggregatesColNames.includes(name));
      
      if (onlyInArtAggregates.length > 0) {
        console.log('📤 Columns only in art_aggregates:');
        onlyInArtAggregates.forEach(colName => {
          const col = artAggregatesColumns.find(c => c.COLUMN_NAME === colName);
          console.log(`  - ${colName} (${col.DATA_TYPE}${col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : ''})`);
        });
        console.log('');
      }
      
      if (onlyInPreart.length > 0) {
        console.log('📥 Columns only in preart:');
        onlyInPreart.forEach(colName => {
          const col = preartColumns.find(c => c.COLUMN_NAME === colName);
          console.log(`  - ${colName} (${col.DATA_TYPE}${col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : ''})`);
        });
        console.log('');
      }
      
      // Show common columns with differences
      const commonColumns = artAggregatesColNames.filter(name => preartColNames.includes(name));
      if (commonColumns.length > 0) {
        console.log('🔄 Common columns with differences:');
        commonColumns.forEach(colName => {
          const artCol = artAggregatesColumns.find(c => c.COLUMN_NAME === colName);
          const preartCol = preartColumns.find(c => c.COLUMN_NAME === colName);
          
          const differences = [];
          if (artCol.DATA_TYPE !== preartCol.DATA_TYPE) {
            differences.push(`type: ${artCol.DATA_TYPE} vs ${preartCol.DATA_TYPE}`);
          }
          if (artCol.IS_NULLABLE !== preartCol.IS_NULLABLE) {
            differences.push(`nullable: ${artCol.IS_NULLABLE} vs ${preartCol.IS_NULLABLE}`);
          }
          if (artCol.CHARACTER_MAXIMUM_LENGTH !== preartCol.CHARACTER_MAXIMUM_LENGTH) {
            differences.push(`length: ${artCol.CHARACTER_MAXIMUM_LENGTH} vs ${preartCol.CHARACTER_MAXIMUM_LENGTH}`);
          }
          
          if (differences.length > 0) {
            console.log(`  - ${colName}: ${differences.join(', ')}`);
          }
        });
        console.log('');
      }
      
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
  } finally {
    if (artAggregatesConnection) await artAggregatesConnection.end();
    if (preartConnection) await preartConnection.end();
    console.log('🔌 Database connections closed');
  }
}

analyzeColumnDifferences().catch(console.error);
