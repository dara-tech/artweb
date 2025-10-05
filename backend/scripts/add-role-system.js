#!/usr/bin/env node

/**
 * Add Role System to User Table
 * Adds Role and AssignedSites columns to existing tbluser table
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password123',
  database: 'art_sites_registry'
};

async function addRoleSystem() {
  console.log('🔧 Adding Role System to User Table');
  console.log('===================================\n');
  
  let connection;
  
  try {
    // Connect to the registry database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to art_sites_registry database');
    
    // Check if Role column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'art_sites_registry' 
      AND TABLE_NAME = 'tbluser' 
      AND COLUMN_NAME = 'Role'
    `);
    
    if (columns.length > 0) {
      console.log('✅ Role system already exists in tbluser table');
      
      // Show current users and their roles
      const [users] = await connection.execute(`
        SELECT Uid, User, Fullname, Role, AssignedSites, Status 
        FROM tbluser 
        ORDER BY Uid
      `);
      
      console.log('\n📊 Current users:');
      users.forEach(user => {
        console.log(`  - ${user.User} (${user.Fullname}) - Role: ${user.Role} - Sites: ${user.AssignedSites || 'All'}`);
      });
      
      return;
    }
    
    // Add Role column
    console.log('📝 Adding Role column...');
    await connection.execute(`
      ALTER TABLE tbluser 
      ADD COLUMN Role ENUM('super_admin', 'admin', 'doctor', 'nurse', 'data_entry', 'viewer', 'site_manager') 
      NOT NULL DEFAULT 'viewer' 
      AFTER Status
    `);
    console.log('✅ Role column added');
    
    // Add AssignedSites column
    console.log('📝 Adding AssignedSites column...');
    await connection.execute(`
      ALTER TABLE tbluser 
      ADD COLUMN AssignedSites JSON NULL 
      AFTER Role
    `);
    console.log('✅ AssignedSites column added');
    
    // Update existing users
    console.log('👤 Updating existing users...');
    
    // Get all existing users
    const [existingUsers] = await connection.execute(`
      SELECT Uid, User, Fullname FROM tbluser
    `);
    
    for (const user of existingUsers) {
      let role = 'viewer';
      let assignedSites = null;
      
      // Set admin role for 'admin' username
      if (user.User.toLowerCase() === 'admin') {
        role = 'super_admin';
        assignedSites = null; // Super admin can access all sites
      } else {
        // Default to viewer role for other users
        role = 'viewer';
        assignedSites = null; // Viewers can see all sites by default
      }
      
      await connection.execute(`
        UPDATE tbluser 
        SET Role = ?, AssignedSites = ? 
        WHERE Uid = ?
      `, [role, assignedSites, user.Uid]);
      
      console.log(`  - Updated ${user.User}: ${role} role`);
    }
    
    // Verify the changes
    console.log('\n📊 Updated users:');
    const [updatedUsers] = await connection.execute(`
      SELECT Uid, User, Fullname, Role, AssignedSites, Status 
      FROM tbluser 
      ORDER BY Uid
    `);
    
    updatedUsers.forEach(user => {
      console.log(`  - ${user.User} (${user.Fullname}) - Role: ${user.Role} - Sites: ${user.AssignedSites || 'All'}`);
    });
    
    console.log('\n✅ Role system successfully added to user table!');
    console.log('\n📋 Available roles:');
    console.log('  - super_admin: Full system access, user management, all sites');
    console.log('  - admin: Site management, user management for assigned sites');
    console.log('  - doctor: Patient care, medical data entry, reports');
    console.log('  - nurse: Patient care, basic data entry');
    console.log('  - data_entry: Data entry only, no medical decisions');
    console.log('  - viewer: Read-only access to reports and data');
    console.log('  - site_manager: Manage specific site operations');
    
  } catch (error) {
    console.error('❌ Error adding role system:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the script
if (require.main === module) {
  addRoleSystem().catch(console.error);
}

module.exports = { addRoleSystem };
