# Analytics Engine Guide

## Overview

The Analytics Engine is a comprehensive solution for pre-calculating and storing HIV indicator values to enable fast, frequent reporting. Instead of calculating indicators on-demand (which can take 5-10 seconds), the analytics engine pre-calculates and stores these values, allowing for sub-second response times.

## Architecture

### Components

1. **AnalyticsIndicator Model** - Database model for storing pre-calculated values
2. **AnalyticsEngine Service** - Core calculation and storage logic
3. **Scheduler Service** - Automated periodic calculations
4. **Analytics API** - REST endpoints for data access
5. **Analytics Dashboard** - Frontend monitoring interface

### Database Schema

```sql
CREATE TABLE analytics_indicators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  indicator_id VARCHAR(50) NOT NULL,
  indicator_name VARCHAR(255) NOT NULL,
  site_code VARCHAR(20) NOT NULL,
  site_name VARCHAR(255) NOT NULL,
  period_type ENUM('quarterly', 'monthly', 'yearly') NOT NULL,
  period_year INT NOT NULL,
  period_quarter INT NULL,
  period_month INT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  previous_end_date DATE NULL,
  total INT NOT NULL DEFAULT 0,
  male_0_14 INT NOT NULL DEFAULT 0,
  female_0_14 INT NOT NULL DEFAULT 0,
  male_over_14 INT NOT NULL DEFAULT 0,
  female_over_14 INT NOT NULL DEFAULT 0,
  calculation_status ENUM('pending', 'calculating', 'completed', 'failed'),
  calculation_started_at DATETIME NULL,
  calculation_completed_at DATETIME NULL,
  calculation_duration_ms INT NULL,
  error_message TEXT NULL,
  last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Features

### 1. Pre-calculation Storage
- Stores indicator values by period (quarterly, monthly, yearly)
- Tracks calculation status and performance metrics
- Maintains data freshness and versioning

### 2. Automated Scheduling
- **Quarterly calculations**: 1st day of each quarter at 2 AM
- **Monthly calculations**: 1st day of each month at 3 AM
- **Health checks**: Every 6 hours
- **Cleanup**: Every Sunday at 4 AM

### 3. Fast Data Retrieval
- Sub-second response times for pre-calculated data
- Intelligent caching and fallback mechanisms
- Batch processing for multiple indicators

### 4. Monitoring & Health
- Real-time dashboard for system status
- Performance metrics and error tracking
- Automated health checks and alerts

## API Endpoints

### Analytics Summary
```http
GET /apiv1/analytics/summary
```
Returns system status, record counts, and success rates.

### Get Analytics Data
```http
GET /apiv1/analytics/data?indicatorId=1&siteCode=2101&periodYear=2025&periodQuarter=2
```
Retrieves pre-calculated indicator data with filters.

### Calculate Indicator
```http
POST /apiv1/analytics/calculate
Content-Type: application/json

{
  "indicatorId": "1",
  "siteCode": "2101",
  "period": {
    "periodType": "quarterly",
    "periodYear": 2025,
    "periodQuarter": 2,
    "startDate": "2025-04-01",
    "endDate": "2025-06-30",
    "previousEndDate": "2025-03-31"
  },
  "options": {
    "forceRefresh": false
  }
}
```

### Fast Indicators (Fallback)
```http
GET /apiv1/analytics/indicators/fast?indicatorId=1&siteCode=2101&periodYear=2025&periodQuarter=2
```
Returns pre-calculated data instantly, falls back to regular calculation if not available.

### Health Check
```http
GET /apiv1/analytics/health
```
Returns system health status and performance metrics.

## Usage Examples

### 1. Calculate Single Indicator
```javascript
const response = await fetch('/apiv1/analytics/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    indicatorId: '10.6',
    siteCode: '2101',
    period: {
      periodType: 'quarterly',
      periodYear: 2025,
      periodQuarter: 2,
      startDate: '2025-04-01',
      endDate: '2025-06-30',
      previousEndDate: '2025-03-31'
    }
  })
});
```

### 2. Batch Calculate Multiple Indicators
```javascript
const response = await fetch('/apiv1/analytics/batch-calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    requests: [
      { indicatorId: '1', siteCode: '2101', period: period1 },
      { indicatorId: '10.6', siteCode: '2101', period: period1 },
      { indicatorId: '1', siteCode: '2102', period: period1 }
    ]
  })
});
```

### 3. Get Fast Indicators
```javascript
const response = await fetch('/apiv1/analytics/indicators/fast?indicatorId=1&siteCode=2101&periodYear=2025&periodQuarter=2');
const data = await response.json();

if (data.success) {
  console.log('Fast data:', data.data);
} else {
  // Fallback to regular calculation
  console.log('No analytics data, use regular endpoint');
}
```

## Performance Benefits

### Before Analytics Engine
- **Response Time**: 5-10 seconds per indicator
- **Database Load**: High (complex queries on every request)
- **Scalability**: Limited by query complexity
- **User Experience**: Slow, frequent timeouts

### After Analytics Engine
- **Response Time**: <100ms for pre-calculated data
- **Database Load**: Low (simple lookups)
- **Scalability**: High (can handle many concurrent users)
- **User Experience**: Fast, responsive interface

## Configuration

### Environment Variables
```bash
# Analytics Engine Settings
ANALYTICS_ENABLED=true
ANALYTICS_CACHE_TTL=86400  # 24 hours in seconds
ANALYTICS_CLEANUP_DAYS=730  # Keep 2 years of data
ANALYTICS_BATCH_SIZE=100   # Batch calculation size
```

### Scheduler Configuration
The scheduler runs automatically when the server starts. To modify schedules, edit `src/services/scheduler.js`:

```javascript
// Quarterly calculations - 1st day of each quarter at 2 AM
'0 2 1 1,4,7,10 *'

// Monthly calculations - 1st day of each month at 3 AM  
'0 3 1 * *'

// Health checks - every 6 hours
'0 */6 * * *'

// Cleanup - every Sunday at 4 AM
'0 4 * * 0'
```

## Monitoring

### Dashboard Access
Navigate to the Analytics Dashboard in the frontend to monitor:
- System health and status
- Calculation success rates
- Performance metrics
- Data freshness

### Health Monitoring
```bash
# Check analytics health
curl http://localhost:3001/apiv1/analytics/health

# Get system summary
curl http://localhost:3001/apiv1/analytics/summary
```

## Troubleshooting

### Common Issues

1. **Calculations Failing**
   - Check database connectivity
   - Verify site database configurations
   - Review error messages in analytics_indicators table

2. **Slow Performance**
   - Check if analytics data exists for requested period
   - Verify database indexes are created
   - Monitor calculation queue status

3. **Data Not Updating**
   - Check scheduler status
   - Verify cron jobs are running
   - Force refresh calculations if needed

### Debug Commands

```bash
# Check calculation status
mysql -u root -p -e "SELECT indicator_id, site_code, calculation_status, error_message FROM preart_sites_registry.analytics_indicators ORDER BY last_updated DESC LIMIT 10;"

# Check scheduler status
curl http://localhost:3001/apiv1/analytics/health

# Force calculation
curl -X POST http://localhost:3001/apiv1/analytics/calculate -H "Content-Type: application/json" -d '{"indicatorId":"1","siteCode":"2101","period":{"periodType":"quarterly","periodYear":2025,"periodQuarter":2,"startDate":"2025-04-01","endDate":"2025-06-30","previousEndDate":"2025-03-31"}}'
```

## Future Enhancements

1. **Real-time Updates**: WebSocket notifications for calculation completion
2. **Advanced Caching**: Redis integration for even faster access
3. **Data Export**: Bulk export of analytics data
4. **Custom Periods**: Support for custom date ranges
5. **Performance Analytics**: Detailed performance metrics and optimization
6. **Auto-scaling**: Dynamic resource allocation based on load

## Migration Guide

### From Regular Calculations to Analytics

1. **Deploy Analytics Engine**: Deploy the new analytics components
2. **Run Initial Calculations**: Calculate indicators for current and previous periods
3. **Update Frontend**: Modify frontend to use analytics endpoints
4. **Monitor Performance**: Use dashboard to monitor system health
5. **Gradual Migration**: Gradually move more indicators to analytics

### Rollback Plan

If issues arise, the system can fall back to regular calculations:
1. Disable analytics scheduler
2. Update frontend to use regular endpoints
3. Keep analytics data for future use
4. Debug and fix issues before re-enabling

## Support

For technical support or questions about the Analytics Engine:
1. Check the analytics dashboard for system status
2. Review server logs for error messages
3. Use the health check endpoints for diagnostics
4. Consult this documentation for configuration options
