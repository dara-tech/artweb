/**
 * Check User Table Structure
 * Examines the tbluser table structure in art_aggregates
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password123',
  database: 'art_aggregates'
};

async function checkUserTable() {
  let connection;
  
  try {
    console.log('🔍 Connecting to art_aggregates database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully\n');
    
    // Check table structure
    console.log('📋 Checking tbluser table structure...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'art_aggregates' 
      AND TABLE_NAME = 'tbluser'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('Table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : 'NULL'} ${col.COLUMN_KEY ? `(${col.COLUMN_KEY})` : ''}`);
    });
    
    console.log('\n📊 Checking current data...');
    const [users] = await connection.execute(`
      SELECT * FROM tbluser LIMIT 5
    `);
    
    if (users.length > 0) {
      console.log(`Found ${users.length} user(s):`);
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        Object.entries(user).forEach(([key, value]) => {
          if (key === 'password') {
            console.log(`  - ${key}: ${value ? '[HASHED]' : 'NULL'}`);
          } else {
            console.log(`  - ${key}: ${value}`);
          }
        });
      });
    } else {
      console.log('No users found in the table');
    }
    
  } catch (error) {
    console.error('❌ Error checking user table:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

checkUserTable().catch(console.error);
