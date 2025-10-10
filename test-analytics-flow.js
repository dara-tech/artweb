#!/usr/bin/env node

const axios = require('axios');

async function testAnalyticsFlow() {
  console.log('🧪 Testing Analytics Flow...\n');
  
  try {
    // Test 1: Check analytics summary
    console.log('1️⃣ Testing analytics summary...');
    const summaryResponse = await axios.get('http://localhost:3001/apiv1/analytics/summary');
    console.log('✅ Analytics summary:', summaryResponse.data);
    
    // Test 2: Check indicators API with analytics
    console.log('\n2️⃣ Testing indicators API with analytics...');
    const indicatorsResponse = await axios.get('http://localhost:3001/apiv1/indicators-optimized/all', {
      params: {
        startDate: '2025-04-01',
        endDate: '2025-06-30',
        siteCode: '2101'
      }
    });
    
    console.log('✅ Indicators response:');
    console.log('  - Success:', indicatorsResponse.data.success);
    console.log('  - Analytics Data:', indicatorsResponse.data.analyticsData);
    console.log('  - Data Count:', indicatorsResponse.data.data?.length);
    console.log('  - First Indicator:', indicatorsResponse.data.data?.[0]);
    
    // Test 3: Check "All Sites" data
    console.log('\n3️⃣ Testing "All Sites" data...');
    const allSitesResponse = await axios.get('http://localhost:3001/apiv1/indicators-optimized/all', {
      params: {
        startDate: '2025-04-01',
        endDate: '2025-06-30'
        // No siteCode = All Sites
      }
    });
    
    console.log('✅ All Sites response:');
    console.log('  - Success:', allSitesResponse.data.success);
    console.log('  - Analytics Data:', allSitesResponse.data.analyticsData);
    console.log('  - Data Count:', allSitesResponse.data.data?.length);
    console.log('  - First Indicator:', allSitesResponse.data.data?.[0]);
    
    // Test 4: Check if data is actually from analytics
    console.log('\n4️⃣ Verifying analytics data source...');
    if (indicatorsResponse.data.analyticsData) {
      console.log('✅ Data is coming from analytics engine');
      console.log('  - Calculated At:', indicatorsResponse.data.calculatedAt);
    } else {
      console.log('❌ Data is NOT coming from analytics engine');
    }
    
    console.log('\n🎉 Analytics flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testAnalyticsFlow();
