const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Base database configuration with optimized settings
const baseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,           // Reduced to prevent connection overflow
        min: 2,            // Reduced minimum connections
        acquire: 30000,    // Acquire timeout
        idle: 5000,        // Reduced idle timeout
        evict: 1000,       // Check for idle connections every 1 second
        handleDisconnects: true
      },
  define: {
    timestamps: true,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  dialectOptions: {
    charset: 'utf8mb4',
    connectTimeout: 10000,
    multipleStatements: true
  }
};

// Registry database for site management
const registryConfig = {
  ...baseConfig,
  database: 'preart_sites_registry'
};

// Create registry connection
const registrySequelize = new Sequelize(registryConfig);

// Cache for site database connections
const siteConnections = new Map();

// Site database manager
class SiteDatabaseManager {
  constructor() {
    this.registryConnection = registrySequelize;
    this.siteConnections = siteConnections;
  }

  // Get site information from registry
  async getSiteInfo(siteCode) {
    try {
      const [results] = await this.registryConnection.query(
        `SELECT * FROM sites WHERE code = '${siteCode}' AND status = 1`
      );
      return results[0] || null;
    } catch (error) {
      console.error('Error getting site info:', error);
      return null;
    }
  }

  // Get all active sites
  async getAllSites() {
    try {
      const [results] = await this.registryConnection.query(
        `SELECT 
          code, 
          name, 
          COALESCE(short_name, name) as short_name,
          COALESCE(display_name, short_name, name) as display_name,
          COALESCE(search_terms, name) as search_terms,
          status,
          database_name
        FROM sites 
        WHERE status = 1 
        ORDER BY code`
      );
      return results;
    } catch (error) {
      console.error('Error getting all sites:', error);
      return [];
    }
  }

  // Get or create connection for a specific site
  async getSiteConnection(siteCode) {
    // Check if connection already exists
    if (this.siteConnections.has(siteCode)) {
      return this.siteConnections.get(siteCode);
    }

    // Get site information
    const siteInfo = await this.getSiteInfo(siteCode);
    if (!siteInfo) {
      throw new Error(`Site ${siteCode} not found or inactive`);
    }

    // Create new connection for this site
    const siteConfig = {
      ...baseConfig,
      database: siteInfo.database_name
    };

    const siteConnection = new Sequelize(siteConfig);
    
    // Test the connection
    try {
      await siteConnection.authenticate();
      console.log(`✅ Connected to site database: ${siteInfo.name} (${siteCode})`);
    } catch (error) {
      console.error(`❌ Failed to connect to site database ${siteCode}:`, error);
      throw error;
    }

    // Cache the connection
    this.siteConnections.set(siteCode, siteConnection);
    return siteConnection;
  }

  // Execute query on specific site database
  async executeSiteQuery(siteCode, query, params = {}) {
    try {
      const siteInfo = await this.getSiteInfo(siteCode);
      if (!siteInfo) {
        throw new Error(`Site ${siteCode} not found`);
      }

      // Replace parameters in the query string
      let processedQuery = query;
      if (params && Object.keys(params).length > 0) {
        // Replace :paramName with actual values
        Object.keys(params).forEach(key => {
          const value = params[key];
          const placeholder = `:${key}`;
          if (typeof value === 'string') {
            processedQuery = processedQuery.replace(new RegExp(placeholder, 'g'), `'${value}'`);
          } else if (value === null) {
            processedQuery = processedQuery.replace(new RegExp(placeholder, 'g'), 'NULL');
          } else {
            processedQuery = processedQuery.replace(new RegExp(placeholder, 'g'), value);
          }
        });
      }

      const connection = await this.getSiteConnection(siteCode);
      const [results] = await connection.query(processedQuery);
      return results;
    } catch (error) {
      console.error(`Error executing query for site ${siteCode}:`, error);
      throw error;
    }
  }

  // Execute query on specific site database (for INSERT/UPDATE/DELETE)
  async executeSiteUpdate(siteCode, query, replacements = []) {
    const connection = await this.getSiteConnection(siteCode);
    const [results] = await connection.query(query, replacements);
    return results;
  }

  // Get connection for registry database
  getRegistryConnection() {
    return this.registryConnection;
  }

  // Close all connections
  async closeAllConnections() {
    // Close site connections
    for (const [siteCode, connection] of this.siteConnections) {
      try {
        await connection.close();
        console.log(`✅ Closed connection for site: ${siteCode}`);
      } catch (error) {
        console.error(`❌ Error closing connection for site ${siteCode}:`, error);
      }
    }
    this.siteConnections.clear();

    // Close registry connection
    try {
      await this.registryConnection.close();
      console.log('✅ Closed registry connection');
    } catch (error) {
      console.error('❌ Error closing registry connection:', error);
    }
  }

  // Test all connections
  async testAllConnections() {
    console.log('🧪 Testing database connections...');
    
    try {
      // Test registry connection
      await this.registryConnection.authenticate();
      console.log('✅ Registry database connection: OK');
      
      // Test site connections
      const sites = await this.getAllSites();
      for (const site of sites) {
        try {
          const connection = await this.getSiteConnection(site.code);
          await connection.authenticate();
          console.log(`✅ Site ${site.code} (${site.name}) connection: OK`);
        } catch (error) {
          console.error(`❌ Site ${site.code} (${site.name}) connection: FAILED - ${error.message}`);
        }
      }
      
      console.log('🎉 All database connections tested successfully!');
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
const siteDatabaseManager = new SiteDatabaseManager();

// Test connection on startup
const testConnections = async () => {
  try {
    await siteDatabaseManager.testAllConnections();
  } catch (error) {
    console.error('❌ Failed to establish database connections:', error);
  }
};

// Export the manager and test function
module.exports = { 
  siteDatabaseManager, 
  testConnections,
  SiteDatabaseManager 
};
