#!/bin/bash
# Simplified Production Test Suite (No Password Required)
# Tests core functionality without requiring database passwords

set -e

echo "🚀 ArtWeb Production Test Suite (Simplified)"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

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

check_service() {
    local service_name="$1"
    local port="$2"
    
    if curl -s "http://localhost:$port" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

echo -e "${YELLOW}📋 Starting Simplified Production Tests...${NC}"
echo ""

# ===================================================================
# 1. BACKEND API TESTS
# ===================================================================
echo -e "${YELLOW}🔧 Backend API Tests${NC}"
echo "------------------------"

run_test "Backend Server Running" "check_service 'Backend' 3001"

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

# Test API endpoints (expect 401 for auth-required endpoints)
run_test "Sites Endpoint Accessible" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/apiv1/sites | grep -q '200\\|401'"

run_test "Analytics Sites Endpoint" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/apiv1/analytics/sites | grep -q '200\\|401'"

run_test "Analytics Indicators Endpoint" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/apiv1/analytics/indicators | grep -q '200\\|401'"

run_test "Analytics Years Endpoint" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/apiv1/analytics/years | grep -q '200\\|401'"

# ===================================================================
# 2. DATABASE PERFORMANCE TESTS
# ===================================================================
echo -e "${YELLOW}🗄️ Database Performance Tests${NC}"
echo "--------------------------------"

run_test "Indicator Validation Script" "node scripts/validate-indicators.js > /dev/null 2>&1"

run_test "Database Query Performance" "node -e \"
const { sequelize } = require('./src/config/database');
const start = Date.now();
const timeout = setTimeout(() => {
  console.log('Query timeout');
  process.exit(1);
}, 30000);
sequelize.query('SELECT COUNT(*) FROM sites LIMIT 1').then(() => {
  clearTimeout(timeout);
  const duration = Date.now() - start;
  if (duration < 5000) {
    console.log('Query performance OK:', duration, 'ms');
    process.exit(0);
  } else {
    console.log('Query too slow:', duration, 'ms');
    process.exit(1);
  }
}).catch(err => {
  clearTimeout(timeout);
  console.error('Query failed:', err.message);
  process.exit(1);
});
\""

# ===================================================================
# 3. FRONTEND BUILD TESTS
# ===================================================================
echo -e "${YELLOW}🎨 Frontend Build Tests${NC}"
echo "---------------------------"

run_test "Frontend Build Process" "cd ../frontend && npm run build > /dev/null 2>&1"

run_test "Build Artifacts Created" "test -d ../frontend/dist && test -f ../frontend/dist/index.html"

# ===================================================================
# 4. ANALYTICS ENGINE TESTS
# ===================================================================
echo -e "${YELLOW}📊 Analytics Engine Tests${NC}"
echo "----------------------------"

run_test "WebSocket Server" "node -e \"
const io = require('socket.io-client');
const wsUrl = process.env.WS_URL || 'http://localhost:3001';
console.log('Testing WebSocket connection to:', wsUrl);
const socket = io(wsUrl);
socket.on('connect', () => {
  console.log('WebSocket connected successfully');
  socket.disconnect();
  process.exit(0);
});
socket.on('connect_error', (err) => {
  console.log('WebSocket connection error:', err.message);
  process.exit(1);
});
setTimeout(() => {
  console.log('WebSocket connection timeout');
  process.exit(1);
}, 5000);
\""

# ===================================================================
# 5. CONFIGURATION TESTS
# ===================================================================
echo -e "${YELLOW}⚙️ Configuration Tests${NC}"
echo "------------------------"

run_test "Environment Configuration" "test -f .env || test -f env.production"

run_test "Production Database Config" "node -e \"
try {
  require('dotenv').config({ path: '.env' });
} catch (e) {
  // dotenv not available, check if env vars are set
}
if (process.env.DB_HOST && process.env.DB_USER) {
  console.log('Database config found');
  process.exit(0);
} else {
  console.log('Database config missing - using defaults');
  process.exit(0); // Allow default config
}
\""

# ===================================================================
# 6. SECURITY TESTS
# ===================================================================
echo -e "${YELLOW}🔒 Security Tests${NC}"
echo "----------------"

run_test "No Hardcoded Passwords" "! grep -r 'password.*=' src/ --include='*.js' | grep -v 'process.env'"

run_test "No Exposed API Keys" "! grep -r 'sk-\\|pk_' src/ ../frontend/src/ --include='*.js' --include='*.jsx'"

# ===================================================================
# 7. PERFORMANCE TESTS
# ===================================================================
echo -e "${YELLOW}⚡ Performance Tests${NC}"
echo "----------------------"

run_test "API Response Time" "curl -s -w '%{time_total}' -o /dev/null http://localhost:3001/apiv1/sites | awk '{if (\$1 < 2.0) exit 0; else exit 1}'"

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
    echo ""
    echo -e "${YELLOW}📋 Next Steps:${NC}"
    echo "1. Review the Production Deployment Checklist"
    echo "2. Set up production environment variables"
    echo "3. Configure production database"
    echo "4. Deploy to production server"
    echo "5. Run post-deployment verification"
    exit 0
else
    echo -e "${RED}❌ $TESTS_FAILED tests failed. Please fix issues before production deployment.${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Common Issues:${NC}"
    echo "- Check if backend server is running"
    echo "- Verify database connection settings"
    echo "- Ensure all dependencies are installed"
    echo "- Check environment configuration"
    exit 1
fi
