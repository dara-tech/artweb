# PreART Medical Management System - Deployment Checklist

## ✅ Pre-Deployment Checklist

### System Requirements
- [ ] Ubuntu 20.04+ / CentOS 8+ / RHEL 8+
- [ ] Node.js 18+ installed
- [ ] MySQL 8.0+ installed and running
- [ ] Nginx installed
- [ ] PM2 installed globally
- [ ] Minimum 2GB RAM available
- [ ] Minimum 10GB free disk space

### Repository Setup
- [ ] Repository cloned from GitHub
- [ ] Deployment script made executable (`chmod +x deploy.sh`)
- [ ] Deployment script executed successfully
- [ ] All dependencies installed

### Database Setup
- [ ] MySQL server running
- [ ] `preart_sites_registry` database created
- [ ] Database user created with proper permissions
- [ ] User table setup script executed
- [ ] Sites population script executed
- [ ] Role system script executed
- [ ] Database connection tested

### Environment Configuration
- [ ] Backend `.env` file configured with production values
- [ ] Frontend `.env` file configured with production API URL
- [ ] Database credentials updated
- [ ] JWT secret set to a secure value
- [ ] CORS URL updated to production domain

### Application Build
- [ ] Frontend built for production (`npm run build`)
- [ ] Frontend build files exist in `frontend/dist/`
- [ ] Backend dependencies installed
- [ ] PM2 ecosystem file created

### Web Server Configuration
- [ ] Nginx configuration file created
- [ ] Nginx configuration tested (`nginx -t`)
- [ ] Site enabled in Nginx
- [ ] Nginx reloaded successfully

### SSL Certificate (Production)
- [ ] Domain DNS pointing to server
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] HTTPS redirect configured
- [ ] SSL certificate auto-renewal set up

### Application Startup
- [ ] PM2 started successfully
- [ ] Application running on port 3001
- [ ] PM2 configuration saved
- [ ] PM2 startup script configured

### Testing and Verification
- [ ] Frontend accessible via web browser
- [ ] API endpoints responding correctly
- [ ] Database queries working
- [ ] File upload functionality working
- [ ] User authentication working
- [ ] All major features tested

### Security Configuration
- [ ] Firewall configured (ports 80, 443, 22)
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Database user has minimal required permissions
- [ ] File permissions set correctly
- [ ] Sensitive files not accessible via web

### Monitoring and Maintenance
- [ ] Log rotation configured
- [ ] Database backup script created
- [ ] Monitoring tools installed (optional)
- [ ] Alert system configured (optional)
- [ ] Documentation updated with server details

### Final Verification
- [ ] All services running (`systemctl status nginx mysql`)
- [ ] PM2 status shows application running
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] All team members can access the system

## 🚨 Post-Deployment Tasks

### Immediate (Within 24 hours)
- [ ] Test all user roles and permissions
- [ ] Verify data import/export functionality
- [ ] Test reporting features
- [ ] Check mobile responsiveness
- [ ] Verify email notifications (if applicable)

### Short-term (Within 1 week)
- [ ] Set up automated database backups
- [ ] Configure log monitoring
- [ ] Train end users
- [ ] Document any custom configurations
- [ ] Set up performance monitoring

### Long-term (Within 1 month)
- [ ] Review and optimize performance
- [ ] Set up automated security updates
- [ ] Plan for scaling if needed
- [ ] Regular security audits
- [ ] User feedback collection and implementation

## 📋 Emergency Contacts and Procedures

### If Application Goes Down
1. Check PM2 status: `pm2 status`
2. Check logs: `pm2 logs preart-backend`
3. Restart application: `pm2 restart preart-backend`
4. Check system resources: `htop`
5. Check database: `systemctl status mysql`

### If Database Issues
1. Check MySQL status: `systemctl status mysql`
2. Check database connectivity: `mysql -u preart_user -p`
3. Check disk space: `df -h`
4. Restore from backup if needed

### If Web Server Issues
1. Check Nginx status: `systemctl status nginx`
2. Test configuration: `nginx -t`
3. Check logs: `tail -f /var/log/nginx/error.log`
4. Restart Nginx: `systemctl restart nginx`

## 📞 Support Information

- **Server Details**: [Document server IP, domain, credentials]
- **Database Details**: [Document database name, user, password]
- **Backup Location**: [Document backup storage location]
- **Monitoring URLs**: [Document monitoring dashboard URLs]
- **Team Contacts**: [Document team member contact information]

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Server Details**: _______________
**Domain**: _______________

**Signature**: _______________
