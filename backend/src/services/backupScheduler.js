const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

// Backup scheduler service
class BackupScheduler {
  constructor() {
    this.isRunning = false;
    this.scheduledJobs = new Map();
    this.ENCRYPTION_PASSWORD = '090666847';
    this.BACKUP_DIR = path.join(__dirname, '../../backups');
    this.MAX_BACKUPS = 30; // Keep only 30 backups
  }

  // Create MySQL connection for backup operations
  async createBackupConnection() {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'preart',
      port: process.env.DB_PORT || 3306
    });
    return connection;
  }

  // Encrypt data using same method as old system
  encryptData(data, password) {
    const cipher = crypto.createCipher('aes-256-cbc', password);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // Get site information for backup filename
  async getSiteInfo(connection) {
    try {
      // First try to get from the new multi-site table (tblartsite)
      const [artSites] = await connection.execute('SELECT COUNT(*) as siteCount FROM tblartsite WHERE Status = 1');
      const siteCount = artSites[0].siteCount;
      
      if (siteCount > 0) {
        // Multi-site system - use "MultiSite" as identifier
        return {
          siteName: 'MultiSite',
          siteCount: siteCount,
          isMultiSite: true
        };
      } else {
        // Fallback to old single-site table (tblsitename)
        const [rows] = await connection.execute('SELECT SiteName FROM tblsitename LIMIT 1');
        return {
          siteName: rows.length > 0 ? rows[0].SiteName : 'ART',
          siteCount: 1,
          isMultiSite: false
        };
      }
    } catch (error) {
      console.error('Error getting site information:', error);
      return {
        siteName: 'ART',
        siteCount: 1,
        isMultiSite: false
      };
    }
  }

  // Create backup
  async createBackup() {
    try {
      console.log('Starting scheduled backup...');
      const connection = await this.createBackupConnection();
      
      // Get site information for filename
      const siteInfo = await this.getSiteInfo(connection);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString()
        .replace(/:/g, '_')
        .replace(/T/g, '_')
        .replace(/\..+/, '')
        .replace(/-/g, '_');
      
      const filename = `AUTO_${siteInfo.siteName}_${timestamp}.h149`;
      const filepath = path.join(this.BACKUP_DIR, filename);
      
      // Get all tables
      const [tables] = await connection.execute('SHOW TABLES');
      
      let backupData = '';
      backupData += `-- ART Database Backup (Scheduled)\n`;
      backupData += `-- Created: ${new Date().toISOString()}\n`;
      backupData += `-- Site: ${siteInfo.siteName} (${siteInfo.siteCount} sites)\n`;
      backupData += `-- Multi-Site: ${siteInfo.isMultiSite ? 'Yes' : 'No'}\n\n`;
      
      // Backup each table
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        
        // Get table structure
        const [createTable] = await connection.execute(`SHOW CREATE TABLE \`${tableName}\``);
        backupData += `-- Table structure for ${tableName}\n`;
        backupData += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
        backupData += `${createTable[0]['Create Table']};\n\n`;
        
        // Get table data
        const [rows] = await connection.execute(`SELECT * FROM \`${tableName}\``);
        
        if (rows.length > 0) {
          backupData += `-- Data for table ${tableName}\n`;
          
          // Get column names
          const [columns] = await connection.execute(`DESCRIBE \`${tableName}\``);
          const columnNames = columns.map(col => `\`${col.Field}\``).join(', ');
          
          // Insert data in chunks
          const chunkSize = 1000;
          for (let i = 0; i < rows.length; i += chunkSize) {
            const chunk = rows.slice(i, i + chunkSize);
            
            backupData += `INSERT INTO \`${tableName}\` (${columnNames}) VALUES\n`;
            
            const values = chunk.map(row => {
              const rowValues = Object.values(row).map(value => {
                if (value === null) return 'NULL';
                if (typeof value === 'string') {
                  return `'${value.replace(/'/g, "''")}'`;
                }
                return value;
              });
              return `(${rowValues.join(', ')})`;
            });
            
            backupData += values.join(',\n') + ';\n\n';
          }
        }
      }
      
      // Encrypt the backup data
      const encryptedData = this.encryptData(backupData, this.ENCRYPTION_PASSWORD);
      
      // Write to file
      fs.writeFileSync(filepath, encryptedData);
      
      await connection.end();
      
      // Clean up old backups
      await this.cleanupOldBackups();
      
      console.log(`Scheduled backup completed: ${filename}`);
      return { success: true, filename, filepath };
      
    } catch (error) {
      console.error('Scheduled backup error:', error);
      return { success: false, error: error.message };
    }
  }

  // Clean up old backups (keep only MAX_BACKUPS)
  async cleanupOldBackups() {
    try {
      if (!fs.existsSync(this.BACKUP_DIR)) return;
      
      const files = fs.readdirSync(this.BACKUP_DIR)
        .filter(file => file.endsWith('.h149'))
        .map(file => {
          const filepath = path.join(this.BACKUP_DIR, file);
          return {
            name: file,
            path: filepath,
            created: fs.statSync(filepath).birthtime
          };
        })
        .sort((a, b) => b.created - a.created); // Sort by newest first
      
      // Remove old backups if we have more than MAX_BACKUPS
      if (files.length > this.MAX_BACKUPS) {
        const filesToDelete = files.slice(this.MAX_BACKUPS);
        for (const file of filesToDelete) {
          fs.unlinkSync(file.path);
          console.log(`Deleted old backup: ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old backups:', error);
    }
  }

  // Schedule daily backup at 2 AM
  scheduleDailyBackup() {
    if (this.isRunning) {
      console.log('Backup scheduler is already running');
      return;
    }

    this.isRunning = true;
    
    // Schedule daily backup at 2:00 AM
    const dailyJob = cron.schedule('0 2 * * *', async () => {
      console.log('Running scheduled daily backup...');
      await this.createBackup();
    }, {
      scheduled: true,
      timezone: "Asia/Phnom_Penh"
    });

    this.scheduledJobs.set('daily', dailyJob);
    console.log('Daily backup scheduled for 2:00 AM (Phnom Penh time)');
  }

  // Schedule weekly backup on Sunday at 3 AM
  scheduleWeeklyBackup() {
    if (this.scheduledJobs.has('weekly')) {
      console.log('Weekly backup is already scheduled');
      return;
    }

    // Schedule weekly backup on Sunday at 3:00 AM
    const weeklyJob = cron.schedule('0 3 * * 0', async () => {
      console.log('Running scheduled weekly backup...');
      await this.createBackup();
    }, {
      scheduled: true,
      timezone: "Asia/Phnom_Penh"
    });

    this.scheduledJobs.set('weekly', weeklyJob);
    console.log('Weekly backup scheduled for Sunday 3:00 AM (Phnom Penh time)');
  }

  // Schedule monthly backup on 1st of month at 4 AM
  scheduleMonthlyBackup() {
    if (this.scheduledJobs.has('monthly')) {
      console.log('Monthly backup is already scheduled');
      return;
    }

    // Schedule monthly backup on 1st of month at 4:00 AM
    const monthlyJob = cron.schedule('0 4 1 * *', async () => {
      console.log('Running scheduled monthly backup...');
      await this.createBackup();
    }, {
      scheduled: true,
      timezone: "Asia/Phnom_Penh"
    });

    this.scheduledJobs.set('monthly', monthlyJob);
    console.log('Monthly backup scheduled for 1st of month 4:00 AM (Phnom Penh time)');
  }

  // Start all scheduled backups
  start() {
    this.scheduleDailyBackup();
    this.scheduleWeeklyBackup();
    this.scheduleMonthlyBackup();
    console.log('Backup scheduler started');
  }

  // Stop all scheduled backups
  stop() {
    this.scheduledJobs.forEach((job, name) => {
      job.stop();
      console.log(`Stopped ${name} backup schedule`);
    });
    this.scheduledJobs.clear();
    this.isRunning = false;
    console.log('Backup scheduler stopped');
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      scheduledJobs: Array.from(this.scheduledJobs.keys()),
      maxBackups: this.MAX_BACKUPS,
      backupDirectory: this.BACKUP_DIR
    };
  }
}

// Create singleton instance
const backupScheduler = new BackupScheduler();

module.exports = backupScheduler;
