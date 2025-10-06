const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mysql = require('mysql2/promise');

// Configure multer for SQL file uploads
const upload = multer({
  dest: path.join(__dirname, '../../temp'),
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.sql') || file.originalname.endsWith('.h149')) {
      cb(null, true);
    } else {
      cb(new Error('Only .sql and .h149 files are allowed'), false);
    }
  }
});

// Import history storage (in production, use a database table)
let importHistory = [];

// Database management functions
async function createDatabaseConnection(databaseName = null) {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4'
  };
  
  if (databaseName) {
    config.database = databaseName;
  }
  
  return await mysql.createConnection(config);
}

async function createDatabase(databaseName) {
  const connection = await createDatabaseConnection();
  
  try {
    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${databaseName}' created successfully`);
    
    // Get list of existing databases
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbNames = databases.map(db => db.Database);
    console.log('📋 Available databases:', dbNames);
    
    return true;
  } catch (error) {
    console.error('❌ Error creating database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function executeSQLInDatabase(databaseName, sqlContent, options = {}) {
  const connection = await createDatabaseConnection(databaseName);
  
  try {
    // Parse SQL statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        if (stmt.length === 0 || stmt.startsWith('--')) return false;
        // For validate mode, skip destructive operations
        if (options.importMode === 'validate' && (stmt.toUpperCase().includes('DELETE') || stmt.toUpperCase().includes('DROP'))) return false;
        return true;
      });

    console.log(`📊 Found ${statements.length} SQL statements to execute in database '${databaseName}'`);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    const processedRecords = [];

    // Execute statements
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        if (options.importMode === 'validate') {
          // For validate mode, just check syntax
          await connection.execute(`EXPLAIN ${statement}`);
          successCount++;
        } else {
          // Check if statement should use regular query instead of prepared statement
          const useRegularQuery = statement.toUpperCase().includes('SET ') || 
                                 statement.toUpperCase().includes('DELIMITER') ||
                                 statement.toUpperCase().includes('/*!') ||
                                 statement.toUpperCase().includes('--') ||
                                 statement.includes('@OLD_') ||
                                 statement.includes('@saved_');
          
          // Skip problematic SET statements that reference undefined variables
          const skipStatement = statement.toUpperCase().includes('SET ') && 
                               (statement.includes('@OLD_UNIQUE_CHECKS') || 
                                statement.includes('@OLD_FOREIGN_KEY_CHECKS') ||
                                statement.includes('@OLD_SQL_MODE') ||
                                statement.includes('@saved_'));
          
          if (skipStatement) {
            // Skip problematic statements silently
            successCount++;
          } else if (useRegularQuery) {
            // Use regular query for problematic statements
            await connection.query(statement);
            successCount++;
          } else {
            // Use prepared statement for regular statements
            await connection.execute(statement);
            successCount++;
          }
          
          // Track processed records
          if (statement.toUpperCase().includes('INSERT')) {
            processedRecords.push({
              type: 'INSERT',
              statement: statement.substring(0, 100) + '...',
              timestamp: new Date().toISOString()
            });
          }
        }
        
        if (i % 10 === 0) {
          console.log(`Executed ${i + 1}/${statements.length} statements...`);
        }
      } catch (error) {
        errorCount++;
        errors.push({
          statement: statement.substring(0, 100) + '...',
          error: error.message,
          line: i + 1
        });
        console.warn(`Error executing statement ${i + 1}:`, error.message);
      }
    }

    return {
      successCount,
      errorCount,
      errors,
      processedRecords,
      totalStatements: statements.length
    };

  } finally {
    await connection.end();
  }
}

// Get list of available databases
router.get('/databases', authenticateToken, requireRole(['data_manager', 'admin', 'super_admin']), async (req, res) => {
  try {
    const connection = await createDatabaseConnection();
    
    try {
      const [databases] = await connection.execute('SHOW DATABASES');
      const dbList = databases
        .map(db => db.Database)
        .filter(db => !['information_schema', 'performance_schema', 'mysql', 'sys', 'preart'].includes(db))
        .filter(db => db.startsWith('preart_')) // Only show imported PreART databases
        .map(dbName => ({
          name: dbName,
          type: 'imported',
          created: new Date().toISOString() // In production, get actual creation date
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      res.json({
        success: true,
        databases: dbList
      });
    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Get databases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get databases',
      error: error.message
    });
  }
});

// Import SQL file
router.post('/import', authenticateToken, requireRole(['data_manager', 'admin', 'super_admin']), upload.single('sqlFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'SQL file is required'
      });
    }

    const { targetSiteCode, importMode = 'replace', importOptions = '{}', createNewDatabase = 'true' } = req.body;
    const uploadedFile = req.file;
    const options = JSON.parse(importOptions);
    
    console.log(`🚀 Starting import from file: ${uploadedFile.originalname}`);
    console.log(`Target site: ${targetSiteCode || 'New database'}`);
    console.log(`Import mode: ${importMode}`);
    console.log(`Create new database: ${createNewDatabase} (type: ${typeof createNewDatabase})`);
    console.log(`Import options:`, options);

    // Generate database name (MySQL doesn't allow hyphens)
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_').split('T')[0];
    const siteCode = targetSiteCode || 'import';
    const databaseName = `preart_${siteCode}_${timestamp}`;
    
    console.log(`📊 Target database: ${databaseName}`);

    // Create new database if requested
    if (createNewDatabase === 'true' || createNewDatabase === true) {
      await createDatabase(databaseName);
    }

    // Read SQL file
    const sqlContent = fs.readFileSync(uploadedFile.path, 'utf8');
    
    // Execute SQL in the target database
    const result = await executeSQLInDatabase(databaseName, sqlContent, {
      importMode,
      ...options
    });

    // Record import history
    const importRecord = {
      id: Date.now(),
      filename: uploadedFile.originalname,
      siteCode: targetSiteCode,
      databaseName: databaseName,
      mode: importMode,
      status: result.errorCount === 0 ? 'success' : (result.successCount > 0 ? 'partial' : 'error'),
      totalStatements: result.totalStatements,
      successfulStatements: result.successCount,
      errorStatements: result.errorCount,
      processedRecords: result.processedRecords.length,
      timestamp: new Date().toISOString(),
      options: options,
      importedBy: req.user.username
    };
    
    importHistory.unshift(importRecord);
    
    // Keep only last 100 import records
    if (importHistory.length > 100) {
      importHistory = importHistory.slice(0, 100);
    }

    // Clean up uploaded file
    fs.unlinkSync(uploadedFile.path);

    res.json({
      success: true,
      message: `Import completed! ${result.successCount} statements executed successfully, ${result.errorCount} errors.`,
      statistics: {
        totalStatements: result.totalStatements,
        successful: result.successCount,
        errors: result.errorCount,
        processedRecords: result.processedRecords.length
      },
      errors: result.errors.slice(0, 10), // Show first 10 errors
      filename: uploadedFile.originalname,
      targetSiteCode: targetSiteCode,
      databaseName: databaseName,
      importMode: importMode,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import SQL data',
      error: error.message
    });
  } finally {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

// Get import history
router.get('/import-history', authenticateToken, requireRole(['data_manager', 'admin', 'super_admin']), async (req, res) => {
  try {
    res.json({
      success: true,
      history: importHistory
    });
  } catch (error) {
    console.error('Get import history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get import history',
      error: error.message
    });
  }
});

// Get database statistics
router.get('/database/:databaseName/stats', authenticateToken, requireRole(['data_manager', 'admin', 'super_admin']), async (req, res) => {
  try {
    const { databaseName } = req.params;
    const connection = await createDatabaseConnection(databaseName);
    
    try {
      // Check if database exists
      const [databases] = await connection.execute('SHOW DATABASES LIKE ?', [databaseName]);
      if (databases.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Database not found'
        });
      }

      // Get all tables
      const [tables] = await connection.execute('SHOW TABLES');
      const tableNames = tables.map(table => Object.values(table)[0]);
      
      const stats = {
        databaseName: databaseName,
        totalTables: tableNames.length,
        tables: []
      };

      // Get statistics for each table
      for (const tableName of tableNames) {
        try {
          const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
          const [tableInfo] = await connection.execute(`SHOW TABLE STATUS LIKE '${tableName}'`);
          
          stats.tables.push({
            name: tableName,
            records: countResult[0].count,
            size: tableInfo[0]?.Data_length || 0,
            engine: tableInfo[0]?.Engine || 'Unknown'
          });
        } catch (error) {
          console.log(`Error getting stats for table ${tableName}:`, error.message);
        }
      }

      res.json({
        success: true,
        stats: stats
      });

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Database stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get database statistics',
      error: error.message
    });
  }
});

// Delete database
router.delete('/database/:databaseName', authenticateToken, requireRole(['data_manager', 'admin', 'super_admin']), async (req, res) => {
  try {
    const { databaseName } = req.params;
    
    // Prevent deletion of main database
    if (databaseName === 'preart' || databaseName === 'preart_sites_registry') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete main database'
      });
    }

    const connection = await createDatabaseConnection();
    
    try {
      await connection.execute(`DROP DATABASE IF EXISTS \`${databaseName}\``);
      console.log(`✅ Database '${databaseName}' deleted successfully`);
      
      res.json({
        success: true,
        message: `Database '${databaseName}' deleted successfully`
      });
    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Delete database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete database',
      error: error.message
    });
  }
});

module.exports = router;
