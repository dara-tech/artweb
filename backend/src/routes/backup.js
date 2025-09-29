const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const backupScheduler = require('../services/backupScheduler');

// MySQL backup configuration
const ENCRYPTION_PASSWORD = '090666847'; // Same as old system
const BACKUP_DIR = path.join(__dirname, '../../backups');
const MAX_SQL_LENGTH = 3145728; // Same as old system

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  dest: BACKUP_DIR,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.h149')) {
      cb(null, true);
    } else {
      cb(new Error('Only .h149 backup files are allowed'), false);
    }
  }
});

// Create MySQL connection for backup operations
const createBackupConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'preart',
    port: process.env.DB_PORT || 3306
  });
  return connection;
};

// Encrypt data using same method as old system
const encryptData = (data, password) => {
  const key = crypto.createHash('sha256').update(password).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

// Decrypt data using same method as old system
const decryptData = (encryptedData, password) => {
  try {
    const key = crypto.createHash('sha256').update(password).digest();
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    throw new Error(`Failed to decrypt backup file. The file may be corrupted or not a valid backup file. Error: ${error.message}`);
  }
};

// Note: Old encryption functions removed - they were not working with the legacy backup files

// Get site information for backup filename
const getSiteInfo = async (connection) => {
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
};

// Create database backup
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const connection = await createBackupConnection();
    
    // Get site information for filename
    const siteInfo = await getSiteInfo(connection);
    
    // Generate filename with timestamp (same format as old system)
    const timestamp = new Date().toISOString()
      .replace(/:/g, '_')
      .replace(/T/g, '_')
      .replace(/\..+/, '')
      .replace(/-/g, '_');
    
    const filename = `${siteInfo.siteName}_${timestamp}.h149`;
    const filepath = path.join(BACKUP_DIR, filename);
    
    // Get all tables
    const [tables] = await connection.execute('SHOW TABLES');
    
    let backupData = '';
    backupData += `-- ART Database Backup\n`;
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
        
        // Insert data in chunks to avoid memory issues
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
    const encryptedData = encryptData(backupData, ENCRYPTION_PASSWORD);
    
    // Write to file
    fs.writeFileSync(filepath, encryptedData);
    
    await connection.end();
    
    res.json({
      success: true,
      message: 'Backup created successfully',
      filename: filename,
      filepath: filepath,
      size: fs.statSync(filepath).size,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create backup',
      error: error.message
    });
  }
});

// List available backups
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.endsWith('.h149') || /^[a-f0-9]{32}$/.test(file) || file.length === 32) // Include both .h149 files and hash-named files
      .map(file => {
        const filepath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filepath);
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          type: file.endsWith('.h149') ? 'encrypted' : 'hash'
        };
      })
      .sort((a, b) => b.created - a.created); // Sort by newest first
    
    res.json({
      success: true,
      backups: files
    });
    
  } catch (error) {
    console.error('List backups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list backups',
      error: error.message
    });
  }
});

// Download backup file
router.get('/download/:filename', authenticateToken, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(BACKUP_DIR, filename);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Backup file not found'
      });
    }
    
    res.download(filepath, filename);
    
  } catch (error) {
    console.error('Download backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download backup',
      error: error.message
    });
  }
});

// Restore database from backup
router.post('/restore', authenticateToken, async (req, res) => {
  let connection;
  try {
    const { filename } = req.body;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }
    
    const filepath = path.join(BACKUP_DIR, filename);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Backup file not found'
      });
    }
    
    console.log(`Starting restore from backup: ${filename}`);
    connection = await createBackupConnection();
    
    // Read and decrypt backup file
    console.log('Reading and decrypting backup file...');
    const encryptedData = fs.readFileSync(filepath, 'utf8');
    
    let backupData;
    try {
      // Try new format first (IV:encrypted)
      backupData = decryptData(encryptedData, ENCRYPTION_PASSWORD);
      console.log('Successfully decrypted backup using new format');
    } catch (error) {
      console.log('New format failed, checking if file is old encrypted format...');
      
      // Check if this looks like an old encrypted backup
      const lines = encryptedData.split('\n').filter(line => line.trim().length > 0);
      const firstLine = lines[0]?.trim();
      
      // Check if it looks like Base64 encrypted data
      const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
      const looksEncrypted = firstLine && base64Regex.test(firstLine) && firstLine.length > 20;
      
      if (looksEncrypted) {
        console.log('File appears to be old encrypted backup format');
        throw new Error(`⚠️  Old Encrypted Backup Detected

This backup file was created with the old VB.NET system and is encrypted.
Unfortunately, the decryption method cannot be fully replicated in the new system.

Options:
1. Use the original VB.NET application to restore this backup
2. Create a new backup using the current system
3. Contact support for assistance with legacy backup files

File: ${filename}
Size: ${encryptedData.length} bytes
Lines: ${lines.length}`);
      } else {
        // Try as unencrypted data
        console.log('File does not appear to be encrypted, trying as plain SQL...');
        backupData = encryptedData;
      }
    }
    
    console.log('Backup data length:', backupData.length);
    
    // Drop and recreate database (same as old system)
    console.log('Dropping existing database...');
    await connection.query('DROP DATABASE IF EXISTS preart');
    
    console.log('Creating new database...');
    await connection.query('CREATE DATABASE preart DEFAULT CHARACTER SET utf8');
    await connection.query('USE preart');
    
    // Execute backup SQL
    console.log('Executing backup SQL statements...');
    const statements = backupData.split(';').filter(stmt => stmt.trim());
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          await connection.execute(statement);
          successCount++;
          if (i % 100 === 0) {
            console.log(`Executed ${i + 1}/${statements.length} statements...`);
          }
        } catch (error) {
          errorCount++;
          console.warn(`Warning executing statement ${i + 1}:`, error.message);
          // Continue with other statements
        }
      }
    }
    
    console.log(`Restore completed: ${successCount} successful, ${errorCount} errors`);
    
    await connection.end();
    
    res.json({
      success: true,
      message: `Database restored successfully! ${successCount} statements executed, ${errorCount} warnings.`,
      filename: filename,
      timestamp: new Date().toISOString(),
      stats: {
        totalStatements: statements.length,
        successful: successCount,
        errors: errorCount
      }
    });
    
  } catch (error) {
    console.error('Restore error:', error);
    if (connection) {
      try {
        await connection.end();
      } catch (endError) {
        console.error('Error closing connection:', endError);
      }
    }
    res.status(500).json({
      success: false,
      message: 'Failed to restore database',
      error: error.message
    });
  }
});

// Restore database from uploaded file
router.post('/restore-upload', authenticateToken, upload.single('backupFile'), async (req, res) => {
  let connection;
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No backup file uploaded'
      });
    }

    const uploadedFile = req.file;
    const originalName = req.file.originalname;
    
    console.log(`Starting restore from uploaded file: ${originalName}`);
    
    // Move uploaded file to proper location with original name
    const finalPath = path.join(BACKUP_DIR, originalName);
    fs.renameSync(uploadedFile.path, finalPath);
    
    // Validate file size and content
    const fileStats = fs.statSync(finalPath);
    if (fileStats.size === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Uploaded file is empty. Please select a valid backup file.' 
      });
    }
    
    console.log(`File size: ${fileStats.size} bytes`);
    
    connection = await createBackupConnection();
    
    // Read and decrypt backup file
    console.log('Reading and decrypting uploaded backup file...');
    let backupData;
    try {
      const encryptedData = fs.readFileSync(finalPath, 'utf8');
      
      // Basic validation - check if file contains hex data
      if (!/^[0-9a-fA-F]+$/.test(encryptedData.trim())) {
        // Check if it's base64 (common mistake)
        if (/^[A-Za-z0-9+/=]+$/.test(encryptedData.trim())) {
          return res.status(400).json({ 
            success: false, 
            message: 'Invalid backup file format. This appears to be a base64-encoded file, but our system expects hex-encoded backup files. Please use a backup file created by this system.' 
          });
        } else {
          return res.status(400).json({ 
            success: false, 
            message: 'Invalid backup file format. The file does not appear to be a valid encrypted backup created by this system.' 
          });
        }
      }
      
      backupData = decryptData(encryptedData, ENCRYPTION_PASSWORD);
    } catch (error) {
      console.error('Upload restore error:', error);
      return res.status(400).json({ 
        success: false, 
        message: `Failed to process backup file: ${error.message}` 
      });
    }
    
    console.log('Backup data length:', backupData.length);
    
    // Drop and recreate database (same as old system)
    console.log('Dropping existing database...');
    await connection.query('DROP DATABASE IF EXISTS preart');
    
    console.log('Creating new database...');
    await connection.query('CREATE DATABASE preart DEFAULT CHARACTER SET utf8');
    await connection.query('USE preart');
    
    // Execute backup SQL
    console.log('Executing backup SQL statements...');
    const statements = backupData.split(';').filter(stmt => stmt.trim());
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          await connection.execute(statement);
          successCount++;
          if (i % 100 === 0) {
            console.log(`Executed ${i + 1}/${statements.length} statements...`);
          }
        } catch (error) {
          errorCount++;
          console.warn(`Warning executing statement ${i + 1}:`, error.message);
          // Continue with other statements
        }
      }
    }
    
    console.log(`Restore completed: ${successCount} successful, ${errorCount} errors`);
    
    await connection.end();
    
    // Clean up uploaded file
    fs.unlinkSync(finalPath);
    
    res.json({
      success: true,
      message: `Database restored successfully from uploaded file! ${successCount} statements executed, ${errorCount} warnings.`,
      filename: originalName,
      timestamp: new Date().toISOString(),
      stats: {
        totalStatements: statements.length,
        successful: successCount,
        errors: errorCount
      }
    });
    
  } catch (error) {
    console.error('Upload restore error:', error);
    if (connection) {
      try {
        await connection.end();
      } catch (endError) {
        console.error('Error closing connection:', endError);
      }
    }
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to restore database from uploaded file',
      error: error.message
    });
  }
});

// Delete backup file
router.delete('/:filename', authenticateToken, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(BACKUP_DIR, filename);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Backup file not found'
      });
    }
    
    fs.unlinkSync(filepath);
    
    res.json({
      success: true,
      message: 'Backup file deleted successfully',
      filename: filename
    });
    
  } catch (error) {
    console.error('Delete backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete backup',
      error: error.message
    });
  }
});

// Get backup status and statistics
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.endsWith('.h149'));
    
    const totalSize = files.reduce((total, file) => {
      const filepath = path.join(BACKUP_DIR, file);
      return total + fs.statSync(filepath).size;
    }, 0);
    
    const latestBackup = files.length > 0 ? 
      files.map(file => {
        const filepath = path.join(BACKUP_DIR, file);
        return {
          filename: file,
          created: fs.statSync(filepath).birthtime
        };
      }).sort((a, b) => b.created - a.created)[0] : null;
    
    res.json({
      success: true,
      statistics: {
        totalBackups: files.length,
        totalSize: totalSize,
        latestBackup: latestBackup,
        backupDirectory: BACKUP_DIR
      }
    });
    
  } catch (error) {
    console.error('Backup status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get backup status',
      error: error.message
    });
  }
});

// Start backup scheduler
router.post('/scheduler/start', authenticateToken, async (req, res) => {
  try {
    backupScheduler.start();
    res.json({
      success: true,
      message: 'Backup scheduler started',
      status: backupScheduler.getStatus()
    });
  } catch (error) {
    console.error('Start scheduler error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start backup scheduler',
      error: error.message
    });
  }
});

// Stop backup scheduler
router.post('/scheduler/stop', authenticateToken, async (req, res) => {
  try {
    backupScheduler.stop();
    res.json({
      success: true,
      message: 'Backup scheduler stopped',
      status: backupScheduler.getStatus()
    });
  } catch (error) {
    console.error('Stop scheduler error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to stop backup scheduler',
      error: error.message
    });
  }
});

// Get scheduler status
router.get('/scheduler/status', authenticateToken, async (req, res) => {
  try {
    const status = backupScheduler.getStatus();
    res.json({
      success: true,
      status: status
    });
  } catch (error) {
    console.error('Get scheduler status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get scheduler status',
      error: error.message
    });
  }
});

// Create immediate backup (for testing)
router.post('/create-immediate', authenticateToken, async (req, res) => {
  try {
    const result = await backupScheduler.createBackup();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Immediate backup created successfully',
        filename: result.filename,
        filepath: result.filepath,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create immediate backup',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Immediate backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create immediate backup',
      error: error.message
    });
  }
});

// Special endpoint for restoring old system backup files
router.post('/restore-old', authenticateToken, async (req, res) => {
  let connection;
  try {
    const { filename } = req.body;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Backup filename is required'
      });
    }
    
    console.log(`Starting restore from old system backup: ${filename}`);
    
    // Check if file exists
    const filepath = path.join(BACKUP_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Backup file not found'
      });
    }
    
    connection = await createBackupConnection();
    
    // Drop and recreate database
    console.log('Dropping and recreating database...');
    await connection.query('DROP DATABASE IF EXISTS preart');
    await connection.query('CREATE DATABASE preart DEFAULT CHARACTER SET utf8');
    await connection.query('USE preart');
    
    // Read the encrypted file
    console.log('Reading encrypted backup file...');
    const encryptedData = fs.readFileSync(filepath, 'utf8');
    
    // Try different decryption methods for old VB.NET MySqlBackup format
    const methods = [
      {
        name: 'Raw MySQL dump (no encryption)',
        decrypt: (data) => data
      },
      {
        name: 'Base64 Decode Only',
        decrypt: (data) => {
          try {
            return Buffer.from(data, 'base64').toString('utf8');
          } catch (e) {
            throw new Error('Base64 decode failed: ' + e.message);
          }
        }
      },
      {
        name: 'MySqlBackup.NET 2.0.12 format',
        decrypt: (data) => {
          try {
            // MySqlBackup.NET uses PBKDF2 with specific parameters
            const password = '090666847';
            const salt = Buffer.from('MySqlBackup.NET', 'utf8');
            const key = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256');
            const iv = Buffer.alloc(16, 0);
            
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decrypted = decipher.update(data, 'binary', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
          } catch (e) {
            throw new Error('MySqlBackup.NET decryption failed: ' + e.message);
          }
        }
      },
      {
        name: 'AES-256-CBC with SHA256 key',
        decrypt: (data) => {
          try {
            const key = crypto.createHash('sha256').update('090666847').digest();
            const iv = Buffer.alloc(16, 0);
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decrypted = decipher.update(data, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
          } catch (e) {
            throw new Error('AES-256-CBC decryption failed: ' + e.message);
          }
        }
      }
    ];
    
    let successfulMethod = null;
    let decryptedContent = null;
    
    for (const method of methods) {
      try {
        console.log(`Trying ${method.name}...`);
        decryptedContent = method.decrypt(encryptedData);
        
        // Check if the result looks like a MySQL dump
        if (decryptedContent.includes('-- MySQL dump') || 
            decryptedContent.includes('CREATE TABLE') ||
            decryptedContent.includes('INSERT INTO') ||
            decryptedContent.includes('DROP TABLE') ||
            decryptedContent.includes('CREATE DATABASE')) {
          console.log(`Success with ${method.name}!`);
          successfulMethod = method;
          break;
        }
      } catch (error) {
        console.log(`${method.name} failed:`, error.message);
      }
    }
    
    if (!successfulMethod) {
      // Try binary analysis
      try {
        const binaryData = fs.readFileSync(filepath);
        const textData = binaryData.toString('utf8');
        
        if (textData.includes('CREATE TABLE') || textData.includes('INSERT INTO')) {
          console.log('Found SQL content in binary data!');
          decryptedContent = textData;
          successfulMethod = { name: 'Binary Analysis' };
        }
      } catch (error) {
        console.log('Binary analysis failed:', error.message);
      }
    }
    
    if (!successfulMethod) {
      return res.status(400).json({
        success: false,
        message: 'Unable to decrypt the old system backup file. The file uses a proprietary encryption format that cannot be decrypted by this system.'
      });
    }
    
    // Process the decrypted content
    console.log('Processing decrypted MySQL dump...');
    
    const statements = decryptedContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
          successCount++;
        } catch (error) {
          console.log(`Warning: ${error.message}`);
          errorCount++;
        }
      }
    }
    
    // Create admin user
    try {
      await connection.query(`
        INSERT INTO tbluser (Uid, User, Pass, Fullname, Status) 
        VALUES (1, 'admin', 'password', 'Administrator', 1)
        ON DUPLICATE KEY UPDATE User = 'admin', Pass = 'password', Fullname = 'Administrator', Status = 1
      `);
    } catch (error) {
      console.log('Could not create admin user:', error.message);
    }
    
    // Check final database state
    const [tables] = await connection.query('SHOW TABLES');
    
    res.json({
      success: true,
      message: `Old system backup restored successfully! ${successCount} statements executed, ${errorCount} warnings.`,
      filename: filename,
      timestamp: new Date().toISOString(),
      stats: {
        totalStatements: statements.length,
        successful: successCount,
        errors: errorCount
      },
      tables: tables.length
    });
    
  } catch (error) {
    console.error('Old system restore error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore old system backup',
      error: error.message
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Upload and test old system backup file
router.post('/upload-test-old', upload.single('backupFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No backup file uploaded' });
    }
    
    const filename = req.file.filename;
    const filepath = req.file.path;
    
    console.log(`🔍 Testing uploaded old system backup: ${filename}`);
    console.log(`📁 File size: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Analyze file header
    const fileBuffer = fs.readFileSync(filepath);
    const header = fileBuffer.slice(0, 32);
    console.log('File header (hex):', header.toString('hex'));
    console.log('File header (ascii):', header.toString('ascii').replace(/[^\x20-\x7E]/g, '.'));
    
    // Look for MySQL signatures
    const fileString = fileBuffer.toString('binary');
    const mysqlPositions = [];
    let pos = 0;
    while ((pos = fileString.indexOf('MySQL', pos)) !== -1) {
      mysqlPositions.push(pos);
      pos += 5;
    }
    
    console.log(`Found ${mysqlPositions.length} "MySQL" signatures`);
    
    // Try decryption methods
    const password = '090666847';
    const salt = Buffer.from('MySqlBackup.NET', 'utf8');
    const key = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256');
    const iv = Buffer.alloc(16, 0);
    
    const results = {
      filename: filename,
      fileSize: req.file.size,
      mysqlSignatures: mysqlPositions.length,
      header: header.toString('hex'),
      decryptionAttempts: []
    };
    
    // Method 1: MySqlBackup.NET 2.0.12 (PBKDF2 with specific parameters)
    try {
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(fileBuffer, 'binary', 'utf8');
      decrypted += decipher.final('utf8');
      
      if (decrypted.includes('CREATE TABLE') || decrypted.includes('INSERT INTO') || decrypted.includes('-- MySQL dump')) {
        results.decryptionAttempts.push({
          method: 'MySqlBackup.NET 2.0.12 (PBKDF2)',
          success: true,
          preview: decrypted.substring(0, 500)
        });
        
        // Save decrypted file
        const outputFile = filepath.replace('.h149', '_decrypted.sql');
        fs.writeFileSync(outputFile, decrypted);
        results.decryptedFile = outputFile;
        
        return res.json({ 
          success: true, 
          message: 'Successfully decrypted old system backup using MySqlBackup.NET 2.0.12 format',
          results: results
        });
      } else {
        results.decryptionAttempts.push({
          method: 'MySqlBackup.NET 2.0.12 (PBKDF2)',
          success: false,
          error: 'No SQL content found in decrypted data'
        });
      }
    } catch (error) {
      results.decryptionAttempts.push({
        method: 'MySqlBackup.NET 2.0.12 (PBKDF2)',
        success: false,
        error: error.message
      });
    }
    
    // Method 2: Alternative methods
    const methods = [
      { name: 'AES-256-CBC with password hash', key: crypto.createHash('sha256').update(password).digest() },
      { name: 'AES-256-CBC with MD5 key', key: crypto.createHash('md5').update(password).digest() },
      { name: 'AES-256-CBC with password as key', key: Buffer.from(password.padEnd(32, '\0'), 'utf8') }
    ];
    
    for (const method of methods) {
      try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', method.key, iv);
        let decrypted = decipher.update(fileBuffer, 'binary', 'utf8');
        decrypted += decipher.final('utf8');
        
        if (decrypted.includes('CREATE TABLE') || decrypted.includes('INSERT INTO')) {
          results.decryptionAttempts.push({
            method: method.name,
            success: true,
            preview: decrypted.substring(0, 500)
          });
          
          // Save decrypted file
          const outputFile = filepath.replace('.h149', `_decrypted_${method.name.replace(/\s+/g, '_')}.sql`);
          fs.writeFileSync(outputFile, decrypted);
          results.decryptedFile = outputFile;
          
          return res.json({ 
            success: true, 
            message: `Successfully decrypted with ${method.name}`,
            results: results
          });
        } else {
          results.decryptionAttempts.push({
            method: method.name,
            success: false,
            error: 'No SQL content found'
          });
        }
      } catch (error) {
        results.decryptionAttempts.push({
          method: method.name,
          success: false,
          error: error.message
        });
      }
    }
    
    res.json({ 
      success: false, 
      message: 'All decryption methods failed',
      results: results,
      recommendation: 'Use the old VB.NET system to decrypt this file'
    });
    
  } catch (error) {
    console.error('Error testing uploaded old backup:', error);
    res.status(500).json({ error: 'Failed to test uploaded old backup file' });
  }
});

module.exports = router;
