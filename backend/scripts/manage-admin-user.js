/**
 * Manage Admin User Script
 * Creates or updates admin user in art_aggregates database
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

async function manageAdminUser() {
  let connection;
  
  try {
    console.log('🔍 Connecting to art_aggregates database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully\n');
    
    // Check all users
    console.log('📋 Checking all users...');
    const [users] = await connection.execute(`
      SELECT Uid, User, Fullname, Pass, Status 
      FROM tbluser 
      ORDER BY Uid
    `);
    
    console.log(`Found ${users.length} user(s):`);
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`  - Uid: ${user.Uid}`);
      console.log(`  - User: ${user.User}`);
      console.log(`  - Fullname: ${user.Fullname}`);
      console.log(`  - Pass: ${user.Pass}`);
      console.log(`  - Status: ${user.Status}`);
    });
    
    // Hash the new password
    console.log('\n🔐 Hashing new password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);
    console.log('✅ Password hashed successfully\n');
    
    // Check if admin user exists
    const adminUser = users.find(u => u.User === 'admin');
    
    if (adminUser) {
      // Update existing admin user
      console.log('🔄 Updating existing admin user...');
      const [result] = await connection.execute(`
        UPDATE tbluser 
        SET Pass = ?, Status = 1 
        WHERE User = 'admin'
      `, [hashedPassword]);
      
      if (result.affectedRows > 0) {
        console.log('✅ Admin user updated successfully!');
      } else {
        console.log('❌ No rows were updated');
      }
    } else {
      // Create new admin user
      console.log('🆕 Creating new admin user...');
      const [result] = await connection.execute(`
        INSERT INTO tbluser (User, Fullname, Pass, Status) 
        VALUES (?, ?, ?, ?)
      `, ['admin', 'Administrator', hashedPassword, 1]);
      
      if (result.affectedRows > 0) {
        console.log('✅ Admin user created successfully!');
        console.log(`  - New Uid: ${result.insertId}`);
      } else {
        console.log('❌ Failed to create admin user');
      }
    }
    
    // Verify the final result
    console.log('\n🔍 Verifying final result...');
    const [finalUsers] = await connection.execute(`
      SELECT Uid, User, Fullname, Pass, Status 
      FROM tbluser 
      WHERE User = 'admin'
    `);
    
    if (finalUsers.length > 0) {
      const finalUser = finalUsers[0];
      console.log('Final admin user:');
      console.log(`  - Uid: ${finalUser.Uid}`);
      console.log(`  - User: ${finalUser.User}`);
      console.log(`  - Fullname: ${finalUser.Fullname}`);
      console.log(`  - Pass: ${finalUser.Pass ? '[HASHED]' : 'Not set'}`);
      console.log(`  - Status: ${finalUser.Status}`);
      
      // Test password verification
      const isPasswordValid = await bcrypt.compare('admin123', finalUser.Pass);
      console.log(`  - Password Verification: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
    } else {
      console.log('❌ Admin user not found after operation');
    }
    
    console.log('\n🎉 Admin user management completed successfully!');
    
  } catch (error) {
    console.error('❌ Error managing admin user:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the management
manageAdminUser().catch(console.error);
