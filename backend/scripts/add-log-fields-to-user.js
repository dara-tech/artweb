const mysql = require('mysql2/promise');
require('dotenv').config();

async function addLogFieldsToUser() {
  console.log('🔧 Adding Log Fields to User Table');
  
  // Database connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'preart_sites_registry'
  });

  try {
    console.log('📋 Checking current tbluser table structure...');
    
    // Check if log fields already exist
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'tbluser'
    `, [process.env.DB_NAME || 'preart_sites_registry']);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    console.log('Current columns:', existingColumns);
    
    // Define the log fields to add
    const logFields = [
      {
        name: 'lastLogin',
        definition: 'lastLogin DATETIME NULL COMMENT "Last login timestamp"'
      },
      {
        name: 'lastActivity',
        definition: 'lastActivity DATETIME NULL COMMENT "Last activity timestamp"'
      },
      {
        name: 'loginCount',
        definition: 'loginCount INT DEFAULT 0 COMMENT "Total login count"'
      },
      {
        name: 'lastIP',
        definition: 'lastIP VARCHAR(45) NULL COMMENT "Last login IP address"'
      },
      {
        name: 'userAgent',
        definition: 'userAgent TEXT NULL COMMENT "Last user agent string"'
      }
    ];
    
    // Add fields that don't exist
    for (const field of logFields) {
      if (!existingColumns.includes(field.name)) {
        try {
          console.log(`📝 Adding field: ${field.name}...`);
          await connection.execute(`ALTER TABLE tbluser ADD COLUMN ${field.definition}`);
          console.log(`✅ Added field: ${field.name}`);
        } catch (error) {
          console.log(`⚠️  Could not add ${field.name}: ${error.message}`);
        }
      } else {
        console.log(`✅ Field ${field.name} already exists`);
      }
    }
    
    // Remove isActive field if it exists (since we're using status instead)
    if (existingColumns.includes('isActive')) {
      try {
        console.log('🗑️  Removing isActive field (using status instead)...');
        await connection.execute(`ALTER TABLE tbluser DROP COLUMN isActive`);
        console.log('✅ Removed isActive field');
      } catch (error) {
        console.log(`⚠️  Could not remove isActive: ${error.message}`);
      }
    }

    // Update existing users with default values
    console.log('\n🔄 Updating existing users with default values...');
    
    // Set default lastActivity to current timestamp for users without it
    await connection.execute(`
      UPDATE tbluser 
      SET lastActivity = NOW() 
      WHERE lastActivity IS NULL
    `);
    
    // Set default loginCount to 1 for users who have lastLogin but no count
    await connection.execute(`
      UPDATE tbluser 
      SET loginCount = 1 
      WHERE lastLogin IS NOT NULL AND loginCount = 0
    `);
    
    console.log('✅ Updated existing users with default values');
    
    // Show final table structure
    console.log('\n📋 Final tbluser table structure:');
    const [finalColumns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'tbluser'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'preart_sites_registry']);
    
    finalColumns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'} ${col.COLUMN_DEFAULT ? `DEFAULT ${col.COLUMN_DEFAULT}` : ''} ${col.COLUMN_COMMENT ? `(${col.COLUMN_COMMENT})` : ''}`);
    });
    
    console.log('\n🎉 Log fields successfully added to tbluser table!');
    console.log('\n📝 Added fields:');
    logFields.forEach(field => {
      if (!existingColumns.includes(field.name)) {
        console.log(`  ✅ ${field.name}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error adding log fields:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the script
addLogFieldsToUser()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  });
