// Test script for Lab API integration
const axios = require('axios');

const LAB_API_CONFIG = {
  baseUrl: 'http://36.37.175.123:9091',
  username: 'mpi.sys',
  password: 'fT.!ga~Ndc8z@EM>7X4B2=F9?'
};

async function testLabApiConnection() {
  try {
    console.log('🧪 Testing Lab API Connection...');
    console.log(`URL: ${LAB_API_CONFIG.baseUrl}/test_result`);
    console.log(`Username: ${LAB_API_CONFIG.username}`);
    
    // Create basic auth header
    const auth = Buffer.from(`${LAB_API_CONFIG.username}:${LAB_API_CONFIG.password}`).toString('base64');
    
    const response = await axios.get(`${LAB_API_CONFIG.baseUrl}/test_result`, {
      params: {
        start: '20250602000000',
        end: '20250602235959',
        type: 'hiv',
        site_code: '2101'
      },
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ Lab API Connection Successful!');
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Lab API Connection Failed!');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    }
  }
}

// Test our backend API
async function testBackendAPI() {
  try {
    console.log('\n🔧 Testing Backend API...');
    
    const response = await axios.get('http://localhost:3001/health');
    console.log('✅ Backend API is running');
    console.log('Health Check Response:', response.data);
    
  } catch (error) {
    console.error('❌ Backend API is not running');
    console.error('Error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Lab API Integration Tests\n');
  
  await testBackendAPI();
  await testLabApiConnection();
  
  console.log('\n✨ Tests completed!');
}

runTests();

