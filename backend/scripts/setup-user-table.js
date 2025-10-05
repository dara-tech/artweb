#!/usr/bin/env node

/**
 * Setup User Table in Registry Database
 * Creates the tbluser table in preart_sites_registry database
 */

const mysql = require('mysql2/promise');

async function setupUserTable() {
  console.log('🔧 Setting up User Table in Registry Database');
  console.log('============================================\n');
  
  let connection;
  
  try {
    // Connect to the registry database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password123',
      database: 'preart_sites_registry'
    });
    
    console.log('✅ Connected to preart_sites_registry database');
    
    // Check if tbluser table already exists
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'preart_sites_registry' 
      AND TABLE_NAME = 'tbluser'
    `);
    
    if (tables.length > 0) {
      console.log('⚠️  tbluser table already exists');
      
      // Check if it has data
      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM tbluser');
      console.log(`📊 Current user count: ${rows[0].count}`);
      
      if (rows[0].count > 0) {
        console.log('✅ User table is ready with data');
        return;
      }
    } else {
      // Create the tbluser table
      console.log('📝 Creating tbluser table...');
      
      await connection.execute(`
        CREATE TABLE tbluser (
          Uid INT AUTO_INCREMENT PRIMARY KEY,
          User VARCHAR(50) NOT NULL UNIQUE,
          Password VARCHAR(255) NOT NULL,
          Fullname VARCHAR(100) NOT NULL,
          Status TINYINT(1) DEFAULT 1,
          CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      console.log('✅ tbluser table created successfully');
    }
    
    // Check if we need to create a default admin user
    const [existingUsers] = await connection.execute('SELECT COUNT(*) as count FROM tbluser');
    
    if (existingUsers[0].count === 0) {
      console.log('👤 Creating default admin user...');
      
      // Create a default admin user
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await connection.execute(`
        INSERT INTO tbluser (User, Password, Fullname, Status) 
        VALUES (?, ?, ?, ?)
      `, ['admin', hashedPassword, 'System Administrator', 1]);
      
      console.log('✅ Default admin user created');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ⚠️  Please change the password after first login!');
    }
    
    // Verify the setup
    const [users] = await connection.execute('SELECT Uid, User, Fullname, Status FROM tbluser');
    console.log('\n📋 Current users:');
    users.forEach(user => {
      console.log(`   - ID: ${user.Uid}, Username: ${user.User}, Name: ${user.Fullname}, Status: ${user.Status ? 'Active' : 'Inactive'}`);
    });
    
    console.log('\n🎉 User table setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up user table:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the setup
if (require.main === module) {
  setupUserTable()
    .then(() => {
      console.log('✅ User table setup completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 User table setup failed:', error);
      process.exit(1);
    });
}

module.exports = setupUserTable;
