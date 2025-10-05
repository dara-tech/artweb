#!/usr/bin/env node

/**
 * Cleanup Migration Script
 * 
 * This script removes any partially created art_ databases
 * so we can start the migration fresh.
 */

const mysql = require('mysql2/promise');

class MigrationCleanup {
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

  async dropDatabase(dbName) {
    try {
      await this.connection.query(`DROP DATABASE \`${dbName}\``);
      console.log(`✅ Dropped database: ${dbName}`);
    } catch (error) {
      console.error(`❌ Error dropping database ${dbName}:`, error.message);
      throw error;
    }
  }

  async cleanup() {
    try {
      console.log('🧹 Cleaning up art_ databases...');
      console.log('================================\n');
      
      await this.connect();
      
      const artDatabases = await this.getArtDatabases();
      
      if (artDatabases.length === 0) {
        console.log('ℹ️  No art_ databases found. Nothing to clean up.');
        return;
      }
      
      console.log(`📋 Found ${artDatabases.length} art_ databases to remove:`);
      artDatabases.forEach(db => console.log(`   - ${db}`));
      
      console.log('\n⚠️  WARNING: This will permanently delete all art_ databases!');
      console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
      
      // Wait 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      for (const dbName of artDatabases) {
        await this.dropDatabase(dbName);
      }
      
      console.log('\n✅ Cleanup completed successfully!');
      console.log('You can now run the migration script again.');
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      throw error;
    } finally {
      if (this.connection) {
        await this.connection.end();
        console.log('✅ Database connection closed');
      }
    }
  }
}

// Run cleanup if called directly
if (require.main === module) {
  const cleanup = new MigrationCleanup();
  cleanup.cleanup()
    .then(() => {
      console.log('✅ Cleanup script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Cleanup script failed:', error.message);
      process.exit(1);
    });
}

module.exports = MigrationCleanup;
