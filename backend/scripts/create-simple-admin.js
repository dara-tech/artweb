/**
 * Create Simple Admin User Script
 * Creates a simple admin user with username 'admin' and password 'admin123'
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password123',
  database: 'art_aggregates'
};

async function createSimpleAdmin() {
  let connection;
  
  try {
    console.log('🔍 Connecting to art_aggregates database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully\n');
    
    // First, let's check the table structure to see the column sizes
    console.log('📋 Checking table structure...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'art_aggregates' 
      AND TABLE_NAME = 'tbluser'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('Column information:');
    columns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE}${col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : ''}`);
    });
    
    // Delete existing users and create a new simple admin
    console.log('\n🗑️  Clearing existing users...');
    await connection.execute(`DELETE FROM tbluser`);
    
    console.log('🆕 Creating simple admin user...');
    const [result] = await connection.execute(`
      INSERT INTO tbluser (Uid, User, Fullname, Pass, Status) 
      VALUES (?, ?, ?, ?, ?)
    `, [1, 'admin', 'Administrator', 'admin123', 1]);
    
    if (result.affectedRows > 0) {
      console.log('✅ Admin user created successfully!');
      console.log(`  - Uid: ${result.insertId}`);
    } else {
      console.log('❌ Failed to create admin user');
    }
    
    // Verify the creation
    console.log('\n🔍 Verifying admin user...');
    const [users] = await connection.execute(`
      SELECT Uid, User, Fullname, Pass, Status 
      FROM tbluser 
      WHERE User = 'admin'
    `);
    
    if (users.length > 0) {
      const adminUser = users[0];
      console.log('Admin user created:');
      console.log(`  - Uid: ${adminUser.Uid}`);
      console.log(`  - User: ${adminUser.User}`);
      console.log(`  - Fullname: ${adminUser.Fullname}`);
      console.log(`  - Pass: ${adminUser.Pass}`);
      console.log(`  - Status: ${adminUser.Status}`);
    }
    
    console.log('\n🎉 Simple admin user creation completed!');
    console.log('\n📝 Login Information:');
    console.log(`  - Username: admin`);
    console.log(`  - Password: admin123`);
    console.log(`  - Status: Active (1)`);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the creation
createSimpleAdmin().catch(console.error);
