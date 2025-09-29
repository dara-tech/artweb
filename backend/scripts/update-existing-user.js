/**
 * Update Existing User Script
 * Updates the existing user with admin123 password and status 1
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

async function updateExistingUser() {
  let connection;
  
  try {
    console.log('🔍 Connecting to art_aggregates database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully\n');
    
    // Check current user
    console.log('📋 Checking current user...');
    const [users] = await connection.execute(`
      SELECT Uid, User, Fullname, Pass, Status 
      FROM tbluser 
      ORDER BY Uid
    `);
    
    if (users.length === 0) {
      console.log('❌ No users found!');
      return;
    }
    
    const currentUser = users[0];
    console.log('Current user:');
    console.log(`  - Uid: ${currentUser.Uid}`);
    console.log(`  - User: ${currentUser.User}`);
    console.log(`  - Fullname: ${currentUser.Fullname}`);
    console.log(`  - Pass: ${currentUser.Pass}`);
    console.log(`  - Status: ${currentUser.Status}\n`);
    
    // For simplicity, let's just update the password to 'admin123' (not hashed)
    // and set status to 1
    console.log('🔄 Updating user...');
    const [result] = await connection.execute(`
      UPDATE tbluser 
      SET Pass = ?, Status = 1 
      WHERE Uid = ?
    `, ['admin123', currentUser.Uid]);
    
    if (result.affectedRows > 0) {
      console.log('✅ User updated successfully!');
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
      WHERE Uid = ?
    `, [currentUser.Uid]);
    
    if (updatedUsers.length > 0) {
      const updatedUser = updatedUsers[0];
      console.log('Updated user:');
      console.log(`  - Uid: ${updatedUser.Uid}`);
      console.log(`  - User: ${updatedUser.User}`);
      console.log(`  - Fullname: ${updatedUser.Fullname}`);
      console.log(`  - Pass: ${updatedUser.Pass}`);
      console.log(`  - Status: ${updatedUser.Status}`);
    }
    
    console.log('\n🎉 User update completed successfully!');
    console.log('\n📝 Login Information:');
    console.log(`  - Username: ${currentUser.User}`);
    console.log(`  - Password: admin123`);
    console.log(`  - Status: Active (1)`);
    
  } catch (error) {
    console.error('❌ Error updating user:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the update
updateExistingUser().catch(console.error);
