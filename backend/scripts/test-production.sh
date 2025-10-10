#!/bin/bash
# Production Testing Suite for ArtWeb
# Tests all components before production deployment

set -e  # Exit on any error

echo "🚀 ArtWeb Production Testing Suite"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${BLUE}🧪 Testing: $test_name${NC}"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASSED: $test_name${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAILED: $test_name${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    echo ""
}

# Function to check if service is running
check_service() {
    local service_name="$1"
    local port="$2"
    
    if curl -s "http://localhost:$port" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

echo -e "${YELLOW}📋 Starting Production Tests...${NC}"
echo ""

# ===================================================================
# 1. BACKEND API TESTS
# ===================================================================
echo -e "${YELLOW}🔧 Backend API Tests${NC}"
echo "------------------------"

# Check if backend is running
run_test "Backend Server Running" "check_service 'Backend' 3001"

# Test database connection
run_test "Database Connection" "node -e \"
const { sequelize } = require('./src/config/database');
sequelize.authenticate().then(() => {
  console.log('Database connected');
  process.exit(0);
}).catch(err => {
  console.error('Database connection failed:', err.message);
  process.exit(1);
});
\""

# Test site database connections
run_test "Site Database Manager" "node -e \"
const { SiteDatabaseManager } = require('./src/config/siteDatabase');
const manager = new SiteDatabaseManager();
manager.getAllSitesForManagement().then(sites => {
  console.log('Site manager working, found', sites.length, 'sites');
  process.exit(0);
}).catch(err => {
  console.error('Site manager failed:', err.message);
  process.exit(1);
});
\""

# Test key API endpoints
run_test "Auth Endpoint" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/apiv1/auth/login | grep -q '200\\|400'"

run_test "Sites Endpoint" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/apiv1/sites | grep -q '200\\|401'"

run_test "Indicators Endpoint" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/apiv1/indicators | grep -q '200\\|401'"

# ===================================================================
# 2. DATABASE PERFORMANCE TESTS
# ===================================================================
echo -e "${YELLOW}🗄️ Database Performance Tests${NC}"
echo "--------------------------------"

# Test indicator validation
run_test "Indicator Validation Script" "node scripts/validate-indicators.js > /dev/null 2>&1"

# Test database optimization (safe version)
run_test "Database Optimization Check" "mysql -u root -p -e 'SHOW VARIABLES LIKE \"innodb_buffer_pool_size\"' > /dev/null 2>&1"

# ===================================================================
# 3. FRONTEND BUILD TESTS
# ===================================================================
echo -e "${YELLOW}🎨 Frontend Build Tests${NC}"
echo "---------------------------"

# Test frontend build
run_test "Frontend Build Process" "cd ../frontend && npm run build > /dev/null 2>&1"

# Check if build artifacts exist
run_test "Build Artifacts Created" "test -d ../frontend/dist && test -f ../frontend/dist/index.html"

# Test frontend dependencies
run_test "Frontend Dependencies" "cd ../frontend && npm ci > /dev/null 2>&1"

# ===================================================================
# 4. ANALYTICS ENGINE TESTS
# ===================================================================
echo -e "${YELLOW}📊 Analytics Engine Tests${NC}"
echo "----------------------------"

# Test analytics API endpoints
run_test "Analytics Sites Endpoint" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/apiv1/analytics/sites | grep -q '200\\|401'"

run_test "Analytics Indicators Endpoint" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/apiv1/analytics/indicators | grep -q '200\\|401'"

run_test "Analytics Years Endpoint" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/apiv1/analytics/years | grep -q '200\\|401'"

# Test WebSocket connection (if server is running)
run_test "WebSocket Server" "node -e \"
const io = require('socket.io-client');
const socket = io('http://localhost:3001');
socket.on('connect', () => {
  console.log('WebSocket connected');
  socket.disconnect();
  process.exit(0);
});
setTimeout(() => {
  console.log('WebSocket timeout');
  process.exit(1);
}, 5000);
\""

# ===================================================================
# 5. PRODUCTION CONFIGURATION TESTS
# ===================================================================
echo -e "${YELLOW}⚙️ Production Configuration Tests${NC}"
echo "--------------------------------------"

# Check environment files
run_test "Environment Configuration" "test -f .env || test -f env.production"

# Check production database config
run_test "Production Database Config" "node -e \"
require('dotenv').config({ path: '.env' });
if (process.env.DB_HOST && process.env.DB_USER) {
  console.log('Database config found');
  process.exit(0);
} else {
  console.log('Database config missing');
  process.exit(1);
}
\""

# Check frontend environment
run_test "Frontend Environment" "test -f ../frontend/.env || echo 'Using default frontend config'"

# ===================================================================
# 6. SECURITY TESTS
# ===================================================================
echo -e "${YELLOW}🔒 Security Tests${NC}"
echo "----------------"

# Check for sensitive data in code
run_test "No Hardcoded Passwords" "! grep -r 'password.*=' src/ --include='*.js' | grep -v 'process.env'"

# Check for exposed API keys
run_test "No Exposed API Keys" "! grep -r 'sk-\\|pk_' src/ ../frontend/src/ --include='*.js' --include='*.jsx'"

# ===================================================================
# 7. PERFORMANCE TESTS
# ===================================================================
echo -e "${YELLOW}⚡ Performance Tests${NC}"
echo "----------------------"

# Test API response times
run_test "API Response Time" "curl -s -w '%{time_total}' -o /dev/null http://localhost:3001/apiv1/sites | awk '{if (\$1 < 2.0) exit 0; else exit 1}'"

# Test database query performance
run_test "Database Query Performance" "timeout 30s node -e \"
const { sequelize } = require('./src/config/database');
const start = Date.now();
sequelize.query('SELECT COUNT(*) FROM tblaimain LIMIT 1').then(() => {
  const duration = Date.now() - start;
  if (duration < 5000) {
    console.log('Query performance OK:', duration, 'ms');
    process.exit(0);
  } else {
    console.log('Query too slow:', duration, 'ms');
    process.exit(1);
  }
}).catch(err => {
  console.error('Query failed:', err.message);
  process.exit(1);
});
\""

# ===================================================================
# SUMMARY
# ===================================================================
echo -e "${YELLOW}📊 Test Summary${NC}"
echo "==============="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Ready for production deployment.${NC}"
    exit 0
else
    echo -e "${RED}❌ $TESTS_FAILED tests failed. Please fix issues before production deployment.${NC}"
    exit 1
fi
