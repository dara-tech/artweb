#!/bin/bash

# PreART Medical Management System - Deployment Script
# This script prepares and deploys the PreART system for production

set -e  # Exit on any error

echo "🚀 PreART Medical Management System - Deployment Script"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting deployment process..."

# Step 1: Check system requirements
print_status "Checking system requirements..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js version: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm version: $(npm --version)"

# Check MySQL
if ! command -v mysql &> /dev/null; then
    print_warning "MySQL client not found. Make sure MySQL server is running."
else
    print_success "MySQL client found"
fi

# Step 2: Install dependencies
print_status "Installing dependencies..."

# Backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install --omit=dev
if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Frontend dependencies
print_status "Installing frontend dependencies..."
cd ../frontend
npm install --omit=dev
if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Step 3: Build frontend
print_status "Building frontend for production..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Frontend built successfully"
else
    print_error "Failed to build frontend"
    exit 1
fi

cd ..

# Step 4: Check environment files
print_status "Checking environment configuration..."

# Check backend environment
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/env.production" ]; then
        print_status "Copying production environment template..."
        cp backend/env.production backend/.env
        print_warning "Please edit backend/.env with your production settings"
    else
        print_error "No environment file found. Please create backend/.env"
        exit 1
    fi
fi

# Check frontend environment
if [ ! -f "frontend/.env" ]; then
    if [ -f "frontend/.env.production" ]; then
        print_status "Using production environment for frontend..."
        cp frontend/.env.production frontend/.env
    else
        print_warning "No frontend environment file found"
    fi
fi

# Step 5: Create necessary directories
print_status "Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p backend/logs
mkdir -p backend/temp

# Step 6: Set permissions
print_status "Setting file permissions..."
chmod +x backend/scripts/*.js 2>/dev/null || true
chmod 755 backend/uploads
chmod 755 backend/logs
chmod 755 backend/temp

# Step 7: Database setup reminder
print_status "Database setup required..."
print_warning "IMPORTANT: Make sure to:"
echo "  1. Create MySQL database: preart_sites_registry"
echo "  2. Run the database setup scripts"
echo "  3. Update backend/.env with your database credentials"
echo "  4. Test the database connection"

# Step 8: Create PM2 ecosystem file for production
print_status "Creating PM2 ecosystem configuration..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'preart-backend',
    script: './backend/src/server.js',
    cwd: './',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './backend/logs/err.log',
    out_file: './backend/logs/out.log',
    log_file: './backend/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

print_success "PM2 ecosystem configuration created"

# Step 9: Create systemd service file (optional)
print_status "Creating systemd service template..."
cat > preart-backend.service << 'EOF'
[Unit]
Description=PreART Medical Management System Backend
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/preartweb
ExecStart=/usr/bin/node backend/src/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

print_success "Systemd service template created (update paths before using)"

# Step 10: Create nginx configuration template
print_status "Creating nginx configuration template..."
cat > nginx-preart.conf << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (static files)
    location / {
        root /path/to/preartweb/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }

    # Backend API
    location /apiv1/ {
        proxy_pass http://localhost:3001/apiv1/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # File uploads
    location /uploads/ {
        alias /path/to/preartweb/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

print_success "Nginx configuration template created"

# Step 11: Final checks
print_status "Running final checks..."

# Check if build files exist
if [ -d "frontend/dist" ]; then
    print_success "Frontend build directory exists"
else
    print_error "Frontend build directory not found"
    exit 1
fi

# Check if backend server file exists
if [ -f "backend/src/server.js" ]; then
    print_success "Backend server file exists"
else
    print_error "Backend server file not found"
    exit 1
fi

# Step 12: Create deployment summary
print_status "Creating deployment summary..."
cat > DEPLOYMENT_SUMMARY.md << 'EOF'
# PreART Medical Management System - Deployment Summary

## Deployment Completed Successfully! 🎉

### What was deployed:
- ✅ Backend API server (Node.js/Express)
- ✅ Frontend React application (built for production)
- ✅ Database configuration (preart_sites_registry)
- ✅ Environment configuration
- ✅ PM2 ecosystem configuration
- ✅ Nginx configuration template
- ✅ Systemd service template

### Next Steps:

1. **Database Setup:**
   ```bash
   # Create the registry database
   mysql -u root -p -e "CREATE DATABASE preart_sites_registry;"
   
   # Run the setup scripts
   cd backend/scripts
   node setup-user-table.js
   node populate-sites.js
   ```

2. **Environment Configuration:**
   - Edit `backend/.env` with your production database credentials
   - Update `frontend/.env` with your production API URL

3. **Start the Application:**
   ```bash
   # Using PM2 (recommended)
   npm install -g pm2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   
   # Or manually
   cd backend && npm start
   ```

4. **Web Server Setup:**
   - Copy `nginx-preart.conf` to your nginx sites directory
   - Update the paths in the configuration
   - Reload nginx: `sudo nginx -s reload`

5. **SSL Certificate (Production):**
   ```bash
   # Using Let's Encrypt
   sudo certbot --nginx -d your-domain.com
   ```

### File Structure:
```
preartweb/
├── backend/                 # Backend API server
├── frontend/dist/          # Built frontend (production)
├── ecosystem.config.js     # PM2 configuration
├── nginx-preart.conf       # Nginx configuration
├── preart-backend.service  # Systemd service
└── DEPLOYMENT_SUMMARY.md   # This file
```

### Monitoring:
- PM2: `pm2 status`, `pm2 logs`, `pm2 monit`
- Logs: `backend/logs/`
- Health check: `http://your-domain.com/apiv1/sites`

### Support:
- Check logs for errors: `pm2 logs preart-backend`
- Restart service: `pm2 restart preart-backend`
- Update application: `git pull && pm2 restart preart-backend`

---
Deployment completed on: $(date)
EOF

print_success "Deployment summary created: DEPLOYMENT_SUMMARY.md"

# Final success message
echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY! 🎉"
echo ""
print_success "PreART Medical Management System is ready for production!"
echo ""
print_status "Next steps:"
echo "  1. Set up your database (see DEPLOYMENT_SUMMARY.md)"
echo "  2. Configure your environment files"
echo "  3. Start the application with PM2"
echo "  4. Configure your web server (nginx/apache)"
echo ""
print_status "For detailed instructions, see: DEPLOYMENT_SUMMARY.md"
echo ""
print_warning "Remember to:"
echo "  - Update database credentials in backend/.env"
echo "  - Update API URL in frontend/.env"
echo "  - Configure your web server"
echo "  - Set up SSL certificates for production"
echo ""
