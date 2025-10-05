#!/usr/bin/env node

/**
 * Create separate databases for each site and import data from backup files
 * This script creates individual databases for each site instead of using an aggregated approach
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const mysql = require('mysql2/promise');
require('dotenv').config();

const execAsync = promisify(exec);

// Site mapping from backup files
const SITE_MAPPING = {
  'preart_0201_20250925.sql': {
    code: '0201',
    name: 'Maung Russey RH',
    province: 'Battambang',
    type: 'RH'
  },
  'preart_0202_20250925.sql': {
    code: '0202', 
    name: 'Battambang PH',
    province: 'Battambang',
    type: 'PH'
  },
  'preart_0301_20250925.sql': {
    code: '0301',
    name: 'Kampong Cham PH', 
    province: 'Kampong Cham',
    type: 'PH'
  },
  'preart_0306_20250925.sql': {
    code: '0306',
    name: 'Tbong Khmum RH',
    province: 'Tbong Khmum', 
    type: 'RH'
  },
  'preart_1209_20250925.sql': {
    code: '1209',
    name: 'Phnom Penh RH',
    province: 'Phnom Penh',
    type: 'RH'
  },
  'preart_1801_20250925.sql': {
    code: '1801',
    name: 'Siem Reap RH',
    province: 'Siem Reap',
    type: 'RH'
  }
};

class SiteDatabaseManager {
  constructor() {
    this.dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8mb4'
    };
    this.backupsDir = path.join(__dirname, '../backups');
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(this.dbConfig);
      console.log('✅ Connected to MySQL server');
    } catch (error) {
      console.error('❌ Failed to connect to MySQL:', error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log('✅ Disconnected from MySQL server');
    }
  }

  async createDatabase(dbName) {
    try {
      await this.connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`✅ Created database: ${dbName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to create database ${dbName}:`, error.message);
      return false;
    }
  }

  async importBackupFile(backupFile, siteInfo) {
    const dbName = `art_${siteInfo.code}`;
    const backupPath = path.join(this.backupsDir, backupFile);
    
    if (!fs.existsSync(backupPath)) {
      console.error(`❌ Backup file not found: ${backupPath}`);
      return false;
    }

    try {
      console.log(`📥 Importing ${backupFile} to database ${dbName}...`);
      
      // Use mysql command line tool for large file imports
      const command = `mysql -h${this.dbConfig.host} -P${this.dbConfig.port} -u${this.dbConfig.user} -p${this.dbConfig.password} ${dbName} < "${backupPath}"`;
      
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr && !stderr.includes('Warning')) {
        console.error(`❌ Import error for ${backupFile}:`, stderr);
        return false;
      }
      
      console.log(`✅ Successfully imported ${backupFile} to ${dbName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to import ${backupFile}:`, error.message);
      return false;
    }
  }

  async createSiteRegistry() {
    try {
      const registryDb = 'preart_sites_registry';
      await this.createDatabase(registryDb);
      
      // Switch to registry database
      await this.connection.query(`USE \`${registryDb}\``);
      
      // Drop existing table if it exists
      await this.connection.query('DROP TABLE IF EXISTS `sites`');
      
      // Create sites table
      const createSitesTable = `
        CREATE TABLE IF NOT EXISTS \`sites\` (
          \`id\` int(11) NOT NULL AUTO_INCREMENT,
          \`code\` varchar(10) NOT NULL,
          \`name\` varchar(100) NOT NULL,
          \`province\` varchar(50) NOT NULL,
          \`type\` varchar(20) NOT NULL,
          \`database_name\` varchar(50) NOT NULL,
          \`status\` tinyint(1) NOT NULL DEFAULT 1,
          \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`code_unique\` (\`code\`),
          UNIQUE KEY \`database_name_unique\` (\`database_name\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await this.connection.query(createSitesTable);
      console.log('✅ Created sites registry table');
      
      // Insert site information
      for (const [backupFile, siteInfo] of Object.entries(SITE_MAPPING)) {
        const dbName = `art_${siteInfo.code}`;
        
        const insertSite = `
          INSERT INTO sites (code, name, province, type, database_name, status) 
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          province = VALUES(province),
          type = VALUES(type),
          database_name = VALUES(database_name),
          status = VALUES(status),
          updated_at = CURRENT_TIMESTAMP
        `;
        
        await this.connection.query(insertSite, [
          siteInfo.code,
          siteInfo.name,
          siteInfo.province,
          siteInfo.type,
          dbName,
          1
        ]);
        
        console.log(`✅ Registered site: ${siteInfo.name} (${siteInfo.code}) -> ${dbName}`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to create site registry:', error.message);
      return false;
    }
  }

  async verifyDatabaseStructure(dbName) {
    try {
      await this.connection.query(`USE \`${dbName}\``);
      
      // Get list of tables
      const [tables] = await this.connection.query('SHOW TABLES');
      const tableCount = tables.length;
      
      // Get total record count
      let totalRecords = 0;
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        try {
          const [count] = await this.connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
          totalRecords += count[0].count;
        } catch (err) {
          // Skip tables that can't be counted (views, etc.)
        }
      }
      
      console.log(`📊 Database ${dbName}: ${tableCount} tables, ${totalRecords} total records`);
      return { tableCount, totalRecords };
    } catch (error) {
      console.error(`❌ Failed to verify database ${dbName}:`, error.message);
      return null;
    }
  }

  async run() {
    console.log('🚀 Starting site database creation and import process...\n');
    
    try {
      await this.connect();
      
      // Step 1: Create site registry database
      console.log('📋 Step 1: Creating site registry...');
      await this.createSiteRegistry();
      console.log('');
      
      // Step 2: Create individual site databases and import data
      console.log('🏗️  Step 2: Creating site databases and importing data...');
      
      const results = [];
      for (const [backupFile, siteInfo] of Object.entries(SITE_MAPPING)) {
        const dbName = `art_${siteInfo.code}`;
        
        console.log(`\n📍 Processing site: ${siteInfo.name} (${siteInfo.code})`);
        
        // Create database
        const dbCreated = await this.createDatabase(dbName);
        if (!dbCreated) {
          results.push({ site: siteInfo.code, status: 'failed', error: 'Database creation failed' });
          continue;
        }
        
        // Import backup data
        const importSuccess = await this.importBackupFile(backupFile, siteInfo);
        if (!importSuccess) {
          results.push({ site: siteInfo.code, status: 'failed', error: 'Data import failed' });
          continue;
        }
        
        // Verify database structure
        const verification = await this.verifyDatabaseStructure(dbName);
        if (verification) {
          results.push({ 
            site: siteInfo.code, 
            status: 'success', 
            tables: verification.tableCount,
            records: verification.totalRecords
          });
        } else {
          results.push({ site: siteInfo.code, status: 'warning', error: 'Verification failed' });
        }
      }
      
      // Step 3: Summary
      console.log('\n📊 SUMMARY:');
      console.log('='.repeat(50));
      
      const successful = results.filter(r => r.status === 'success');
      const failed = results.filter(r => r.status === 'failed');
      const warnings = results.filter(r => r.status === 'warning');
      
      console.log(`✅ Successful: ${successful.length}`);
      console.log(`❌ Failed: ${failed.length}`);
      console.log(`⚠️  Warnings: ${warnings.length}`);
      
      if (successful.length > 0) {
        console.log('\n✅ Successfully processed sites:');
        successful.forEach(result => {
          console.log(`   - ${result.site}: ${result.tables} tables, ${result.records} records`);
        });
      }
      
      if (failed.length > 0) {
        console.log('\n❌ Failed sites:');
        failed.forEach(result => {
          console.log(`   - ${result.site}: ${result.error}`);
        });
      }
      
      if (warnings.length > 0) {
        console.log('\n⚠️  Sites with warnings:');
        warnings.forEach(result => {
          console.log(`   - ${result.site}: ${result.error}`);
        });
      }
      
      console.log('\n🎉 Site database creation process completed!');
      console.log('\nNext steps:');
      console.log('1. Update your application configuration to use the new database structure');
      console.log('2. Test the application with the new site-specific databases');
      console.log('3. Update any queries that reference the old aggregated database');
      
    } catch (error) {
      console.error('💥 Fatal error:', error.message);
      process.exit(1);
    } finally {
      await this.disconnect();
    }
  }
}

// Run the script
if (require.main === module) {
  const manager = new SiteDatabaseManager();
  manager.run().catch(console.error);
}

module.exports = SiteDatabaseManager;
