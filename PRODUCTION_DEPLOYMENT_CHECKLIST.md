# Production Deployment Checklist for ArtWeb

## 🚀 Pre-Deployment Checklist

### ✅ **Backend Testing**
- [ ] All API endpoints responding correctly
- [ ] Database connections stable
- [ ] Site database manager working
- [ ] Analytics engine functional
- [ ] WebSocket connections working
- [ ] Authentication system secure
- [ ] Error handling robust

### ✅ **Database Testing**
- [ ] All indicator queries validated
- [ ] Database performance optimized
- [ ] Indexes created (if needed)
- [ ] Connection pooling configured
- [ ] Backup procedures tested
- [ ] Migration scripts ready

### ✅ **Frontend Testing**
- [ ] Build process successful
- [ ] All components rendering
- [ ] API integration working
- [ ] Real-time features functional
- [ ] Responsive design tested
- [ ] Browser compatibility verified

### ✅ **Security Testing**
- [ ] No hardcoded credentials
- [ ] Environment variables secure
- [ ] API endpoints protected
- [ ] CORS configured correctly
- [ ] Input validation in place
- [ ] SQL injection prevention

### ✅ **Performance Testing**
- [ ] API response times < 2 seconds
- [ ] Database queries optimized
- [ ] Frontend load times acceptable
- [ ] Memory usage within limits
- [ ] Connection pool healthy
- [ ] Caching strategies implemented

### ✅ **Configuration Testing**
- [ ] Production environment variables set
- [ ] Database credentials secure
- [ ] Server resources adequate
- [ ] Logging configured
- [ ] Monitoring in place
- [ ] Error tracking enabled

## 🔧 **Deployment Steps**

### 1. **Backend Deployment**
```bash
# Stop current server
pm2 stop artweb-backend

# Backup current version
cp -r /var/www/artweb/backend /var/www/artweb/backend.backup.$(date +%Y%m%d_%H%M%S)

# Deploy new version
git pull origin master
npm ci --production

# Run database migrations (if any)
npm run migrate

# Start server
pm2 start src/server.js --name artweb-backend
pm2 save
```

### 2. **Frontend Deployment**
```bash
# Build frontend
cd frontend
npm ci
npm run build

# Deploy to web server
cp -r dist/* /var/www/html/artweb/
```

### 3. **Database Optimization** (if needed)
```bash
# Run safe optimization during maintenance window
./scripts/test-production.sh
```

## 📊 **Post-Deployment Verification**

### ✅ **Health Checks**
- [ ] Backend server responding
- [ ] Frontend loading correctly
- [ ] Database queries working
- [ ] Analytics engine running
- [ ] Real-time features active
- [ ] All API endpoints accessible

### ✅ **Monitoring**
- [ ] Server resources normal
- [ ] Database performance good
- [ ] Error logs clean
- [ ] User access successful
- [ ] Response times acceptable
- [ ] Memory usage stable

## 🚨 **Rollback Plan**

If issues occur:
1. **Stop new server**: `pm2 stop artweb-backend`
2. **Restore backup**: `cp -r /var/www/artweb/backend.backup.* /var/www/artweb/backend`
3. **Start old version**: `pm2 start artweb-backend`
4. **Investigate issues**: Check logs and fix problems
5. **Re-test**: Run test suite again before re-deployment

## 📝 **Production Environment Variables**

Required `.env` file for production:
```env
# Database Configuration
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USER=your-production-user
DB_PASSWORD=your-secure-password
DB_NAME=preart_sites_registry

# Server Configuration
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secure-jwt-secret

# Frontend Configuration
VITE_API_URL=https://your-domain.com/apiv1
VITE_WS_URL=https://your-domain.com

# Security
CORS_ORIGIN=https://your-domain.com
SESSION_SECRET=your-session-secret
```

## 🔍 **Monitoring Commands**

```bash
# Check server status
pm2 status

# Check logs
pm2 logs artweb-backend

# Monitor resources
pm2 monit

# Check database connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Test API endpoints
curl -I https://your-domain.com/apiv1/sites
```

## 📞 **Emergency Contacts**

- **System Administrator**: [Contact Info]
- **Database Administrator**: [Contact Info]
- **Development Team**: [Contact Info]

---

**Remember**: Always test in staging environment first!
