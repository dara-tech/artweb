// ART Web Comprehensive Analysis Workbook
// Generated: 2025-10-13T11:49:15.721Z
// 
// This script provides a complete analysis framework for HIV/AIDS indicators
// Compatible with Node.js, Jupyter notebooks, and other JavaScript environments
//

const mysql = require('mysql2/promise');
const fs = require('fs').promises;

// Configuration - Update these values for your environment
const config = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'your_username',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'your_database'
  },
  analysis: {
    siteCode: process.env.SITE_CODE || 'YOUR_SITE_CODE',
    startDate: process.env.START_DATE || '2025-01-01',
    endDate: process.env.END_DATE || '2025-03-31',
    outputDir: process.env.OUTPUT_DIR || './analysis-results'
  }
};

// Database connection manager
class DatabaseManager {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(this.config);
      console.log('✅ Connected to database successfully');
      return this.connection;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log('✅ Database connection closed');
    }
  }

  async query(sql, params = []) {
    if (!this.connection) {
      throw new Error('Database not connected');
    }
    const [rows] = await this.connection.execute(sql, params);
    return rows;
  }
}

// Indicator Analysis Class
class IndicatorAnalyzer {
  constructor(dbManager, config) {
    this.db = dbManager;
    this.config = config;
    this.results = {};
  }

  // Helper method to build WHERE clause for site and date filtering
  buildWhereClause(siteCode, startDate, endDate, tableAlias = 'p') {
    return `WHERE ${tableAlias}.SiteName = '${siteCode}' 
      AND ${tableAlias}.DafirstVisit >= '${startDate}' 
      AND ${tableAlias}.DafirstVisit <= '${endDate}'`;
  }

  // 01. Active ART Previous Period
  async getActiveArtPrevious() {
    console.log('📊 Analyzing: Active ART Previous Period');
    
    const sql = `
      SELECT 
        COUNT(*) as total_active_art_previous,
        COUNT(CASE WHEN p.Sex = 'Male' THEN 1 END) as male_count,
        COUNT(CASE WHEN p.Sex = 'Female' THEN 1 END) as female_count,
        AVG(YEAR(CURDATE()) - YEAR(p.DaBirth)) as avg_age
      FROM tblaimain p
      ${this.buildWhereClause(this.config.siteCode, this.config.startDate, this.config.endDate)}
      AND p.DaART IS NOT NULL
      AND p.DaART <= '${this.config.endDate}'
    `;
    
    const result = await this.db.query(sql);
    this.results.activeArtPrevious = result[0];
    return result[0];
  }

  // 02. Active Pre-ART Previous Period
  async getActivePreArtPrevious() {
    console.log('📊 Analyzing: Active Pre-ART Previous Period');
    
    const sql = `
      SELECT 
        COUNT(*) as total_active_pre_art_previous,
        COUNT(CASE WHEN p.Sex = 'Male' THEN 1 END) as male_count,
        COUNT(CASE WHEN p.Sex = 'Female' THEN 1 END) as female_count
      FROM tblaimain p
      ${this.buildWhereClause(this.config.siteCode, this.config.startDate, this.config.endDate)}
      AND p.DaART IS NULL
    `;
    
    const result = await this.db.query(sql);
    this.results.activePreArtPrevious = result[0];
    return result[0];
  }

  // 03. Newly Enrolled
  async getNewlyEnrolled() {
    console.log('📊 Analyzing: Newly Enrolled Patients');
    
    const sql = `
      SELECT 
        COUNT(*) as total_newly_enrolled,
        COUNT(CASE WHEN p.Sex = 'Male' THEN 1 END) as male_count,
        COUNT(CASE WHEN p.Sex = 'Female' THEN 1 END) as female_count,
        COUNT(CASE WHEN p.Age < 15 THEN 1 END) as pediatric_count,
        COUNT(CASE WHEN p.Age >= 15 THEN 1 END) as adult_count
      FROM tblaimain p
      ${this.buildWhereClause(this.config.siteCode, this.config.startDate, this.config.endDate)}
    `;
    
    const result = await this.db.query(sql);
    this.results.newlyEnrolled = result[0];
    return result[0];
  }

  // Run all analyses
  async runAllAnalyses() {
    console.log('🚀 Starting comprehensive indicator analysis...');
    console.log(`📍 Site Code: ${this.config.siteCode}`);
    console.log(`📅 Period: ${this.config.startDate} to ${this.config.endDate}`);
    console.log('');

    try {
      await this.getActiveArtPrevious();
      await this.getActivePreArtPrevious();
      await this.getNewlyEnrolled();

      console.log('✅ All analyses completed successfully!');
      return this.results;
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      throw error;
    }
  }

  // Generate summary report
  generateSummaryReport() {
    const report = {
      metadata: {
        siteCode: this.config.siteCode,
        startDate: this.config.startDate,
        endDate: this.config.endDate,
        generatedAt: new Date().toISOString(),
        totalIndicators: Object.keys(this.results).length
      },
      indicators: this.results
    };

    return report;
  }

  // Save results to file
  async saveResults(filename = null) {
    const report = this.generateSummaryReport();
    const outputFile = filename || `${this.config.outputDir}/analysis-results-${this.config.siteCode}-${this.config.startDate}-to-${this.config.endDate}.json`;
    
    try {
      await fs.mkdir(this.config.outputDir, { recursive: true });
      await fs.writeFile(outputFile, JSON.stringify(report, null, 2));
      console.log(`📄 Results saved to: ${outputFile}`);
      return outputFile;
    } catch (error) {
      console.error('❌ Failed to save results:', error);
      throw error;
    }
  }
}

// Main execution function
async function main() {
  const dbManager = new DatabaseManager(config.database);
  const analyzer = new IndicatorAnalyzer(dbManager, config.analysis);

  try {
    // Connect to database
    await dbManager.connect();

    // Run all analyses
    const results = await analyzer.runAllAnalyses();

    // Generate and save report
    const outputFile = await analyzer.saveResults();

    // Display summary
    console.log('\n📊 ANALYSIS SUMMARY');
    console.log('==================');
    Object.entries(results).forEach(([key, value]) => {
      console.log(`${key}: ${JSON.stringify(value, null, 2)}`);
    });

    console.log('\n✅ Analysis completed successfully!');
    console.log(`📄 Full report saved to: ${outputFile}`);

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  } finally {
    await dbManager.disconnect();
  }
}

// Export for use in other modules
module.exports = {
  DatabaseManager,
  IndicatorAnalyzer,
  config
};

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
