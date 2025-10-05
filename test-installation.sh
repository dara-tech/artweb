#!/bin/bash

echo "🧪 PreART Installation Test Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

echo "📋 Step 1: Testing Backend Dependencies"
echo "--------------------------------------"
cd backend
npm install
print_status $? "Backend dependencies installed"

echo ""
echo "📋 Step 2: Testing Frontend Dependencies"
echo "---------------------------------------"
cd ../frontend
npm install
print_status $? "Frontend dependencies installed"

echo ""
echo "📋 Step 3: Testing Database Setup"
echo "--------------------------------"
cd ../backend

# Test database connection and table creation
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'preart_sites_registry',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('✅ Database connection successful');
    
    // Create tblartsite table if it doesn't exist
    await connection.execute(\`
      CREATE TABLE IF NOT EXISTS tblartsite (
        Sid varchar(10) NOT NULL,
        SiteName varchar(100) NOT NULL,
        Status tinyint(1) NOT NULL DEFAULT 1,
        PRIMARY KEY (Sid),
        KEY idx_status (Status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    \`);
    
    console.log('✅ tblartsite table ready');
    await connection.end();
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

testDatabase();
"
print_status $? "Database setup completed"

echo ""
echo "📋 Step 4: Testing User Table Setup"
echo "----------------------------------"
node scripts/setup-user-table.js
print_status $? "User table setup completed"

echo ""
echo "📋 Step 5: Testing Sites Population"
echo "---------------------------------"
node scripts/populate-sites.js
print_status $? "Sites population completed"

echo ""
echo "📋 Step 6: Testing Frontend Build"
echo "--------------------------------"
cd ../frontend
npm run build
print_status $? "Frontend build completed"

echo ""
echo "🎉 Installation Test Completed Successfully!"
echo "============================================"
echo ""
echo "✅ All components are working correctly"
echo "✅ Database is properly configured"
echo "✅ All tables are created and populated"
echo "✅ Frontend builds without errors"
echo ""
echo "🚀 You can now start the application:"
echo "   Backend:  cd backend && npm start"
echo "   Frontend: cd frontend && npm run dev"
echo ""
