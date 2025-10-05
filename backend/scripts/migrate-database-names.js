#!/usr/bin/env node

/**
 * Database Migration Script: preart_ to art_ naming convention
 * 
 * This script migrates existing databases from the old naming convention
 * (preart_sites_registry, preart_XXXX) to the new naming convention
 * (art_sites_registry, art_XXXX).
 * 
 * IMPORTANT: This script will:
 * 1. Create new databases with art_ prefix
 * 2. Copy all data from old databases to new ones
 * 3. Update the sites table to reference new database names
 * 4. NOT delete old databases (for safety)
 * 
 * Run this script after updating your configuration files.
 */

const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class DatabaseMigrator {
  constructor() {
    this.connection = null;
    this.oldDatabases = [];
    this.newDatabases = [];
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

  async getOldDatabases() {
    try {
      const [rows] = await this.connection.query(`
        SELECT SCHEMA_NAME 
        FROM information_schema.SCHEMATA 
        WHERE SCHEMA_NAME LIKE 'preart_%'
        ORDER BY SCHEMA_NAME
      `);
      
      this.oldDatabases = rows.map(row => row.SCHEMA_NAME);
      console.log(`📋 Found ${this.oldDatabases.length} databases to migrate:`);
      this.oldDatabases.forEach(db => console.log(`   - ${db}`));
      
      return this.oldDatabases;
    } catch (error) {
      console.error('❌ Error getting old databases:', error.message);
      throw error;
    }
  }

  async createNewDatabase(dbName) {
    const newName = dbName.replace('preart_', 'art_');
    
    try {
      // Check if new database already exists
      const [existing] = await this.connection.query(`
        SELECT SCHEMA_NAME 
        FROM information_schema.SCHEMATA 
        WHERE SCHEMA_NAME = ?
      `, [newName]);
      
      if (existing.length > 0) {
        console.log(`⚠️  Database ${newName} already exists, skipping creation`);
        return newName;
      }
      
      // Create new database
      await this.connection.query(`CREATE DATABASE \`${newName}\``);
      console.log(`✅ Created database: ${newName}`);
      
      this.newDatabases.push(newName);
      return newName;
    } catch (error) {
      console.error(`❌ Error creating database ${newName}:`, error.message);
      throw error;
    }
  }

  async copyDatabaseData(oldDb, newDb) {
    try {
      console.log(`📋 Copying data from ${oldDb} to ${newDb}...`);
      
      // Get all tables from old database
      const [tables] = await this.connection.query(`
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = ?
        ORDER BY TABLE_NAME
      `, [oldDb]);
      
      if (tables.length === 0) {
        console.log(`⚠️  No tables found in ${oldDb}`);
        return;
      }
      
      // Copy each table
      for (const table of tables) {
        const tableName = table.TABLE_NAME;
        console.log(`   📋 Copying table: ${tableName}`);
        
        // Get table structure
        const [createTable] = await this.connection.query(`
          SHOW CREATE TABLE \`${oldDb}\`.\`${tableName}\`
        `);
        
        // Create table in new database
        await this.connection.query(`USE \`${newDb}\``);
        await this.connection.query(createTable[0]['Create Table']);
        
        // Get column information to handle generated columns
        const [columns] = await this.connection.query(`
          SELECT COLUMN_NAME, EXTRA, GENERATION_EXPRESSION
          FROM information_schema.COLUMNS 
          WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
          ORDER BY ORDINAL_POSITION
        `, [oldDb, tableName]);
        
        // Filter out generated columns for data copy
        const dataColumns = columns
          .filter(col => !col.EXTRA.includes('GENERATED'))
          .map(col => col.COLUMN_NAME);
        
        if (dataColumns.length > 0) {
          const columnList = dataColumns.map(col => `\`${col}\``).join(', ');
          
          // Copy data (excluding generated columns)
          await this.connection.query(`
            INSERT INTO \`${newDb}\`.\`${tableName}\` (${columnList})
            SELECT ${columnList} FROM \`${oldDb}\`.\`${tableName}\`
          `);
        } else {
          console.log(`   ⚠️  Skipping data copy for table ${tableName} (no non-generated columns)`);
        }
        
        console.log(`   ✅ Copied table: ${tableName}`);
      }
      
      console.log(`✅ Successfully copied all data from ${oldDb} to ${newDb}`);
    } catch (error) {
      console.error(`❌ Error copying data from ${oldDb} to ${newDb}:`, error.message);
      throw error;
    }
  }

  async updateSitesTable() {
    try {
      console.log('📋 Updating sites table with new database names...');
      
      // Update database_name column in sites table
      await this.connection.query(`
        UPDATE \`art_sites_registry\`.sites 
        SET database_name = REPLACE(database_name, 'preart_', 'art_')
        WHERE database_name LIKE 'preart_%'
      `);
      
      console.log('✅ Updated sites table with new database names');
    } catch (error) {
      console.error('❌ Error updating sites table:', error.message);
      throw error;
    }
  }

  async verifyMigration() {
    try {
      console.log('🔍 Verifying migration...');
      
      // Check new databases exist
      const [newDbs] = await this.connection.query(`
        SELECT SCHEMA_NAME 
        FROM information_schema.SCHEMATA 
        WHERE SCHEMA_NAME LIKE 'art_%'
        ORDER BY SCHEMA_NAME
      `);
      
      console.log(`✅ Found ${newDbs.length} new databases:`);
      newDbs.forEach(db => console.log(`   - ${db.SCHEMA_NAME}`));
      
      // Check sites table
      const [sites] = await this.connection.query(`
        SELECT code, name, database_name 
        FROM \`art_sites_registry\`.sites 
        WHERE status = 1
        ORDER BY code
      `);
      
      console.log(`✅ Found ${sites.length} active sites:`);
      sites.forEach(site => console.log(`   - ${site.code}: ${site.name} -> ${site.database_name}`));
      
      console.log('🎉 Migration verification completed successfully!');
    } catch (error) {
      console.error('❌ Error verifying migration:', error.message);
      throw error;
    }
  }

  async migrate() {
    try {
      console.log('🚀 Starting Database Migration: preart_ to art_');
      console.log('================================================\n');
      
      // Step 1: Connect to MySQL
      await this.connect();
      
      // Step 2: Get old databases
      await this.getOldDatabases();
      
      if (this.oldDatabases.length === 0) {
        console.log('ℹ️  No preart_ databases found. Migration not needed.');
        return;
      }
      
      // Step 3: Create new databases and copy data
      for (const oldDb of this.oldDatabases) {
        const newDb = await this.createNewDatabase(oldDb);
        await this.copyDatabaseData(oldDb, newDb);
      }
      
      // Step 4: Update sites table
      await this.updateSitesTable();
      
      // Step 5: Verify migration
      await this.verifyMigration();
      
      console.log('\n🎉 Migration completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Test your application with the new database names');
      console.log('2. Update your .env file if needed');
      console.log('3. Restart your backend server');
      console.log('4. Once confirmed working, you can safely drop old databases:');
      this.oldDatabases.forEach(db => console.log(`   DROP DATABASE \`${db}\`;`));
      
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      throw error;
    } finally {
      if (this.connection) {
        await this.connection.end();
        console.log('✅ Database connection closed');
      }
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  const migrator = new DatabaseMigrator();
  migrator.migrate()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error.message);
      process.exit(1);
    });
}

module.exports = DatabaseMigrator;
