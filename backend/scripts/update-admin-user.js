/**
 * Update Admin User Script
 * Updates admin user password and status in art_aggregates database
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password123',
  database: 'art_aggregates'
};

async function updateAdminUser() {
  let connection;
  
  try {
    console.log('🔍 Connecting to art_aggregates database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully\n');
    
    // Check current admin user
    console.log('📋 Checking current admin user...');
    const [users] = await connection.execute(`
      SELECT Uid, User, Fullname, Pass, Status 
      FROM tbluser 
      WHERE User = 'admin'
    `);
    
    if (users.length === 0) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    const adminUser = users[0];
    console.log('Current admin user:');
    console.log(`  - Uid: ${adminUser.Uid}`);
    console.log(`  - User: ${adminUser.User}`);
    console.log(`  - Fullname: ${adminUser.Fullname}`);
    console.log(`  - Pass: ${adminUser.Pass}`);
    console.log(`  - Status: ${adminUser.Status}\n`);
    
    // Hash the new password
    console.log('🔐 Hashing new password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);
    console.log('✅ Password hashed successfully\n');
    
    // Update admin user
    console.log('🔄 Updating admin user...');
    const [result] = await connection.execute(`
      UPDATE tbluser 
      SET Pass = ?, Status = 1 
      WHERE User = 'admin'
    `, [hashedPassword]);
    
    if (result.affectedRows > 0) {
      console.log('✅ Admin user updated successfully!');
      console.log(`  - Password: admin123`);
      console.log(`  - Status: 1 (Active)`);
    } else {
      console.log('❌ No rows were updated');
    }
    
    // Verify the update
    console.log('\n🔍 Verifying update...');
    const [updatedUsers] = await connection.execute(`
      SELECT Uid, User, Fullname, Pass, Status 
      FROM tbluser 
      WHERE User = 'admin'
    `);
    
    if (updatedUsers.length > 0) {
      const updatedUser = updatedUsers[0];
      console.log('Updated admin user:');
      console.log(`  - Uid: ${updatedUser.Uid}`);
      console.log(`  - User: ${updatedUser.User}`);
      console.log(`  - Fullname: ${updatedUser.Fullname}`);
      console.log(`  - Pass: ${updatedUser.Pass ? '[HASHED]' : 'Not set'}`);
      console.log(`  - Status: ${updatedUser.Status}`);
      
      // Test password verification
      const isPasswordValid = await bcrypt.compare('admin123', updatedUser.Pass);
      console.log(`  - Password Verification: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
    }
    
    console.log('\n🎉 Admin user update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating admin user:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the update
updateAdminUser().catch(console.error);
