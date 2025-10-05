#!/usr/bin/env node

/**
 * Revert Database Names from art_ to preart_
 * 
 * This script renames all art_ databases back to preart_ naming convention
 * and updates all configuration files accordingly.
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

class DatabaseReverter {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password123'
      });
      console.log('✅ Connected to MySQL server');
    } catch (error) {
      console.error('❌ Failed to connect to MySQL:', error.message);
      throw error;
    }
  }

  async getArtDatabases() {
    try {
      const [rows] = await this.connection.query(`
        SELECT SCHEMA_NAME 
        FROM information_schema.SCHEMATA 
        WHERE SCHEMA_NAME LIKE 'art_%'
        ORDER BY SCHEMA_NAME
      `);
      
      return rows.map(row => row.SCHEMA_NAME);
    } catch (error) {
      console.error('❌ Error getting art_ databases:', error.message);
      throw error;
    }
  }

  async renameDatabase(oldName, newName) {
    try {
      // MySQL doesn't support ALTER DATABASE RENAME, so we need to:
      // 1. Create new database
      // 2. Copy all data
      // 3. Drop old database
      
      console.log(`🔄 Renaming database: ${oldName} → ${newName}`);
      
      // Create new database
      await this.connection.query(`CREATE DATABASE \`${newName}\``);
      console.log(`   ✅ Created database: ${newName}`);
      
      // Get all tables from old database
      const [tables] = await this.connection.query(`
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = '${oldName}'
      `);
      
      // Copy each table
      for (const table of tables) {
        const tableName = table.TABLE_NAME;
        console.log(`   📋 Copying table: ${tableName}`);
        
        // Get CREATE TABLE statement
        const [createTable] = await this.connection.query(`SHOW CREATE TABLE \`${oldName}\`.\`${tableName}\``);
        
        // Create table in new database
        await this.connection.query(`USE \`${newName}\``);
        await this.connection.query(createTable[0]['Create Table']);
        
        // Copy data
        await this.connection.query(`
          INSERT INTO \`${newName}\`.\`${tableName}\` 
          SELECT * FROM \`${oldName}\`.\`${tableName}\`
        `);
        
        console.log(`   ✅ Copied table: ${tableName}`);
      }
      
      // Drop old database
      await this.connection.query(`DROP DATABASE \`${oldName}\``);
      console.log(`   ✅ Dropped old database: ${oldName}`);
      
      console.log(`✅ Successfully renamed database: ${oldName} → ${newName}`);
    } catch (error) {
      console.error(`❌ Error renaming database ${oldName}:`, error.message);
      throw error;
    }
  }

  async updateSitesTable() {
    try {
      // Update sites table to use preart_ naming
      await this.connection.query(`
        UPDATE \`preart_sites_registry\`.\`sites\` 
        SET database_name = REPLACE(database_name, 'art_', 'preart_')
        WHERE database_name LIKE 'art_%'
      `);
      console.log('✅ Updated sites table with preart_ naming');
    } catch (error) {
      console.error('❌ Error updating sites table:', error.message);
      throw error;
    }
  }

  async revertDatabases() {
    try {
      console.log('🔄 Reverting database names from art_ to preart_...');
      console.log('================================================\n');
      
      await this.connect();
      
      const artDatabases = await this.getArtDatabases();
      
      if (artDatabases.length === 0) {
        console.log('ℹ️  No art_ databases found. Nothing to revert.');
        return;
      }
      
      console.log(`📋 Found ${artDatabases.length} art_ databases to revert:`);
      artDatabases.forEach(db => console.log(`   - ${db}`));
      
      // Rename databases
      for (const artDb of artDatabases) {
        const preartDb = artDb.replace('art_', 'preart_');
        await this.renameDatabase(artDb, preartDb);
      }
      
      // Update sites table
      await this.updateSitesTable();
      
      console.log('\n🎉 Database reversion completed successfully!');
      console.log('All art_ databases have been renamed to preart_ naming convention.');
      
    } catch (error) {
      console.error('❌ Database reversion failed:', error.message);
      throw error;
    } finally {
      if (this.connection) {
        await this.connection.end();
        console.log('✅ Database connection closed');
      }
    }
  }

  async updateConfigurationFiles() {
    console.log('\n📝 Updating configuration files...');
    console.log('===================================');
    
    const filesToUpdate = [
      'src/config/database.js',
      'src/config/siteDatabase.js',
      'env.example',
      'env.production',
      'scripts/validate-indicators.js',
      'scripts/add-role-system.js',
      'scripts/safe-site-update.js',
      'scripts/setup-user-table.js',
      'scripts/verify-site-specific-usage.js',
      'scripts/create-site-databases.js',
      'scripts/run-site-setup.js',
      'src/scripts/run-all-workbench-scripts.js',
      'src/scripts/run-all-workbench-scripts-v2.js',
      'src/routes/import.js'
    ];

    for (const filePath of filesToUpdate) {
      try {
        const fullPath = path.join(__dirname, '..', filePath);
        if (fs.existsSync(fullPath)) {
          let content = fs.readFileSync(fullPath, 'utf8');
          
          // Replace preart_sites_registry with preart_sites_registry
          content = content.replace(/preart_sites_registry/g, 'preart_sites_registry');
          
          // Replace art_ with preart_ in database names
          content = content.replace(/art_(\d{4})/g, 'preart_$1');
          
          fs.writeFileSync(fullPath, content);
          console.log(`✅ Updated: ${filePath}`);
        } else {
          console.log(`⚠️  File not found: ${filePath}`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
      }
    }
  }
}

// Run reversion if called directly
if (require.main === module) {
  const reverter = new DatabaseReverter();
  
  reverter.revertDatabases()
    .then(() => reverter.updateConfigurationFiles())
    .then(() => {
      console.log('\n🎉 Complete reversion to preart_ naming successful!');
      console.log('Please restart your application to use the new naming convention.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Reversion failed:', error.message);
      process.exit(1);
    });
}

module.exports = DatabaseReverter;
