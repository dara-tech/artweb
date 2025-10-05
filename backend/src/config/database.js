const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'preart_sites_registry',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 50,        // Increased from 10 to 50
    min: 5,         // Increased from 0 to 5
    acquire: 60000, // Increased from 30000 to 60000
    idle: 30000,    // Increased from 10000 to 30000
    evict: 1000,    // Check for idle connections every 1 second
    handleDisconnects: true
  },
  define: {
    timestamps: true,
    underscored: true,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  }
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, testConnection };
