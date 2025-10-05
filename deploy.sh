#!/bin/bash

# PreART Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="preart"
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"

echo "🚀 Starting PreART deployment for $ENVIRONMENT environment..."

# Check if required tools are installed
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed"
        exit 1
    fi
    
    if ! command -v pm2 &> /dev/null; then
        echo "⚠️  PM2 is not installed. Installing..."
        npm install -g pm2
    fi
    
    echo "✅ Dependencies check passed"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    # Backend dependencies
    cd $BACKEND_DIR
    npm ci --only=production
    cd ..
    
    # Frontend dependencies and build
    cd $FRONTEND_DIR
    npm ci
    npm run build
    cd ..
    
    echo "✅ Dependencies installed"
}

# Setup environment
setup_environment() {
    echo "🔧 Setting up environment..."
    
    if [ ! -f "$BACKEND_DIR/.env" ]; then
        if [ -f "$BACKEND_DIR/.env.production" ]; then
            cp "$BACKEND_DIR/.env.production" "$BACKEND_DIR/.env"
            echo "✅ Copied production environment file"
        else
            echo "❌ No environment file found. Please create $BACKEND_DIR/.env"
            exit 1
        fi
    fi
    
    # Create necessary directories
    mkdir -p logs
    mkdir -p uploads
    mkdir -p $FRONTEND_DIR/dist
    
    echo "✅ Environment setup complete"
}

# Setup database
setup_database() {
    echo "🗄️  Setting up database..."
    
    cd $BACKEND_DIR
    
    # Create tblartsite table
    node -e "
    const mysql = require('mysql2/promise');
    require('dotenv').config();
    
    async function setupDatabase() {
      try {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'preart_sites_registry',
          port: process.env.DB_PORT || 3306
        });
        
        await connection.execute(\`
          CREATE TABLE IF NOT EXISTS tblartsite (
            Sid varchar(10) NOT NULL,
            SiteName varchar(100) NOT NULL,
            Status tinyint(1) NOT NULL DEFAULT 1,
            PRIMARY KEY (Sid),
            KEY idx_status (Status)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        \`);
        
        console.log('✅ Database table created');
        await connection.end();
      } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
      }
    }
    
    setupDatabase();
    "
    
    # Run setup scripts
    node scripts/setup-user-table.js
    node scripts/populate-sites.js
    
    cd ..
    
    echo "✅ Database setup complete"
}

# Deploy with PM2
deploy_pm2() {
    echo "🚀 Deploying with PM2..."
    
    # Stop existing processes
    pm2 stop $PROJECT_NAME-backend 2>/dev/null || true
    pm2 delete $PROJECT_NAME-backend 2>/dev/null || true
    
    # Start new process
    pm2 start ecosystem.config.js --env $ENVIRONMENT
    pm2 save
    
    echo "✅ PM2 deployment complete"
}

# Test deployment
test_deployment() {
    echo "🧪 Testing deployment..."
    
    # Wait for server to start
    sleep 5
    
    # Test health endpoint
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Health check passed"
    else
        echo "❌ Health check failed"
        exit 1
    fi
    
    # Test CORS endpoint
    if curl -f http://localhost:3001/api/cors-test > /dev/null 2>&1; then
        echo "✅ CORS test passed"
    else
        echo "❌ CORS test failed"
        exit 1
    fi
    
    echo "✅ Deployment test complete"
}

# Main deployment function
main() {
    echo "🎯 PreART Deployment Script"
    echo "=========================="
    echo "Environment: $ENVIRONMENT"
    echo "Project: $PROJECT_NAME"
    echo ""
    
    check_dependencies
    install_dependencies
    setup_environment
    setup_database
    deploy_pm2
    test_deployment
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📊 Application Status:"
    pm2 status
    echo ""
    echo "🔗 Health Check: http://localhost:3001/health"
    echo "🔗 CORS Test: http://localhost:3001/api/cors-test"
    echo ""
    echo "📝 Logs: pm2 logs $PROJECT_NAME-backend"
    echo "🔄 Restart: pm2 restart $PROJECT_NAME-backend"
    echo "⏹️  Stop: pm2 stop $PROJECT_NAME-backend"
}

# Run main function
main "$@"
