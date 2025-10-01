const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testFileNameAPI() {
  try {
    console.log('🧪 Testing file_name field in API endpoints...\n');

    // Test 1: Get all sites from registry
    console.log('1. Testing GET /api/lookups/sites-registry');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/lookups/sites-registry`);
      console.log('✅ Success! Sites with file_name field:');
      console.log('Raw response:', JSON.stringify(response.data, null, 2));
      
      response.data.forEach(site => {
        console.log(`   - ${site.code}: ${site.name} (${site.fileName || 'No file name'})`);
      });
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }

    console.log('\n2. Testing GET /api/site-operations/sites');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/site-operations/sites`);
      console.log('✅ Success! Sites from site-operations:');
      
      response.data.sites.forEach(site => {
        console.log(`   - ${site.code}: ${site.name} (${site.file_name || 'No file name'})`);
      });
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }

    console.log('\n3. Testing GET /api/site-operations/sites/0201');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/site-operations/sites/0201`);
      console.log('✅ Success! Site 0201 details:');
      console.log(`   - Code: ${response.data.site.code}`);
      console.log(`   - Name: ${response.data.site.name}`);
      console.log(`   - File Name: ${response.data.site.file_name || 'No file name'}`);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 File name field API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testFileNameAPI()
    .then(() => {
      console.log('✅ API testing completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ API testing failed:', error);
      process.exit(1);
    });
}

module.exports = { testFileNameAPI };
