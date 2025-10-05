const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
// const { handleConflictResolution } = require('./enhanced-conflict-resolution');
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

// Data processing and validation functions
async function processRowData(row, targetColumnMap, siteCode, tableName) {
  const processedRow = {};
  
  // Add site code
  processedRow.site_code = siteCode;
  
  // Process each column in the source row
  for (const [columnName, value] of Object.entries(row)) {
    if (targetColumnMap[columnName]) {
      const columnInfo = targetColumnMap[columnName];
      let processedValue = value;
      
      // Handle null values
      if (processedValue === null || processedValue === undefined) {
        if (columnInfo.null) {
          processedValue = null;
        } else if (columnInfo.default !== null) {
          processedValue = columnInfo.default;
        } else {
          // Provide default values based on column type
          processedValue = getDefaultValueForType(columnInfo.type);
        }
      } else {
        // Validate and sanitize data based on column type
        processedValue = await validateAndSanitizeValue(processedValue, columnInfo, columnName);
      }
      
      processedRow[columnName] = processedValue;
    }
  }
  
  // Add missing required columns with default values
  for (const [columnName, columnInfo] of Object.entries(targetColumnMap)) {
    if (!(columnName in processedRow)) {
      if (columnInfo.null) {
        processedRow[columnName] = null;
      } else if (columnInfo.default !== null) {
        processedRow[columnName] = columnInfo.default;
      } else {
        processedRow[columnName] = getDefaultValueForType(columnInfo.type);
      }
    }
  }
  
  return processedRow;
}

function getDefaultValueForType(columnType) {
  const type = columnType.toLowerCase();
  
  if (type.includes('varchar') || type.includes('char') || type.includes('text')) {
    return '';
  } else if (type.includes('int') || type.includes('decimal') || type.includes('float')) {
    return 0;
  } else if (type.includes('date') || type.includes('datetime') || type.includes('timestamp')) {
    return '1900-01-01 00:00:00';
  } else if (type.includes('bit') || type.includes('boolean')) {
    return 0;
  } else {
    return '';
  }
}

async function validateAndSanitizeValue(value, columnInfo, columnName) {
  if (value === null || value === undefined) {
    return getDefaultValueForType(columnInfo.type);
  }
  
  const type = columnInfo.type.toLowerCase();
  
  // Handle string length constraints
  if (type.includes('varchar') || type.includes('char')) {
    const maxLength = parseInt(type.match(/\((\d+)\)/)?.[1] || '255');
    if (typeof value === 'string' && value.length > maxLength) {
      console.log(`Truncating ${columnName} value: ${value.length} chars -> ${maxLength} chars`);
      return value.substring(0, maxLength);
    }
  }
  
  // Handle specific column issues
  if (columnName === 'DaExpiry' && (value === null || value === undefined || value === '')) {
    return '1900-01-01';
  }
  
  // Handle Typecode length issues
  if (columnName === 'Typecode' && typeof value === 'string' && value.length > 10) {
    return value.substring(0, 10);
  }
  
  // Handle Commune length issues
  if (columnName === 'Commune' && typeof value === 'string' && value.length > 100) {
    return value.substring(0, 100);
  }
  
  // Convert to string and escape single quotes
  if (typeof value === 'string') {
    return value.replace(/'/g, "''");
  }
  
  return value;
}

async function insertBatchData(connection, tableName, rows, conflictResolution = 'ignore') {
  if (rows.length === 0) return;
  
  const columns = Object.keys(rows[0]);
  const placeholders = columns.map(() => '?').join(', ');
  
  // Check if table has a primary key or unique keys
  const [keyInfo] = await connection.execute(`SHOW KEYS FROM \`${tableName}\` WHERE Key_name = 'PRIMARY'`);
  const [uniqueKeys] = await connection.execute(`SHOW KEYS FROM \`${tableName}\` WHERE Non_unique = 0`);
  
  // Check for clinic ID columns
  const clinicIdColumns = columns.filter(col => 
    col.toLowerCase().includes('clinic') || 
    col.toLowerCase().includes('clinicid') ||
    col.toLowerCase().includes('clinic_id')
  );
  
  // Calculate total placeholders to avoid MySQL limit
  const totalPlaceholders = rows.length * columns.length;
  const maxPlaceholders = 65535; // MySQL's limit
  
  if (totalPlaceholders > maxPlaceholders) {
    // If too many placeholders, split into smaller batches
    const maxRowsPerBatch = Math.floor(maxPlaceholders / columns.length);
    // Dynamic batch sizing based on table size and column count
    const smallerBatchSize = Math.min(maxRowsPerBatch, Math.max(50, Math.min(500, Math.floor(100000 / columns.length))));
    
    for (let i = 0; i < rows.length; i += smallerBatchSize) {
      const smallerBatch = rows.slice(i, i + smallerBatchSize);
      await insertBatchData(connection, tableName, smallerBatch, conflictResolution);
    }
    return;
  }
  
  // Check if this is the target preart database (has site_code column)
  const hasSiteCodeColumn = columns.includes('site_code');
  
  if (hasSiteCodeColumn) {
    // For preart database, handle based on conflict resolution mode
    const values = rows.flatMap(row => columns.map(col => row[col]));
    
    if (conflictResolution === 'update' && keyInfo.length > 0) {
      // Use ON DUPLICATE KEY UPDATE for update mode
      const keyColumn = keyInfo[0].Column_name;
      const updateClause = columns
        .filter(col => col !== keyColumn)
        .map(col => `\`${col}\` = VALUES(\`${col}\`)`)
        .join(', ');
      
      if (updateClause) {
        await connection.execute(
          `INSERT INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')} ON DUPLICATE KEY UPDATE ${updateClause}`,
          values
        );
      } else {
        await connection.execute(
          `INSERT IGNORE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')}`,
          values
        );
      }
    } else {
      // Use INSERT IGNORE for ignore mode (default)
      await connection.execute(
        `INSERT IGNORE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')}`,
        values
      );
    }
  } else {
    // For all other tables (source databases), use conflict resolution based on mode
    const values = rows.flatMap(row => columns.map(col => row[col]));
    
    if (conflictResolution === 'update' && (keyInfo.length > 0 || uniqueKeys.length > 0)) {
      // Use ON DUPLICATE KEY UPDATE for update mode when primary/unique keys exist
      const keyColumn = keyInfo.length > 0 ? keyInfo[0].Column_name : uniqueKeys[0].Column_name;
      const updateClause = columns
        .filter(col => col !== keyColumn)
        .map(col => `\`${col}\` = VALUES(\`${col}\`)`)
        .join(', ');
      
      if (updateClause) {
        await connection.execute(
          `INSERT INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')} ON DUPLICATE KEY UPDATE ${updateClause}`,
          values
        );
      } else {
        await connection.execute(
          `INSERT IGNORE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')}`,
          values
        );
      }
    } else {
      // Use INSERT IGNORE for ignore mode or tables without primary keys
      await connection.execute(
        `INSERT IGNORE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')}`,
        values
      );
    }
  }
}

async function insertSingleRow(connection, tableName, row, conflictResolution = 'ignore') {
  const columns = Object.keys(row);
  const values = Object.values(row);
  const placeholders = values.map(() => '?').join(', ');
  
  // Check if table has a primary key or unique keys
  const [keyInfo] = await connection.execute(`SHOW KEYS FROM \`${tableName}\` WHERE Key_name = 'PRIMARY'`);
  const [uniqueKeys] = await connection.execute(`SHOW KEYS FROM \`${tableName}\` WHERE Non_unique = 0`);
  
  // Check if this is the target preart database (has site_code column)
  const hasSiteCodeColumn = columns.includes('site_code');
  
  if (hasSiteCodeColumn) {
    // For preart database, handle based on conflict resolution mode
    if (conflictResolution === 'update' && keyInfo.length > 0) {
      // Use ON DUPLICATE KEY UPDATE for update mode
      const keyColumn = keyInfo[0].Column_name;
      const updateClause = columns
        .filter(col => col !== keyColumn)
        .map(col => `\`${col}\` = VALUES(\`${col}\`)`)
        .join(', ');
      
      if (updateClause) {
        await connection.execute(
          `INSERT INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updateClause}`,
          values
        );
      } else {
        await connection.execute(
          `INSERT IGNORE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES (${placeholders})`,
          values
        );
      }
    } else {
      // Use INSERT IGNORE for ignore mode (default)
      await connection.execute(
        `INSERT IGNORE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES (${placeholders})`,
        values
      );
    }
  } else {
    // For all other tables, use conflict resolution based on mode
    if (conflictResolution === 'update' && (keyInfo.length > 0 || uniqueKeys.length > 0)) {
      // Use ON DUPLICATE KEY UPDATE for update mode when primary/unique keys exist
      const keyColumn = keyInfo.length > 0 ? keyInfo[0].Column_name : uniqueKeys[0].Column_name;
      const updateClause = columns
        .filter(col => col !== keyColumn)
        .map(col => `\`${col}\` = VALUES(\`${col}\`)`)
        .join(', ');
      
      if (updateClause) {
        await connection.execute(
          `INSERT INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updateClause}`,
          values
        );
      } else {
        await connection.execute(
          `INSERT IGNORE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES (${placeholders})`,
          values
        );
      }
    } else {
      // Use INSERT IGNORE for ignore mode or tables without primary keys
      await connection.execute(
        `INSERT IGNORE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES (${placeholders})`,
        values
      );
    }
  }
}

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
router.get('/databases', authenticateToken, async (req, res) => {
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

// Enhanced import with database creation
router.post('/import', authenticateToken, upload.single('sqlFile'), async (req, res) => {
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
      options: options
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

// Export from specific database
router.post('/export', authenticateToken, async (req, res) => {
  try {
    const { 
      databaseName,
      siteCode, 
      includePatients = true, 
      includeVisits = true, 
      includeLookups = false,
      includeMetadata = true,
      dateRange = {},
      format = 'sql',
      compression = false
    } = req.body;
    
    if (!databaseName) {
      return res.status(400).json({
        success: false,
        message: 'Database name is required for export'
      });
    }

    // Connect to the specific database
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

      let exportData = '';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // Export header with enhanced metadata
      exportData += `-- Database Export: ${databaseName}\n`;
      exportData += `-- Exported: ${new Date().toISOString()}\n`;
      exportData += `-- Format: ${format}\n`;
      exportData += `-- Compression: ${compression}\n`;
      exportData += `-- Include Patients: ${includePatients}\n`;
      exportData += `-- Include Visits: ${includeVisits}\n`;
      exportData += `-- Include Lookups: ${includeLookups}\n`;
      exportData += `-- Include Metadata: ${includeMetadata}\n`;
      if (dateRange.start) exportData += `-- Date Range: ${dateRange.start} to ${dateRange.end || 'now'}\n`;
      exportData += `\n`;

      // Get all tables in the database
      const [tables] = await connection.execute('SHOW TABLES');
      const tableNames = tables.map(table => Object.values(table)[0]);

      // Export each table
      for (const tableName of tableNames) {
        try {
          // Build query with site code filter if specified and database is preart
          let query = `SELECT * FROM \`${tableName}\``;
          if (siteCode && databaseName === 'preart') {
            // Check if table has site_code column
            try {
              const [columns] = await connection.execute(`DESCRIBE \`${tableName}\``);
              const hasSiteCodeColumn = columns.some(col => col.Field === 'site_code');
              if (hasSiteCodeColumn) {
                query += ` WHERE \`site_code\` = '${siteCode}'`;
                console.log(`Filtering ${tableName} by site code: ${siteCode}`);
              }
            } catch (columnError) {
              console.log(`Could not check columns for ${tableName}:`, columnError.message);
            }
          }
          
          const [rows] = await connection.execute(query);
          
          if (rows.length > 0) {
            exportData += `-- Data for table ${tableName}\n`;
            exportData += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
            
            // Get table structure
            const [createTable] = await connection.execute(`SHOW CREATE TABLE \`${tableName}\``);
            exportData += `${createTable[0]['Create Table']};\n\n`;
            
            // Get column names
            const [columns] = await connection.execute(`DESCRIBE \`${tableName}\``);
            const columnNames = columns.map(col => `\`${col.Field}\``).join(', ');
            
            // Export data
            for (const row of rows) {
              const values = Object.values(row).map(value => {
                if (value === null) return 'NULL';
                if (typeof value === 'string') {
                  return `'${value.replace(/'/g, "''")}'`;
                }
                return value;
              });
              exportData += `INSERT INTO \`${tableName}\` (${columnNames}) VALUES (${values.join(', ')});\n`;
            }
            exportData += '\n';
          }
        } catch (error) {
          console.log(`Skipping table ${tableName}: ${error.message}`);
        }
      }

      // Create filename
      const filename = `database_${databaseName}_export_${timestamp}.${format}`;
      const filepath = path.join(__dirname, '../../exports', filename);
      
      // Ensure exports directory exists
      const exportsDir = path.dirname(filepath);
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
      }

      // Write file
      fs.writeFileSync(filepath, exportData);

      res.json({
        success: true,
        message: 'Database exported successfully',
        filename: filename,
        filepath: filepath,
        size: fs.statSync(filepath).size,
        databaseName: databaseName,
        timestamp: new Date().toISOString(),
        options: {
          includePatients,
          includeVisits,
          includeLookups,
          includeMetadata,
          dateRange,
          format,
          compression
        }
      });

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export database',
      error: error.message
    });
  }
});

// Get database statistics
router.get('/database/:databaseName/stats', authenticateToken, async (req, res) => {
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
router.delete('/database/:databaseName', authenticateToken, async (req, res) => {
  try {
    const { databaseName } = req.params;
    
    // Prevent deletion of main database
    if (databaseName === 'preart') {
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

// Data aggregation across databases
router.post('/aggregate', authenticateToken, async (req, res) => {
  try {
    const { databaseNames, mode, options = {}, targetDatabase = 'preart', conflictResolution = 'update' } = req.body;
    
    if (!databaseNames || databaseNames.length < 1) {
      return res.status(400).json({
        success: false,
        message: 'At least 1 database is required for aggregation'
      });
    }

    console.log(`Starting data aggregation for databases: ${databaseNames.join(', ')}`);
    console.log(`Aggregation mode: ${mode}`);

    // Get io instance for real-time updates
    const io = req.app.get('io');
    
    // Emit initial progress
    if (io) {
      io.to('aggregation').emit('aggregation-progress', {
        type: 'start',
        message: 'Starting data aggregation...',
        progress: 0,
        currentSite: null,
        currentTable: null,
        totalRecords: 0,
        processedRecords: 0
      });
    }

    let totalRecords = 0;
    const aggregationResults = [];

    switch (mode) {
      case 'consolidate':
        // Consolidate all data from selected databases to main preart database
        const targetConnection = await createDatabaseConnection(targetDatabase);
        
        // Clear existing data if replace mode is selected
        if (conflictResolution === 'replace') {
          console.log('Clearing existing data in target database...');
          const [tables] = await targetConnection.execute('SHOW TABLES');
          for (const table of tables) {
            const tableName = Object.values(table)[0];
            try {
              await targetConnection.execute(`TRUNCATE TABLE \`${tableName}\``);
              console.log(`Cleared table: ${tableName}`);
            } catch (error) {
              console.log(`Error clearing table ${tableName}:`, error.message);
            }
          }
        } else if (conflictResolution === 'update') {
          console.log('Using update mode - existing records will be updated');
        } else {
          console.log('Using insert ignore mode - duplicate records will be skipped');
        }
        
        for (const dbName of databaseNames) {
          const sourceConnection = await createDatabaseConnection(dbName);
          
          try {
            // Check if source database exists
            const [databases] = await sourceConnection.execute(`SHOW DATABASES LIKE '${dbName}'`);
            if (databases.length === 0) {
              console.log(`Database ${dbName} not found, skipping...`);
              continue;
            }

            // Get ALL tables from source database
            const [tables] = await sourceConnection.execute('SHOW TABLES');
            
            // Extract site code from database name (e.g., preart_2101_2025_09_09 -> 2101)
            const siteCode = dbName.match(/preart_(\d+)_/)?.[1] || 'unknown';
            let dbRecords = 0;
            let processedTables = 0;
            let skippedTables = 0;

            console.log(`Processing ALL ${tables.length} tables for site ${siteCode}...`);
            
            // Emit site start progress
            if (io) {
              io.to('aggregation').emit('aggregation-progress', {
                type: 'site-start',
                message: `Processing site ${siteCode}...`,
                progress: (databaseNames.indexOf(dbName) / databaseNames.length) * 100,
                currentSite: siteCode,
                currentTable: null,
                totalRecords: 0,
                processedRecords: 0
              });
            }
            
            // Process ALL tables in the database
            for (const table of tables) {
              const tableName = Object.values(table)[0];
              
              try {
              
                  // Count records in source table
                  const [countResult] = await sourceConnection.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
                  const recordCount = countResult[0].count;
                  dbRecords += recordCount;
                  
                  if (recordCount > 0) {
                    // Get all data from source table
                    const [rows] = await sourceConnection.execute(`SELECT * FROM \`${tableName}\``);
                    
                    if (rows.length > 0) {
                      // Create table in target database if it doesn't exist
                      try {
                        // First, check if table exists in target database
                        const [targetTables] = await targetConnection.execute(`SHOW TABLES LIKE '${tableName}'`);
                        
                        if (targetTables.length === 0) {
                          // Table doesn't exist, create it using the source table structure
                          await targetConnection.execute(`CREATE TABLE \`${tableName}\` LIKE \`${dbName}\`.\`${tableName}\``);
                        }
                        
                        // Add site_code column if it doesn't exist
                        try {
                          const [columns] = await targetConnection.execute(`DESCRIBE \`${tableName}\``);
                          const hasSiteCodeColumn = columns.some(col => col.Field === 'site_code');
                          
                          if (!hasSiteCodeColumn) {
                            await targetConnection.execute(`ALTER TABLE \`${tableName}\` ADD COLUMN \`site_code\` VARCHAR(10) DEFAULT NULL`);
                          }
                        } catch (alterError) {
                          // Column might already exist, that's okay
                          if (!alterError.message.includes('Duplicate column name')) {
                            console.log(`Could not add site_code column to ${tableName}:`, alterError.message);
                          }
                        }
                      } catch (error) {
                        console.log(`Error creating table ${tableName}:`, error.message);
                        // Continue with data insertion even if table creation failed
                      }
                      
                      // Get target table structure for validation
                      let targetColumnMap = {};
                      try {
                        const [targetColumns] = await targetConnection.execute(`DESCRIBE \`${tableName}\``);
                        targetColumns.forEach(col => {
                          targetColumnMap[col.Field] = {
                            type: col.Type,
                            null: col.Null === 'YES',
                            default: col.Default,
                            key: col.Key
                          };
                        });
                      } catch (descError) {
                        // Continue without column validation
                      }
                      
                      // Process data in batches with validation
                      // Use adaptive batch size based on column count to avoid "too many placeholders" error
                      const columnCount = Object.keys(targetColumnMap).length;
                      const maxPlaceholders = 65535; // MySQL's limit
                      // Dynamic batch sizing based on table size and column count
                      const baseBatchSize = Math.floor(maxPlaceholders / columnCount);
                      const batchSize = Math.min(Math.max(50, baseBatchSize), Math.min(500, Math.floor(100000 / columnCount)));
                      let successCount = 0;
                      let errorCount = 0;
                      let skippedCount = 0;
                      
                      for (let i = 0; i < rows.length; i += batchSize) {
                        const batch = rows.slice(i, i + batchSize);
                        const validRows = [];
                        
                        for (const row of batch) {
                          try {
                            const processedRow = await processRowData(row, targetColumnMap, siteCode, tableName);
                            if (processedRow) {
                              validRows.push(processedRow);
                            } else {
                              skippedCount++;
                            }
                          } catch (error) {
                            errorCount++;
                          }
                        }
                        
                        if (validRows.length > 0) {
                          try {
                            // Use enhanced conflict resolution
                            // await handleConflictResolution(targetConnection, tableName, validRows, conflictResolution);
                            successCount += validRows.length;
                          } catch (error) {
                            console.log(`Error with enhanced conflict resolution for ${tableName}:`, error.message);
                            // Fallback to original method
                            try {
                              await insertBatchData(targetConnection, tableName, validRows, conflictResolution);
                              successCount += validRows.length;
                            } catch (fallbackError) {
                              // Try inserting one by one for better error reporting
                              for (const row of validRows) {
                                try {
                                  await insertSingleRow(targetConnection, tableName, row, conflictResolution);
                                  successCount++;
                                } catch (singleError) {
                                  errorCount++;
                                }
                              }
                            }
                          }
                        }
                      }
                      
                      if (successCount > 0) {
                        processedTables++;
                        console.log(`✅ ${successCount} records from ${tableName}`);
                        
                        // Emit table completion progress
                        if (io) {
                          const tableProgress = (processedTables / tables.length) * 100;
                          const siteProgress = (databaseNames.indexOf(dbName) / databaseNames.length) * 100;
                          const totalProgress = siteProgress + (tableProgress / databaseNames.length);
                          
                          io.to('aggregation').emit('aggregation-progress', {
                            type: 'table-complete',
                            message: `✅ ${successCount} records from ${tableName}`,
                            progress: totalProgress,
                            currentSite: siteCode,
                            currentTable: tableName,
                            totalRecords: totalRecords + successCount,
                            processedRecords: dbRecords + successCount
                          });
                        }
                      }
                      if (errorCount > 0) {
                        skippedTables++;
                      }
                    } else {
                      skippedTables++;
                    }
                  } else {
                    skippedTables++;
                  }
                } catch (error) {
                  skippedTables++;
                }
            }
            
            totalRecords += dbRecords;
            
            // Emit site completion progress
            if (io) {
              const siteProgress = ((databaseNames.indexOf(dbName) + 1) / databaseNames.length) * 100;
              
              io.to('aggregation').emit('aggregation-progress', {
                type: 'site-complete',
                message: `✅ Site ${siteCode} completed - ${dbRecords} records processed`,
                progress: siteProgress,
                currentSite: siteCode,
                currentTable: null,
                totalRecords: totalRecords,
                processedRecords: totalRecords
              });
            }
            
            aggregationResults.push({
              databaseName: dbName,
              siteCode: siteCode,
              records: dbRecords,
              processedTables: processedTables,
              skippedTables: skippedTables,
              status: 'consolidated'
            });
          } finally {
            await sourceConnection.end();
          }
        }
        
        // Close target connection
        await targetConnection.end();
        
        // Calculate total imported records
        const totalImported = aggregationResults.reduce((sum, result) => sum + result.records, 0);
        
        console.log(`Total Import: ${totalRecords} records`);
        console.log(`Imported: ${totalImported} records`);
        
        // Show breakdown by site
        console.log(`\nSite Breakdown:`);
        aggregationResults.forEach(result => {
          console.log(`Site ${result.siteCode}: ${result.records} records (${result.processedTables} tables processed)`);
        });
        break;
        
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid aggregation mode'
        });
    }

    // Emit final completion progress
    if (io) {
      io.to('aggregation').emit('aggregation-progress', {
        type: 'complete',
        message: '🎉 Aggregation completed successfully!',
        progress: 100,
        currentSite: null,
        currentTable: null,
        totalRecords: totalRecords,
        processedRecords: totalRecords
      });
    }

    res.json({
      success: true,
      message: `Data aggregation completed successfully. Data consolidated to ${targetDatabase} database using ${conflictResolution} mode.`,
      statistics: {
        totalRecords: totalRecords,
        databasesProcessed: databaseNames.length,
        mode: mode,
        targetDatabase: targetDatabase,
        conflictResolution: conflictResolution
      },
      results: aggregationResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Aggregation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to aggregate data',
      error: error.message
    });
  }
});

// Get import history
router.get('/import-history', authenticateToken, async (req, res) => {
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

// Preview aggregation data
router.post('/aggregate/preview', authenticateToken, async (req, res) => {
  try {
    const { databaseNames, mode, targetDatabase, conflictResolution } = req.body;
    
    if (!databaseNames || !Array.isArray(databaseNames) || databaseNames.length < 1) {
      return res.status(400).json({
        success: false,
        message: 'At least 1 database is required for preview'
      });
    }

    console.log(`Generating real preview for databases: ${databaseNames.join(', ')}`);

    // Real preview data analysis
    const previewData = {
      mode,
      targetDatabase,
      conflictResolution,
      databases: [],
      totalEstimatedRecords: 0,
      totalEstimatedTables: 0,
      estimatedSize: 0
    };

    // Analyze each database
    for (const dbName of databaseNames) {
      try {
        const sourceConnection = await createDatabaseConnection(dbName);
        
        // Check if database exists
        const [databases] = await sourceConnection.execute(`SHOW DATABASES LIKE '${dbName}'`);
        if (databases.length === 0) {
          console.log(`Database ${dbName} not found, skipping...`);
          await sourceConnection.end();
          continue;
        }

        // Get all tables
        const [tables] = await sourceConnection.execute('SHOW TABLES');
        const tableNames = tables.map(table => Object.values(table)[0]);
        
        // Calculate total records and size
        let dbRecords = 0;
        let dbSize = 0;
        const tableStats = [];
        
        for (const tableName of tableNames) {
          try {
            const [countResult] = await sourceConnection.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
            const recordCount = countResult[0].count;
            dbRecords += recordCount;
            
            // Get table size
            const [sizeResult] = await sourceConnection.execute(`
              SELECT 
                ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
              FROM information_schema.tables 
              WHERE table_schema = ? AND table_name = ?
            `, [dbName, tableName]);
            
            const tableSize = sizeResult[0]?.size_mb || 0;
            dbSize += tableSize;
            
            tableStats.push({
              name: tableName,
              records: recordCount,
              size: tableSize
            });
          } catch (error) {
            console.warn(`Could not analyze table ${tableName}:`, error.message);
          }
        }
        
        // Extract site code from database name
        const siteCode = dbName.match(/preart_(\d+)_/)?.[1] || 'unknown';
        
        previewData.databases.push({
          name: dbName,
          siteCode: siteCode,
          estimatedRecords: dbRecords,
          estimatedTables: tableNames.length,
          estimatedSize: Math.round(dbSize * 100) / 100,
          tableStats: tableStats.sort((a, b) => b.records - a.records)
        });
        
        previewData.totalEstimatedRecords += dbRecords;
        previewData.totalEstimatedTables += tableNames.length;
        previewData.estimatedSize += dbSize;
        
        await sourceConnection.end();
        
      } catch (error) {
        console.error(`Error analyzing database ${dbName}:`, error.message);
        previewData.databases.push({
          name: dbName,
          siteCode: 'unknown',
          estimatedRecords: 0,
          estimatedTables: 0,
          estimatedSize: 0,
          error: error.message
        });
      }
    }

    // Round final size
    previewData.estimatedSize = Math.round(previewData.estimatedSize * 100) / 100;

    console.log(`Preview completed: ${previewData.totalEstimatedRecords} records across ${previewData.totalEstimatedTables} tables`);

    res.json({
      success: true,
      preview: previewData
    });
  } catch (error) {
    console.error('Preview aggregation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate preview',
      error: error.message
    });
  }
});

// Get exact database statistics
router.get('/database-stats/:databaseName', authenticateToken, async (req, res) => {
  try {
    const { databaseName } = req.params;
    
    // Create a new connection to the specific database
    const connection = await createDatabaseConnection(databaseName);

    // Get table count
    const [tableCountResult] = await connection.execute(`
      SELECT COUNT(*) as tableCount 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_type = 'BASE TABLE'
    `, [databaseName]);

    // Get total record count across all tables
    const [tablesResult] = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_type = 'BASE TABLE'
    `, [databaseName]);

    let totalRecords = 0;
    const tableStats = [];

    for (const table of tablesResult) {
      const tableName = table.table_name || Object.values(table)[0];
      if (!tableName) {
        console.warn('Skipping table with undefined name:', table);
        continue;
      }
      
      try {
        const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
        const recordCount = countResult[0].count;
        totalRecords += recordCount;
        
        tableStats.push({
          tableName: tableName,
          recordCount: recordCount
        });
      } catch (error) {
        console.warn(`Could not count records in table ${tableName}:`, error.message);
        tableStats.push({
          tableName: tableName,
          recordCount: 0,
          error: 'Could not count records'
        });
      }
    }

    // Get database size
    const [sizeResult] = await connection.execute(`
      SELECT 
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [databaseName]);

    await connection.end();

    const stats = {
      databaseName,
      tableCount: tableCountResult[0].tableCount,
      totalRecords,
      sizeMB: sizeResult[0].size_mb || 0,
      tableStats: tableStats.sort((a, b) => b.recordCount - a.recordCount) // Sort by record count descending
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching database stats for', databaseName, ':', error);
    
    // Handle specific database connection errors
    if (error.code === 'ER_BAD_DB_ERROR') {
      return res.status(404).json({ 
        success: false,
        message: 'Database not found',
        error: `Database '${databaseName}' does not exist`
      });
    }
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied',
        error: 'Insufficient privileges to access database'
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch database statistics',
      error: error.message 
    });
  }
});

// Get available export files
router.get('/exports', authenticateToken, async (req, res) => {
  try {
    const exportsDir = path.join(__dirname, '../../exports');
    
    if (!fs.existsSync(exportsDir)) {
      return res.json({
        success: true,
        exports: []
      });
    }

    const files = fs.readdirSync(exportsDir)
      .filter(file => file.endsWith('.sql') || file.endsWith('.json') || file.endsWith('.csv'))
      .map(file => {
        const filepath = path.join(exportsDir, file);
        const stats = fs.statSync(filepath);
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.created - a.created);

    res.json({
      success: true,
      exports: files
    });

  } catch (error) {
    console.error('Get exports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get export files',
      error: error.message
    });
  }
});

// Download export file
router.get('/exports/:filename', authenticateToken, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../../exports', filename);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Export file not found'
      });
    }

    res.download(filepath, filename);

  } catch (error) {
    console.error('Download export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download export file',
      error: error.message
    });
  }
});

module.exports = router;
module.exports.createDatabase = createDatabase;
module.exports.executeSQLInDatabase = executeSQLInDatabase;