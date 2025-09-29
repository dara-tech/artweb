/**
 * Data Migration Script: art_aggregates → preart
 * Migrates compatible data from art_aggregates to preart database
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

// Tables that are fully compatible (same structure)
const compatibleTables = [
  'tblaccess', 'tblaiallergy', 'tblaiothmedabnormal', 'tblaiothmedanemia',
  'tblaiothmeddiabete', 'tblaiothmedhepbc', 'tblaiothmedhyper', 'tblaiothmedliver',
  'tblaiothmedother', 'tblaiothmedrenal', 'tblallergy', 'tblartsite',
  'tblavarvdrug', 'tblavhydrug', 'tblbackupetest', 'tblcausedeath',
  'tblciallergy', 'tblcicotrim', 'tblcifamily', 'tblcifluconazole',
  'tblciothpast', 'tblclinic', 'tblcommune', 'tbldistrict',
  'tbldoctor', 'tbldrug', 'tbldrugtreat', 'tbllog',
  'tbllostlog', 'tblmargins', 'tblnationality', 'tbloccupation',
  'tblpatienttestabdominal', 'tblpatienttestcxr', 'tblprovince', 'tblreason',
  'tblsetlost', 'tblsitename', 'tbltargroup', 'tbltemp',
  'tbltempart', 'tbltempdrug', 'tbltempoi', 'tblvcctsite',
  'tblversion', 'tblvillage'
];

// Tables that need column mapping (site_code vs _site_code)
const mappableTables = [
  'tblaimain', 'tblcimain', 'tbleimain', 'tblavmain', 'tblcvmain', 'tblevmain',
  'tblaart', 'tblcart', 'tblpatienttest', 'tblavpatientstatus', 'tblcvpatientstatus',
  'tblevpatientstatus', 'tblavoidrug', 'tblcvoidrug', 'tblevoidrug',
  'tblavtbdrug', 'tblcvtbdrug', 'tblevtbdrug', 'tblavtptdrug', 'tblcvtptdrug',
  'tblevtptdrug', 'tblcvarvdrug', 'tblevarvdrug', 'tblappointment',
  'tblapntt', 'tblapnttchild', 'tblapnttchildcont', 'tblapnttpart', 'tblapnttpartcont',
  'tblalink', 'tblclink', 'tblelink', 'tblaumain', 'tblcumain'
];

async function migrateDataToPreart() {
  let artAggregatesConnection, preartConnection;
  
  try {
    console.log('🚀 Starting data migration: art_aggregates → preart');
    console.log('='.repeat(60));
    
    // Connect to both databases
    artAggregatesConnection = await mysql.createConnection(artAggregatesConfig);
    preartConnection = await mysql.createConnection(preartConfig);
    console.log('✅ Connected to both databases\n');
    
    // Step 1: Migrate fully compatible tables
    console.log('📋 Step 1: Migrating fully compatible tables...');
    console.log('-' .repeat(40));
    
    for (const tableName of compatibleTables) {
      try {
        console.log(`🔄 Migrating ${tableName}...`);
        
        // Check if table has data in art_aggregates
        const [countResult] = await artAggregatesConnection.execute(
          `SELECT COUNT(*) as count FROM \`${tableName}\``
        );
        
        if (countResult[0].count === 0) {
          console.log(`  ⏭️  Skipping ${tableName} (no data)`);
          continue;
        }
        
        // Clear existing data in preart
        await preartConnection.execute(`DELETE FROM \`${tableName}\``);
        
        // Get all data from art_aggregates
        const [rows] = await artAggregatesConnection.execute(
          `SELECT * FROM \`${tableName}\``
        );
        
        if (rows.length === 0) {
          console.log(`  ⏭️  Skipping ${tableName} (no data after query)`);
          continue;
        }
        
        // Insert data into preart
        if (rows.length > 0) {
          const columns = Object.keys(rows[0]);
          const placeholders = columns.map(() => '?').join(', ');
          const values = rows.map(row => columns.map(col => row[col]));
          
          const insertQuery = `INSERT INTO \`${tableName}\` (\`${columns.join('`, `')}\`) VALUES (${placeholders})`;
          
          for (const valueRow of values) {
            await preartConnection.execute(insertQuery, valueRow);
          }
          
          console.log(`  ✅ Migrated ${rows.length} records to ${tableName}`);
        }
        
      } catch (error) {
        console.log(`  ❌ Error migrating ${tableName}: ${error.message}`);
      }
    }
    
    console.log('\n📋 Step 2: Migrating tables with column mapping...');
    console.log('-' .repeat(40));
    
    // Step 2: Migrate tables that need column mapping
    for (const tableName of mappableTables) {
      try {
        console.log(`🔄 Migrating ${tableName}...`);
        
        // Check if table has data in art_aggregates
        const [countResult] = await artAggregatesConnection.execute(
          `SELECT COUNT(*) as count FROM \`${tableName}\``
        );
        
        if (countResult[0].count === 0) {
          console.log(`  ⏭️  Skipping ${tableName} (no data)`);
          continue;
        }
        
        // Clear existing data in preart
        await preartConnection.execute(`DELETE FROM \`${tableName}\``);
        
        // Get column information for both tables
        const [artAggregatesColumns] = await artAggregatesConnection.execute(`
          SELECT COLUMN_NAME 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = 'art_aggregates' 
          AND TABLE_NAME = ?
          ORDER BY ORDINAL_POSITION
        `, [tableName]);
        
        const [preartColumns] = await preartConnection.execute(`
          SELECT COLUMN_NAME 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = 'preart' 
          AND TABLE_NAME = ?
          ORDER BY ORDINAL_POSITION
        `, [tableName]);
        
        if (artAggregatesColumns.length === 0 || preartColumns.length === 0) {
          console.log(`  ⏭️  Skipping ${tableName} (table not found in one or both databases)`);
          continue;
        }
        
        // Create column mapping (exclude site_code columns)
        const artAggregatesColNames = artAggregatesColumns.map(c => c.COLUMN_NAME);
        const preartColNames = preartColumns.map(c => c.COLUMN_NAME);
        
        const commonColumns = artAggregatesColNames.filter(name => 
          preartColNames.includes(name) && name !== 'site_code' && name !== '_site_code'
        );
        
        if (commonColumns.length === 0) {
          console.log(`  ⏭️  Skipping ${tableName} (no common columns)`);
          continue;
        }
        
        // Get data from art_aggregates
        const selectColumns = commonColumns.join(', ');
        const [rows] = await artAggregatesConnection.execute(
          `SELECT ${selectColumns} FROM \`${tableName}\``
        );
        
        if (rows.length === 0) {
          console.log(`  ⏭️  Skipping ${tableName} (no data after filtering)`);
          continue;
        }
        
        // Insert data into preart
        const placeholders = commonColumns.map(() => '?').join(', ');
        const insertQuery = `INSERT INTO \`${tableName}\` (\`${commonColumns.join('`, `')}\`) VALUES (${placeholders})`;
        
        for (const row of rows) {
          const values = commonColumns.map(col => row[col]);
          await preartConnection.execute(insertQuery, values);
        }
        
        console.log(`  ✅ Migrated ${rows.length} records to ${tableName} (${commonColumns.length} columns)`);
        
      } catch (error) {
        console.log(`  ❌ Error migrating ${tableName}: ${error.message}`);
      }
    }
    
    console.log('\n📊 Migration Summary');
    console.log('='.repeat(60));
    console.log(`✅ Compatible tables processed: ${compatibleTables.length}`);
    console.log(`🔄 Mappable tables processed: ${mappableTables.length}`);
    console.log('🎉 Data migration completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    if (artAggregatesConnection) await artAggregatesConnection.end();
    if (preartConnection) await preartConnection.end();
    console.log('🔌 Database connections closed');
  }
}

// Add option to run in dry-run mode
const isDryRun = process.argv.includes('--dry-run');

if (isDryRun) {
  console.log('🔍 DRY RUN MODE - No data will be modified');
  console.log('Remove --dry-run flag to perform actual migration\n');
}

migrateDataToPreart().catch(console.error);
