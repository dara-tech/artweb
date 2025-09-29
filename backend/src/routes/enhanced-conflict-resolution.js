const express = require('express');
const { sequelize } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Enhanced Conflict Resolution System for Data Aggregation
 * 
 * Three conflict resolution modes:
 * 1. 'ignore' - Ignore Conflicts (Keep existing data)
 * 2. 'overwrite' - Overwrite Conflicts (Use new data) 
 * 3. 'merge' - Merge Conflicts (Combine data) - Keep only one version, make one version work
 * 4. 'replace' - Replace mode (Clear existing data and insert new data)
 */

// Enhanced conflict resolution function
async function handleConflictResolution(connection, tableName, rows, conflictResolution = 'ignore') {
  if (rows.length === 0) return;
  
  const columns = Object.keys(rows[0]);
  const placeholders = columns.map(() => '?').join(', ');
  
  // Check if table has a primary key or unique keys
  const [keyInfo] = await connection.execute(`SHOW KEYS FROM \`${tableName}\` WHERE Key_name = 'PRIMARY'`);
  const [uniqueKeys] = await connection.execute(`SHOW KEYS FROM \`${tableName}\` WHERE Non_unique = 0`);
  
  const values = rows.flatMap(row => columns.map(col => row[col]));
  
  console.log(`🔄 Processing ${rows.length} rows for ${tableName} with conflict resolution: ${conflictResolution}`);
  
  // Enhanced conflict resolution handling
  switch (conflictResolution) {
    case 'ignore':
      // Ignore Conflicts (Keep existing data) - Default behavior
      console.log(`   - Using INSERT IGNORE (keep existing data)`);
      await connection.execute(
        `INSERT IGNORE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')}`,
        values
      );
      break;
      
    case 'overwrite':
      // Overwrite Conflicts (Use new data) - Replace existing data
      console.log(`   - Using OVERWRITE mode (replace existing data)`);
      if (keyInfo.length > 0 || uniqueKeys.length > 0) {
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
          // If no update clause, use REPLACE
          await connection.execute(
            `REPLACE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')}`,
            values
          );
        }
      } else {
        // No primary key, use REPLACE
        await connection.execute(
          `REPLACE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')}`,
          values
        );
      }
      break;
      
    case 'merge':
      // Merge Conflicts (Combine data) - Keep only one version, make one version work
      console.log(`   - Using MERGE mode (combine data, keep one version)`);
      if (keyInfo.length > 0 || uniqueKeys.length > 0) {
        const keyColumn = keyInfo.length > 0 ? keyInfo[0].Column_name : uniqueKeys[0].Column_name;
        
        // For merge mode, we'll use a more sophisticated approach
        // First, try to insert new records
        try {
          await connection.execute(
            `INSERT INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')}`,
            values
          );
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            // Handle duplicate entries by updating with newer data
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
              // Fallback to ignore for duplicates
              await connection.execute(
                `INSERT IGNORE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')}`,
                values
              );
            }
          } else {
            throw error;
          }
        }
      } else {
        // No primary key, use INSERT IGNORE
        await connection.execute(
          `INSERT IGNORE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')}`,
          values
        );
      }
      break;
      
    case 'replace':
      // Replace mode - Clear existing data and insert new data
      console.log(`   - Using REPLACE mode (clear existing data first)`);
      const hasSiteCodeColumn = columns.includes('_site_code');
      if (hasSiteCodeColumn) {
        // For target database, clear existing data first
        const siteCodes = [...new Set(rows.map(row => row._site_code).filter(Boolean))];
        if (siteCodes.length > 0) {
          console.log(`   - Clearing existing data for sites: ${siteCodes.join(', ')}`);
          await connection.execute(
            `DELETE FROM \`${tableName}\` WHERE _site_code IN (${siteCodes.map(() => '?').join(', ')})`,
            siteCodes
          );
        }
      }
      
      // Insert new data
      await connection.execute(
        `INSERT INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')}`,
        values
      );
      break;
      
    default:
      // Default to ignore mode
      console.log(`   - Using default IGNORE mode`);
      await connection.execute(
        `INSERT IGNORE INTO \`${tableName}\` (${columns.map(col => `\`${col}\``).join(', ')}) VALUES ${rows.map(() => `(${placeholders})`).join(', ')}`,
        values
      );
  }
}

// Test conflict resolution modes
router.post('/test-conflict-resolution', [authenticateToken], async (req, res) => {
  try {
    const { tableName, testData, conflictResolution = 'ignore' } = req.body;
    
    if (!tableName || !testData || !Array.isArray(testData)) {
      return res.status(400).json({
        success: false,
        message: 'Table name and test data array are required'
      });
    }

    console.log(`🧪 Testing conflict resolution for table: ${tableName}`);
    console.log(`   Mode: ${conflictResolution}`);
    console.log(`   Test data rows: ${testData.length}`);

    // Get connection
    const connection = await sequelize.connectionManager.getConnection();
    
    try {
      // Test the conflict resolution
      await handleConflictResolution(connection, tableName, testData, conflictResolution);
      
      // Get final count
      const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      const finalCount = countResult[0].count;
      
      res.json({
        success: true,
        message: `Conflict resolution test completed for ${tableName}`,
        results: {
          tableName,
          conflictResolution,
          testRows: testData.length,
          finalRowCount: finalCount,
          mode: conflictResolution
        }
      });
      
    } finally {
      await sequelize.connectionManager.releaseConnection(connection);
    }

  } catch (error) {
    console.error('Conflict resolution test error:', error);
    res.status(500).json({
      success: false,
      message: 'Conflict resolution test failed',
      error: error.message
    });
  }
});

// Get conflict resolution modes documentation
router.get('/conflict-resolution-modes', [authenticateToken], async (req, res) => {
  try {
    const modes = {
      'ignore': {
        name: 'Ignore Conflicts',
        description: 'Keep existing data, skip new data if conflicts occur',
        sqlMethod: 'INSERT IGNORE',
        useCase: 'When you want to preserve existing data and only add new records',
        example: 'Patient data from different sites - keep existing patients, add only new ones'
      },
      'overwrite': {
        name: 'Overwrite Conflicts', 
        description: 'Use new data, replace existing data if conflicts occur',
        sqlMethod: 'INSERT ... ON DUPLICATE KEY UPDATE or REPLACE',
        useCase: 'When you want to update existing records with new data',
        example: 'Updated patient information - replace old data with new data'
      },
      'merge': {
        name: 'Merge Conflicts',
        description: 'Combine data, keep only one version, make one version work',
        sqlMethod: 'INSERT ... ON DUPLICATE KEY UPDATE with smart merging',
        useCase: 'When you want to intelligently combine data from different sources',
        example: 'Patient visits from multiple sites - merge visit data intelligently'
      },
      'replace': {
        name: 'Replace Mode',
        description: 'Clear existing data and insert new data',
        sqlMethod: 'DELETE existing + INSERT new',
        useCase: 'When you want to completely replace data for specific sites',
        example: 'Complete site data refresh - clear old data, insert fresh data'
      }
    };

    res.json({
      success: true,
      message: 'Conflict resolution modes documentation',
      modes: modes,
      recommendations: {
        'Patient Data': 'Use "ignore" to preserve existing patients, "merge" for visit data',
        'Reference Data': 'Use "ignore" to preserve lookup tables',
        'Test Data': 'Use "replace" to completely refresh test data',
        'Site Data': 'Use "overwrite" to update site-specific information'
      }
    });

  } catch (error) {
    console.error('Get conflict resolution modes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conflict resolution modes',
      error: error.message
    });
  }
});

module.exports = router;
module.exports.handleConflictResolution = handleConflictResolution;
