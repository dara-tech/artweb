#!/usr/bin/env node

/**
 * Script to populate the database with all ART sites
 * This script reads from the art-sites.json file and populates the tblartsite table
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load the ART sites data
const sitesDataPath = path.join(__dirname, '../src/data/art-sites.json');
const sitesData = JSON.parse(fs.readFileSync(sitesDataPath, 'utf8'));

async function populateSites() {
  let connection;
  
  try {
    console.log('🏥 ART Sites Population Script');
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
    
    // Check current sites
    const [currentSites] = await connection.execute('SELECT COUNT(*) as count FROM tblartsite');
    console.log('📊 Current sites in database:', currentSites[0].count);
    
    // Get sites from JSON
    const sites = sitesData.sites;
    console.log('📋 Sites to process:', sites.length);
    
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    console.log('\n🔄 Processing sites...');
    console.log('----------------------');
    
    for (const site of sites) {
      try {
        const { code, name, status } = site;
        
        // Check if site already exists
        const [existingSite] = await connection.execute(
          'SELECT Sid FROM tblartsite WHERE Sid = ?',
          [code]
        );
        
        if (existingSite.length > 0) {
          // Update existing site
          await connection.execute(
            'UPDATE tblartsite SET SiteName = ?, Status = ? WHERE Sid = ?',
            [name, status, code]
          );
          console.log(`🔄 Updated: ${code} - ${name}`);
          updated++;
        } else {
          // Insert new site
          await connection.execute(
            'INSERT INTO tblartsite (Sid, SiteName, Status) VALUES (?, ?, ?)',
            [code, name, status]
          );
          console.log(`✅ Created: ${code} - ${name}`);
          created++;
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${site.code}:`, error.message);
        errors++;
      }
    }
    
    // Get final count
    const [finalSites] = await connection.execute('SELECT COUNT(*) as count FROM tblartsite');
    const [activeSites] = await connection.execute('SELECT COUNT(*) as count FROM tblartsite WHERE Status = 1');
    
    console.log('\n📊 Summary');
    console.log('===========');
    console.log(`✅ Created: ${created}`);
    console.log(`🔄 Updated: ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📈 Total sites: ${finalSites[0].count}`);
    console.log(`🟢 Active sites: ${activeSites[0].count}`);
    
    // Show sites by province
    console.log('\n🏛️  Sites by Province');
    console.log('====================');
    const [provinceStats] = await connection.execute(`
      SELECT 
        SUBSTRING(Sid, 1, 2) as provinceCode,
        COUNT(*) as siteCount
      FROM tblartsite 
      WHERE Status = 1
      GROUP BY SUBSTRING(Sid, 1, 2)
      ORDER BY provinceCode
    `);
    
    provinceStats.forEach(stat => {
      const province = sitesData.provinces.find(p => p.code === stat.provinceCode);
      const provinceName = province ? province.name : `Province ${stat.provinceCode}`;
      console.log(`${stat.provinceCode} - ${provinceName}: ${stat.siteCount} sites`);
    });
    
    console.log('\n🎉 Site population completed successfully!');
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
if (require.main === module) {
  populateSites();
}

module.exports = { populateSites };
