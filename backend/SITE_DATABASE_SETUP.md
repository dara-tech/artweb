# Site Database Setup Guide

This guide explains how to set up separate databases for each site instead of using an aggregated database approach.

## Overview

The new system creates individual databases for each site, allowing for:
- Independent site data management
- Better performance and scalability
- Easier backup and maintenance
- Site-specific configurations

## Database Structure

### Registry Database
- **Name**: `preart_sites_registry`
- **Purpose**: Manages site information and database mappings
- **Tables**: `sites` (contains site metadata)

### Site Databases
Each site has its own database:
- **preart_0201**: Maung Russey RH (Battambang)
- **preart_0202**: Battambang PH (Battambang)  
- **preart_0301**: Kampong Cham PH (Kampong Cham)
- **preart_0306**: Tbong Khmum RH (Tbong Khmum)
- **preart_1209**: Phnom Penh RH (Phnom Penh)
- **preart_1801**: Siem Reap RH (Siem Reap)

## Setup Instructions

### 1. Prerequisites

Ensure you have:
- MySQL/MariaDB server running
- Node.js and npm installed
- Backup files in the `backups/` directory
- Proper database credentials in `.env` file

### 2. Environment Configuration

Update your `.env` file with database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 3. Run the Setup Script

Execute the site database setup:

```bash
# Navigate to backend directory
cd artweb/backend

# Run the complete setup
npm run setup-sites

# Or run just the database creation
npm run create-site-databases
```

### 4. Verify Setup

Check that all databases were created successfully:

```bash
# Connect to MySQL
mysql -u your_username -p

# List databases
SHOW DATABASES;

# Check site registry
USE preart_sites_registry;
SELECT * FROM sites;
```

## API Endpoints

### Site Operations

#### Get All Sites
```http
GET /api/site-operations/sites
Authorization: Bearer <token>
```

#### Get Site Information
```http
GET /api/site-operations/sites/:siteCode
Authorization: Bearer <token>
```

#### Get Site Database Statistics
```http
GET /api/site-operations/sites/:siteCode/stats
Authorization: Bearer <token>
```

#### Test Site Database Connection
```http
GET /api/site-operations/sites/:siteCode/test
Authorization: Bearer <token>
```

#### Execute Query on Site Database
```http
POST /api/site-operations/sites/:siteCode/query
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "SELECT COUNT(*) as count FROM tblaimain",
  "replacements": []
}
```

## Usage Examples

### JavaScript/Node.js

```javascript
const { siteDatabaseManager } = require('./src/config/siteDatabase');

// Get all sites
const sites = await siteDatabaseManager.getAllSites();

// Get specific site info
const siteInfo = await siteDatabaseManager.getSiteInfo('0201');

// Execute query on specific site
const results = await siteDatabaseManager.executeSiteQuery('0201', 
  'SELECT * FROM tblaimain LIMIT 10'
);

// Get site connection
const connection = await siteDatabaseManager.getSiteConnection('0201');
```

### Frontend Integration

```javascript
// Fetch all sites
const response = await fetch('/api/site-operations/sites', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { sites } = await response.json();

// Get site statistics
const statsResponse = await fetch('/api/site-operations/sites/0201/stats', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { stats } = await statsResponse.json();
```

## Migration Strategy

### Phase 1: Parallel Operation
- Keep both aggregated and site-specific databases running
- Gradually migrate queries to use site-specific databases
- Test functionality with both systems

### Phase 2: Gradual Migration
- Update indicators to use site-specific databases
- Modify frontend to work with site-specific data
- Update reporting to aggregate from site databases

### Phase 3: Full Migration
- Remove dependency on aggregated database
- Optimize site-specific queries
- Implement site-specific caching and performance optimizations

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL server is running
   - Verify credentials in `.env` file
   - Ensure user has proper permissions

2. **Import Failed**
   - Check backup file exists and is readable
   - Verify MySQL user has CREATE and INSERT permissions
   - Check available disk space

3. **Site Not Found**
   - Verify site code exists in registry
   - Check site status is active (status = 1)
   - Ensure database was created successfully

### Logs and Debugging

Enable detailed logging by setting:
```env
NODE_ENV=development
```

Check server logs for detailed error messages and connection status.

## Maintenance

### Backup Strategy
- Each site database can be backed up independently
- Use `mysqldump` for individual site backups
- Implement automated backup scheduling per site

### Performance Monitoring
- Monitor connection pool usage
- Track query performance per site
- Implement site-specific caching strategies

### Scaling
- Each site database can be moved to separate servers
- Implement read replicas for high-traffic sites
- Use database sharding for very large sites

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs for error details
3. Verify database connectivity and permissions
4. Test with individual site connections

## Security Considerations

- Each site database is isolated
- Implement proper access controls per site
- Use encrypted connections for production
- Regular security audits and updates
