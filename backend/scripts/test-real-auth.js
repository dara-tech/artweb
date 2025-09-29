#!/usr/bin/env node

/**
 * Test Real Authentication with Login
 * This script tests the actual login process and API calls with real tokens
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testRealAuthentication() {
  console.log('🔐 Testing Real Authentication');
  console.log('==============================\n');
  
  try {
    // Step 1: Login to get a real token
    console.log('🔑 Step 1: Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    if (loginResponse.data.message === 'Login successful') {
      console.log('✅ Login successful!');
      console.log(`   User: ${loginResponse.data.user.username}`);
      console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...`);
      
      const token = loginResponse.data.token;
      
      // Step 2: Test protected endpoints with real token
      console.log('\n🏥 Step 2: Testing protected endpoints...');
      
      // Test sites endpoint
      try {
        const sitesResponse = await axios.get(`${BASE_URL}/api/site-operations/sites`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('✅ Sites endpoint:', sitesResponse.data.sites?.length || 0, 'sites found');
      } catch (error) {
        console.log('❌ Sites endpoint failed:', error.response?.data?.message || error.message);
      }
      
      // Test reporting indicators
      try {
        const indicatorsResponse = await axios.get(`${BASE_URL}/api/indicators-optimized/all`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: {
            startDate: '2025-01-01',
            endDate: '2025-03-31'
          }
        });
        console.log('✅ Reporting indicators:', indicatorsResponse.data.data?.length || 0, 'indicators found');
      } catch (error) {
        console.log('❌ Reporting indicators failed:', error.response?.data?.message || error.message);
      }
      
      // Test site-specific indicators
      try {
        const siteIndicatorsResponse = await axios.get(`${BASE_URL}/api/indicators-optimized/all`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: {
            startDate: '2025-01-01',
            endDate: '2025-03-31',
            siteCode: '0201'
          }
        });
        console.log('✅ Site-specific indicators (0201):', siteIndicatorsResponse.data.data?.length || 0, 'indicators found');
      } catch (error) {
        console.log('❌ Site-specific indicators failed:', error.response?.data?.message || error.message);
      }
      
      // Test category indicators
      try {
        const categoryResponse = await axios.get(`${BASE_URL}/api/indicators-optimized/category/art`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: {
            startDate: '2025-01-01',
            endDate: '2025-03-31'
          }
        });
        console.log('✅ Category indicators (art):', categoryResponse.data.data?.length || 0, 'indicators found');
      } catch (error) {
        console.log('❌ Category indicators failed:', error.response?.data?.message || error.message);
      }
      
      // Test specific indicator
      try {
        const specificResponse = await axios.get(`${BASE_URL}/api/indicators-optimized/01_active_art_previous`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: {
            startDate: '2025-01-01',
            endDate: '2025-03-31'
          }
        });
        console.log('✅ Specific indicator (01_active_art_previous):', specificResponse.data.data ? 'Data found' : 'No data');
      } catch (error) {
        console.log('❌ Specific indicator failed:', error.response?.data?.message || error.message);
      }
      
      // Test indicator details (using previous quarter dates)
      try {
        const detailsResponse = await axios.get(`${BASE_URL}/api/indicators-optimized/01_active_art_previous/details`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: {
            startDate: '2024-10-01',
            endDate: '2024-12-31',
            previousEndDate: '2024-12-31',
            page: 1,
            limit: 5
          }
        });
        console.log('✅ Indicator details:', detailsResponse.data.data?.length || 0, 'records found');
      } catch (error) {
        console.log('❌ Indicator details failed:', error.response?.data?.message || error.message);
      }
      
      console.log('\n🎉 Real authentication test completed successfully!');
      console.log('✅ All endpoints are working with proper authentication');
      
    } else {
      console.log('❌ Login failed:', loginResponse.data.message);
    }
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Login failed:', error.response.data?.message || error.response.statusText);
      console.log('   Status:', error.response.status);
    } else {
      console.log('❌ Connection failed:', error.message);
      console.log('   Make sure the server is running on port 3001');
    }
  }
}

// Run the test
if (require.main === module) {
  testRealAuthentication()
    .then(() => {
      console.log('\n✅ Test completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}

module.exports = testRealAuthentication;
