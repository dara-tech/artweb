# Production Environment Configuration Guide

## 🌐 **WebSocket URL Configuration**

### **Development (Current)**
```env
# .env.development
VITE_WS_URL=http://localhost:3001
VITE_API_URL=http://localhost:3001/apiv1
```

### **Production Scenarios**

#### **1. Same Domain (Recommended)**
```env
# .env.production
VITE_WS_URL=https://your-domain.com
VITE_API_URL=https://your-domain.com/apiv1
```

#### **2. Different Subdomain**
```env
# .env.production
VITE_WS_URL=https://api.your-domain.com
VITE_API_URL=https://api.your-domain.com/apiv1
```

#### **3. Different Port**
```env
# .env.production
VITE_WS_URL=https://your-domain.com:3001
VITE_API_URL=https://your-domain.com:3001/apiv1
```

#### **4. Load Balancer/Proxy**
```env
# .env.production
VITE_WS_URL=https://your-domain.com/ws
VITE_API_URL=https://your-domain.com/apiv1
```

## 🔧 **Backend WebSocket Configuration**

### **Socket.IO Server Setup**
```javascript
// backend/src/server.js
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});
```

### **Production Environment Variables**
```env
# backend/.env.production
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com
DB_HOST=your-production-db-host
DB_USER=your-production-user
DB_PASSWORD=your-secure-password
DB_NAME=preart_sites_registry
JWT_SECRET=your-super-secure-jwt-secret
```

## 🚀 **Deployment Examples**

### **1. Nginx Reverse Proxy**
```nginx
# /etc/nginx/sites-available/artweb
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /var/www/html/artweb;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /apiv1/ {
        proxy_pass http://localhost:3001/apiv1/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:3001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **2. Apache Reverse Proxy**
```apache
# /etc/apache2/sites-available/artweb.conf
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html/artweb
    
    # Frontend
    <Directory /var/www/html/artweb>
        AllowOverride All
        Require all granted
    </Directory>
    
    # Backend API
    ProxyPreserveHost On
    ProxyPass /apiv1/ http://localhost:3001/apiv1/
    ProxyPassReverse /apiv1/ http://localhost:3001/apiv1/
    
    # WebSocket
    ProxyPass /socket.io/ ws://localhost:3001/socket.io/
    ProxyPassReverse /socket.io/ ws://localhost:3001/socket.io/
</VirtualHost>
```

### **3. Docker Compose**
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_WS_URL=https://your-domain.com
      - VITE_API_URL=https://your-domain.com/apiv1
  
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - FRONTEND_URL=https://your-domain.com
      - DB_HOST=mysql
      - DB_USER=artweb
      - DB_PASSWORD=secure_password
      - DB_NAME=preart_sites_registry
  
  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=preart_sites_registry
      - MYSQL_USER=artweb
      - MYSQL_PASSWORD=secure_password
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## 🔒 **SSL/HTTPS Configuration**

### **Let's Encrypt with Certbot**
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Manual SSL Configuration**
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Rest of configuration...
}
```

## 📊 **Production Monitoring**

### **PM2 Process Manager**
```bash
# Install PM2
npm install -g pm2

# Start backend
pm2 start src/server.js --name artweb-backend

# Save PM2 configuration
pm2 save
pm2 startup

# Monitor
pm2 monit
pm2 logs artweb-backend
```

### **Health Check Endpoint**
```javascript
// backend/src/routes/health.js
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

## 🚨 **Troubleshooting**

### **Common WebSocket Issues**

1. **Connection Refused**
   - Check if backend is running
   - Verify firewall settings
   - Check proxy configuration

2. **CORS Errors**
   - Update CORS origin in backend
   - Check frontend URL configuration

3. **SSL Certificate Issues**
   - Ensure valid SSL certificate
   - Check certificate chain
   - Verify domain name matches

4. **Proxy Configuration**
   - WebSocket headers must be forwarded
   - Connection upgrade must be enabled
   - Timeout settings may need adjustment

### **Debug Commands**
```bash
# Check if backend is running
curl -I https://your-domain.com/apiv1/health

# Test WebSocket connection
wscat -c wss://your-domain.com/socket.io/

# Check SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

## 📝 **Environment File Templates**

### **Frontend (.env.production)**
```env
VITE_API_URL=https://your-domain.com/apiv1
VITE_WS_URL=https://your-domain.com
VITE_APP_NAME=ArtWeb
VITE_APP_VERSION=1.0.0
```

### **Backend (.env.production)**
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com
DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=preart_sites_registry
JWT_SECRET=your-super-secure-jwt-secret
CORS_ORIGIN=https://your-domain.com
```

---

**Remember**: Always test WebSocket connections in production before going live!
