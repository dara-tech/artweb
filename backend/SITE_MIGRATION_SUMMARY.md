# Site Database Migration Summary

## What Was Created

### 1. Database Structure
- **Registry Database**: `preart_sites_registry` - Manages site information
- **Site Databases**: Individual databases for each site (preart_0201, preart_0202, etc.)
- **Site Mapping**: 6 sites with their respective databases

### 2. New Files Created

#### Configuration Files
- `src/config/siteDatabase.js` - Site database manager and connection handling
- Updated `src/server.js` - Added site database support

#### Scripts
- `scripts/create-site-databases.js` - Creates databases and imports backup data
- `scripts/run-site-setup.js` - Main setup script with comprehensive process
- `scripts/test-site-setup.js` - Test script to verify setup

#### API Routes
- `src/routes/site-operations.js` - New API endpoints for site-specific operations

#### Documentation
- `SITE_DATABASE_SETUP.md` - Complete setup and usage guide
- `SITE_MIGRATION_SUMMARY.md` - This summary document

### 3. Updated Files
- `package.json` - Added new npm scripts
- `src/server.js` - Integrated site database functionality

## Site Mapping

| Site Code | Site Name | Province | Type | Database Name |
|-----------|-----------|----------|------|---------------|
| 0201 | Maung Russey RH | Battambang | RH | preart_0201 |
| 0202 | Battambang PH | Battambang | PH | preart_0202 |
| 0301 | Kampong Cham PH | Kampong Cham | PH | preart_0301 |
| 0306 | Tbong Khmum RH | Tbong Khmum | RH | preart_0306 |
| 1209 | Phnom Penh RH | Phnom Penh | RH | preart_1209 |
| 1801 | Siem Reap RH | Siem Reap | RH | preart_1801 |

## How to Use

### 1. Run the Setup
```bash
cd artweb/backend
npm run setup-sites
```

### 2. Test the Setup
```bash
npm run test-site-setup
```

### 3. Start the Server
```bash
npm start
```

### 4. Test API Endpoints
```bash
# Get all sites
curl -H "Authorization: Bearer <token>" http://localhost:3001/api/site-operations/sites

# Get site statistics
curl -H "Authorization: Bearer <token>" http://localhost:3001/api/site-operations/sites/0201/stats

# Test site connection
curl -H "Authorization: Bearer <token>" http://localhost:3001/api/site-operations/sites/0201/test
```

## Key Features

### 1. Site Database Manager
- Automatic connection management
- Site registry integration
- Query execution on specific sites
- Connection pooling and caching

### 2. API Endpoints
- `/api/site-operations/sites` - List all sites
- `/api/site-operations/sites/:siteCode` - Get site info
- `/api/site-operations/sites/:siteCode/stats` - Database statistics
- `/api/site-operations/sites/:siteCode/test` - Test connection
- `/api/site-operations/sites/:siteCode/query` - Execute queries

### 3. Backward Compatibility
- Old aggregated database still available
- Both systems can run in parallel
- Gradual migration possible

## Migration Strategy

### Phase 1: Setup and Testing (Current)
- ✅ Create site databases
- ✅ Import backup data
- ✅ Test connections and functionality
- ✅ Create API endpoints

### Phase 2: Frontend Integration
- Update frontend to use site-specific APIs
- Implement site selection in UI
- Modify data fetching to use site-specific endpoints

### Phase 3: Query Migration
- Update indicators to use site-specific databases
- Modify reporting to aggregate from site databases
- Implement site-specific caching

### Phase 4: Full Migration
- Remove dependency on aggregated database
- Optimize site-specific performance
- Implement advanced site management features

## Benefits

1. **Independent Site Management**: Each site has its own database
2. **Better Performance**: Smaller, focused databases
3. **Easier Backup**: Site-specific backup strategies
4. **Scalability**: Sites can be moved to separate servers
5. **Maintenance**: Easier to maintain and update individual sites
6. **Security**: Better data isolation between sites

## Next Steps

1. **Test the Setup**: Run `npm run test-site-setup` to verify everything works
2. **Start the Server**: Run `npm start` and test the API endpoints
3. **Update Frontend**: Modify frontend to use new site-specific APIs
4. **Gradual Migration**: Start migrating queries from aggregated to site-specific
5. **Performance Optimization**: Implement site-specific caching and optimizations

## Troubleshooting

### Common Issues
1. **Database Connection Failed**: Check MySQL credentials and permissions
2. **Import Failed**: Verify backup files exist and are readable
3. **Site Not Found**: Check site registry and database creation

### Getting Help
1. Check the detailed setup guide: `SITE_DATABASE_SETUP.md`
2. Run the test script: `npm run test-site-setup`
3. Check server logs for detailed error messages
4. Verify database connectivity and permissions

## Files to Review

- `SITE_DATABASE_SETUP.md` - Complete setup and usage guide
- `src/config/siteDatabase.js` - Site database manager implementation
- `src/routes/site-operations.js` - API endpoints implementation
- `scripts/create-site-databases.js` - Database creation and import logic

The system is now ready for site-specific database operations while maintaining backward compatibility with the existing aggregated approach.
