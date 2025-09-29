#!/usr/bin/env node

/**
 * Data Migration Utility for ART Sites
 * This script helps migrate data between different ART sites
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrateData() {
  let connection;
  
  try {
    console.log('🔄 ART Data Migration Utility');
    console.log('==============================');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'preart',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database:', process.env.DB_NAME);
    
    // Get all sites
    const [sites] = await connection.execute('SELECT Sid, SiteName FROM tblartsite WHERE Status = 1 ORDER BY Sid');
    console.log(`📊 Found ${sites.length} active sites`);
    
    // Show site data summary
    console.log('\n📋 Site Data Summary');
    console.log('====================');
    
    for (const site of sites) {
      const [adultPatients] = await connection.execute(
        'SELECT COUNT(*) as count FROM tblaimain WHERE SiteName = ?',
        [site.Sid]
      );
      
      const [childPatients] = await connection.execute(
        'SELECT COUNT(*) as count FROM tblcimain WHERE SiteName = ?',
        [site.Sid]
      );
      
      const [infantPatients] = await connection.execute(
        'SELECT COUNT(*) as count FROM tbleimain WHERE SiteName = ?',
        [site.Sid]
      );
      
      const totalPatients = adultPatients[0].count + childPatients[0].count + infantPatients[0].count;
      
      console.log(`${site.Sid} - ${site.SiteName}: ${totalPatients} patients (A:${adultPatients[0].count}, C:${childPatients[0].count}, I:${infantPatients[0].count})`);
    }
    
    // Show migration options
    console.log('\n🛠️  Migration Options');
    console.log('====================');
    console.log('1. Export all site data');
    console.log('2. Export specific site data');
    console.log('3. Import data from SQL file');
    console.log('4. Show data distribution');
    console.log('5. Clean up empty sites');
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Migration utility failed:', error.message);
    process.exit(1);
  }
}

// Export specific site data
async function exportSiteData(siteCode) {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'preart',
      port: process.env.DB_PORT || 3306
    });

    console.log(`📤 Exporting data for site: ${siteCode}`);
    
    // Get site info
    const [site] = await connection.execute(
      'SELECT Sid, SiteName FROM tblartsite WHERE Sid = ? AND Status = 1',
      [siteCode]
    );

    if (!site[0]) {
      console.error('❌ Site not found or inactive');
      return;
    }

    let exportData = '';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Export header
    exportData += `-- Site Data Export\n`;
    exportData += `-- Site: ${site[0].SiteName} (${siteCode})\n`;
    exportData += `-- Exported: ${new Date().toISOString()}\n\n`;

    // Export site information
    exportData += `-- Site Information\n`;
    exportData += `INSERT INTO tblartsite (Sid, SiteName, Status) VALUES ('${siteCode}', '${site[0].SiteName}', 1) ON DUPLICATE KEY UPDATE SiteName = '${site[0].SiteName}', Status = 1;\n\n`;

    // Export adult patients
    const [adultPatients] = await connection.execute(
      'SELECT * FROM tblaimain WHERE SiteName = ?',
      [siteCode]
    );

    if (adultPatients.length > 0) {
      exportData += `-- Adult Patients for Site ${siteCode}\n`;
      exportData += `DELETE FROM tblaimain WHERE SiteName = '${siteCode}';\n`;
      
      const [columns] = await connection.execute('DESCRIBE tblaimain');
      const columnNames = columns.map(col => `\`${col.Field}\``).join(', ');
      
      for (const patient of adultPatients) {
        const values = Object.values(patient).map(value => {
          if (value === null) return 'NULL';
          if (typeof value === 'string') {
            return `'${value.replace(/'/g, "''")}'`;
          }
          return value;
        });
        exportData += `INSERT INTO tblaimain (${columnNames}) VALUES (${values.join(', ')});\n`;
      }
      exportData += '\n';
    }

    // Export child patients
    const [childPatients] = await connection.execute(
      'SELECT * FROM tblcimain WHERE SiteName = ?',
      [siteCode]
    );

    if (childPatients.length > 0) {
      exportData += `-- Child Patients for Site ${siteCode}\n`;
      exportData += `DELETE FROM tblcimain WHERE SiteName = '${siteCode}';\n`;
      
      const [columns] = await connection.execute('DESCRIBE tblcimain');
      const columnNames = columns.map(col => `\`${col.Field}\``).join(', ');
      
      for (const patient of childPatients) {
        const values = Object.values(patient).map(value => {
          if (value === null) return 'NULL';
          if (typeof value === 'string') {
            return `'${value.replace(/'/g, "''")}'`;
          }
          return value;
        });
        exportData += `INSERT INTO tblcimain (${columnNames}) VALUES (${values.join(', ')});\n`;
      }
      exportData += '\n';
    }

    // Export infant patients
    const [infantPatients] = await connection.execute(
      'SELECT * FROM tbleimain WHERE SiteName = ?',
      [siteCode]
    );

    if (infantPatients.length > 0) {
      exportData += `-- Infant Patients for Site ${siteCode}\n`;
      exportData += `DELETE FROM tbleimain WHERE SiteName = '${siteCode}';\n`;
      
      const [columns] = await connection.execute('DESCRIBE tbleimain');
      const columnNames = columns.map(col => `\`${col.Field}\``).join(', ');
      
      for (const patient of infantPatients) {
        const values = Object.values(patient).map(value => {
          if (value === null) return 'NULL';
          if (typeof value === 'string') {
            return `'${value.replace(/'/g, "''")}'`;
          }
          return value;
        });
        exportData += `INSERT INTO tbleimain (${columnNames}) VALUES (${values.join(', ')});\n`;
      }
      exportData += '\n';
    }

    // Create filename and save
    const filename = `site_${siteCode}_export_${timestamp}.sql`;
    const filepath = path.join(__dirname, '../exports', filename);
    
    // Ensure exports directory exists
    const exportsDir = path.dirname(filepath);
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    fs.writeFileSync(filepath, exportData);
    
    console.log(`✅ Export completed: ${filename}`);
    console.log(`📁 File size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`);
    console.log(`📊 Records exported: ${adultPatients.length + childPatients.length + infantPatients.length}`);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    if (connection) {
      await connection.end();
    }
  }
}

// Show data distribution
async function showDataDistribution() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'preart',
      port: process.env.DB_PORT || 3306
    });

    console.log('📊 Data Distribution Analysis');
    console.log('=============================');
    
    // Get total counts
    const [totalAdult] = await connection.execute('SELECT COUNT(*) as count FROM tblaimain');
    const [totalChild] = await connection.execute('SELECT COUNT(*) as count FROM tblcimain');
    const [totalInfant] = await connection.execute('SELECT COUNT(*) as count FROM tbleimain');
    
    console.log(`\n📈 Total Records:`);
    console.log(`  Adult Patients: ${totalAdult[0].count}`);
    console.log(`  Child Patients: ${totalChild[0].count}`);
    console.log(`  Infant Patients: ${totalInfant[0].count}`);
    console.log(`  Total Patients: ${totalAdult[0].count + totalChild[0].count + totalInfant[0].count}`);
    
    // Get site distribution
    const [siteDistribution] = await connection.execute(`
      SELECT 
        SiteName,
        COUNT(*) as patientCount
      FROM (
        SELECT SiteName FROM tblaimain
        UNION ALL
        SELECT SiteName FROM tblcimain
        UNION ALL
        SELECT SiteName FROM tbleimain
      ) as all_patients
      GROUP BY SiteName
      ORDER BY patientCount DESC
    `);
    
    console.log(`\n🏥 Patients by Site:`);
    siteDistribution.forEach(site => {
      console.log(`  ${site.SiteName}: ${site.patientCount} patients`);
    });
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    if (connection) {
      await connection.end();
    }
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    migrateData();
  } else if (args[0] === 'export' && args[1]) {
    exportSiteData(args[1]);
  } else if (args[0] === 'distribution') {
    showDataDistribution();
  } else {
    console.log('Usage:');
    console.log('  node data-migration.js                    - Show migration options');
    console.log('  node data-migration.js export <siteCode>  - Export specific site');
    console.log('  node data-migration.js distribution       - Show data distribution');
  }
}

module.exports = { migrateData, exportSiteData, showDataDistribution };
