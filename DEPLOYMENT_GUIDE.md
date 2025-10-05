# PreART Medical Management System - Deployment Guide

## 🚀 Production Deployment Guide

This guide will help you deploy the PreART Medical Management System to a production server.

## 📋 Prerequisites

### System Requirements
- **Operating System**: Ubuntu 20.04+ / CentOS 8+ / RHEL 8+
- **Node.js**: Version 18.0 or higher
- **MySQL**: Version 8.0 or higher
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: Minimum 10GB free space
- **Web Server**: Nginx (recommended) or Apache

### Software Installation

#### 1. Install Node.js 18+
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

#### 2. Install MySQL 8.0+
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation

# CentOS/RHEL
sudo yum install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
sudo mysql_secure_installation
```

#### 3. Install Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# CentOS/RHEL
sudo yum install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 4. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

## 🔧 Deployment Steps

### Step 1: Clone and Prepare the Repository

```bash
# Clone the repository
git clone https://github.com/dara-tech/preartweb.git
cd preartweb

# Make deployment script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### Step 2: Database Setup

#### 2.1 Create the Registry Database
```bash
# Connect to MySQL
mysql -u root -p

# Create the registry database
CREATE DATABASE preart_sites_registry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create a dedicated user (recommended)
CREATE USER 'preart_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON preart_sites_registry.* TO 'preart_user'@'localhost';
GRANT ALL PRIVILEGES ON preart_*.* TO 'preart_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 2.2 Run Database Setup Scripts
```bash
cd backend/scripts

# Set up user table
node setup-user-table.js

# Populate sites
node populate-sites.js

# Add role system
node add-role-system.js
```

### Step 3: Environment Configuration

#### 3.1 Backend Environment
Edit `backend/.env`:
```bash
nano backend/.env
```

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=preart_sites_registry
DB_USER=preart_user
DB_PASSWORD=your_secure_password

# Server Configuration
PORT=3001
NODE_ENV=production

# JWT Configuration (Generate a strong secret)
JWT_SECRET=your_super_secure_jwt_secret_for_production_here
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=https://your-domain.com

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

#### 3.2 Frontend Environment
Edit `frontend/.env`:
```bash
nano frontend/.env
```

```env
# Production Environment Variables
VITE_API_URL=https://your-domain.com
VITE_APP_TITLE=PreART Medical Management System
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production
```

### Step 4: Start the Application

#### 4.1 Using PM2 (Recommended)
```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# Monitor the application
pm2 status
pm2 logs preart-backend
pm2 monit
```

#### 4.2 Manual Start (Alternative)
```bash
cd backend
npm start
```

### Step 5: Configure Web Server (Nginx)

#### 5.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/preart
```

```nginx
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
```

#### 5.2 Enable the Site
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/preart /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 6: SSL Certificate (Production)

#### 6.1 Install Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

#### 6.2 Obtain SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com
```

## 🔍 Verification and Testing

### 1. Check Application Status
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs preart-backend

# Check nginx status
sudo systemctl status nginx

# Check MySQL status
sudo systemctl status mysql
```

### 2. Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:3001/apiv1/sites

# Test frontend
curl http://your-domain.com
```

### 3. Test Database Connection
```bash
# Test database connection
mysql -u preart_user -p -e "USE preart_sites_registry; SHOW TABLES;"
```

## 📊 Monitoring and Maintenance

### 1. PM2 Monitoring
```bash
# View real-time logs
pm2 logs preart-backend --lines 100

# Monitor resources
pm2 monit

# Restart application
pm2 restart preart-backend

# Stop application
pm2 stop preart-backend
```

### 2. Log Management
```bash
# View application logs
tail -f backend/logs/combined.log

# View error logs
tail -f backend/logs/err.log

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. Database Maintenance
```bash
# Backup database
mysqldump -u preart_user -p preart_sites_registry > backup_$(date +%Y%m%d).sql

# Restore database
mysql -u preart_user -p preart_sites_registry < backup_20250115.sql
```

## 🔄 Updates and Maintenance

### 1. Application Updates
```bash
# Pull latest changes
git pull origin master

# Install new dependencies
cd backend && npm install
cd ../frontend && npm install

# Rebuild frontend
npm run build

# Restart application
pm2 restart preart-backend
```

### 2. Database Updates
```bash
# Run database migration scripts if needed
cd backend/scripts
node migrate-database-names.js  # If needed
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port 3001
sudo lsof -i :3001

# Kill the process
sudo kill -9 <PID>
```

#### 2. Database Connection Issues
```bash
# Check MySQL status
sudo systemctl status mysql

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check user permissions
mysql -u root -p -e "SELECT User, Host FROM mysql.user WHERE User='preart_user';"
```

#### 3. Frontend Not Loading
```bash
# Check if build exists
ls -la frontend/dist/

# Rebuild frontend
cd frontend && npm run build

# Check nginx configuration
sudo nginx -t
```

#### 4. API Not Responding
```bash
# Check PM2 logs
pm2 logs preart-backend

# Check if backend is running
ps aux | grep node

# Test API directly
curl http://localhost:3001/apiv1/sites
```

## 📞 Support

### Log Files Location
- **Application Logs**: `backend/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **System Logs**: `/var/log/syslog`

### Health Check URLs
- **Frontend**: `https://your-domain.com`
- **API Health**: `https://your-domain.com/apiv1/sites`
- **Database**: Test with MySQL client

### Performance Monitoring
- **PM2 Dashboard**: `pm2 monit`
- **System Resources**: `htop` or `top`
- **Disk Usage**: `df -h`
- **Memory Usage**: `free -h`

---

## 🎉 Deployment Complete!

Your PreART Medical Management System is now deployed and ready for production use!

**Next Steps:**
1. Configure your domain DNS to point to your server
2. Set up regular database backups
3. Configure monitoring and alerting
4. Train users on the new system
5. Set up regular security updates

For additional support, check the logs and refer to the troubleshooting section above.
