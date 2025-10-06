const mysql = require('mysql2/promise');

async function updateRoleEnum() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'preart_sites_registry'
  });

  try {
    console.log('🔧 Updating Role enum to include data_manager...');
    
    // First, check current column definition
    const [columns] = await connection.execute(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'tbluser' AND COLUMN_NAME = 'Role'
    `, [process.env.DB_NAME || 'preart_sites_registry']);
    
    console.log('Current Role column type:', columns[0]?.COLUMN_TYPE);
    
    // Update the enum to include data_manager
    await connection.execute(`
      ALTER TABLE tbluser 
      MODIFY COLUMN Role ENUM(
        'super_admin', 
        'admin', 
        'doctor', 
        'nurse', 
        'data_entry', 
        'viewer', 
        'site_manager', 
        'data_manager'
      ) NOT NULL DEFAULT 'viewer'
    `);
    
    console.log('✅ Role enum updated successfully');
    
    // Verify the update
    const [updatedColumns] = await connection.execute(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'tbluser' AND COLUMN_NAME = 'Role'
    `, [process.env.DB_NAME || 'preart_sites_registry']);
    
    console.log('Updated Role column type:', updatedColumns[0]?.COLUMN_TYPE);
    
  } catch (error) {
    console.error('❌ Error updating Role enum:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function main() {
  try {
    await updateRoleEnum();
    console.log('✅ Database schema updated successfully');
  } catch (error) {
    console.error('❌ Failed to update database schema:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateRoleEnum };
