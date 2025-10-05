# 🚀 PreART Deployment Guide

## 📋 Pre-Deployment Checklist

### **1. Environment Setup**
- [ ] Production server with Node.js 18+ and MySQL 8+
- [ ] Domain name and SSL certificate
- [ ] Database server configured
- [ ] File storage directory created
- [ ] Environment variables configured

### **2. Security Configuration**
- [ ] Strong JWT secret generated
- [ ] Database credentials secured
- [ ] CORS origins configured
- [ ] Rate limiting enabled
- [ ] SSL/TLS configured

## 🔧 Production Configuration

### **Environment Variables**

Create `.env` file in production:

```bash
# Database Configuration
DB_HOST=your_production_db_host
DB_PORT=3306
DB_NAME=preart_sites_registry
DB_USER=your_production_username
DB_PASSWORD=your_secure_production_password

# Server Configuration
PORT=3001
NODE_ENV=production

# JWT Configuration (Generate with: openssl rand -base64 64)
JWT_SECRET=your_super_secure_jwt_secret_for_production_here_minimum_32_characters
JWT_EXPIRES_IN=24h

# CORS Configuration (Update with your actual domains)
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com

# Security Configuration
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://admin.yourdomain.com

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/var/www/preart/uploads

# SSL Configuration (if using HTTPS)
SSL_CERT_PATH=/path/to/your/cert.pem
SSL_KEY_PATH=/path/to/your/private.key

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=/var/log/preart/backend.log

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session Configuration
SESSION_SECRET=your_session_secret_here
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_HTTP_ONLY=true
SESSION_COOKIE_SAME_SITE=strict
```

## 🗄️ Database Setup

### **1. Create Production Database**
```sql
CREATE DATABASE preart_sites_registry;
CREATE USER 'preart_user'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON preart_sites_registry.* TO 'preart_user'@'%';
FLUSH PRIVILEGES;
```

### **2. Run Database Setup Scripts**
```bash
# Create tblartsite table
mysql -u preart_user -p preart_sites_registry -e "
CREATE TABLE IF NOT EXISTS tblartsite (
  Sid varchar(10) NOT NULL,
  SiteName varchar(100) NOT NULL,
  Status tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (Sid),
  KEY idx_status (Status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"

# Run setup scripts
cd backend
node scripts/setup-user-table.js
node scripts/populate-sites.js
```

## 🚀 Deployment Methods

### **Method 1: PM2 (Recommended)**

#### **1. Install PM2**
```bash
npm install -g pm2
```

#### **2. Create PM2 Configuration**
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'preart-backend',
    script: 'src/server.js',
    cwd: '/var/www/preart/backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/preart/error.log',
    out_file: '/var/log/preart/out.log',
    log_file: '/var/log/preart/combined.log',
    time: true
  }]
};
```

#### **3. Start Application**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **Method 2: Docker**

#### **1. Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "src/server.js"]
```

#### **2. Create docker-compose.yml**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_NAME=preart_sites_registry
      - DB_USER=preart_user
      - DB_PASSWORD=secure_password
    depends_on:
      - mysql
    volumes:
      - ./uploads:/app/uploads

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=preart_sites_registry
      - MYSQL_USER=preart_user
      - MYSQL_PASSWORD=secure_password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

#### **3. Deploy with Docker**
```bash
docker-compose up -d
```

### **Method 3: Nginx Reverse Proxy**

#### **1. Install Nginx**
```bash
sudo apt update
sudo apt install nginx
```

#### **2. Configure Nginx**
Create `/etc/nginx/sites-available/preart`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Backend Proxy
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Frontend
    location / {
        root /var/www/preart/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # File Uploads
    location /uploads/ {
        alias /var/www/preart/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### **3. Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/preart /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Security Considerations

### **1. Database Security**
- Use strong passwords
- Limit database user privileges
- Enable SSL for database connections
- Regular backups

### **2. Application Security**
- Keep dependencies updated
- Use environment variables for secrets
- Enable rate limiting
- Implement proper CORS
- Use HTTPS in production

### **3. Server Security**
- Keep OS updated
- Configure firewall
- Use fail2ban for intrusion prevention
- Regular security audits

## 📊 Monitoring & Logging

### **1. Application Monitoring**
```bash
# PM2 monitoring
pm2 monit

# Log monitoring
tail -f /var/log/preart/combined.log
```

### **2. Health Checks**
```bash
# Application health
curl https://yourdomain.com/health

# CORS test
curl https://yourdomain.com/api/cors-test
```

## 🔄 Updates & Maintenance

### **1. Application Updates**
```bash
# Pull latest changes
git pull origin master

# Install dependencies
npm install

# Restart application
pm2 restart preart-backend
```

### **2. Database Migrations**
```bash
# Run migration scripts
node scripts/setup-user-table.js
node scripts/populate-sites.js
```

## 🆘 Troubleshooting

### **Common Issues**

| Issue | Solution |
|-------|----------|
| **CORS errors** | Check FRONTEND_URL in .env |
| **Database connection** | Verify DB credentials and host |
| **Port already in use** | Kill existing process or change port |
| **Permission denied** | Check file permissions |
| **SSL errors** | Verify certificate paths |

### **Debug Commands**
```bash
# Check application status
pm2 status

# View logs
pm2 logs preart-backend

# Test database connection
mysql -u preart_user -p -h your_host preart_sites_registry

# Test API endpoints
curl -X GET https://yourdomain.com/api/cors-test
```

## 📞 Support

For deployment issues:
1. Check logs: `/var/log/preart/`
2. Verify environment variables
3. Test database connectivity
4. Check CORS configuration
5. Verify SSL certificates

---

**Remember**: Always test in a staging environment before deploying to production!
