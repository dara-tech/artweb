#!/usr/bin/env node

const axios = require('axios');
const { performance } = require('perf_hooks');

// Configuration
const BASE_URL = 'http://localhost:3001/api';
const TEST_PARAMS = {
  startDate: '2025-01-01',
  endDate: '2025-03-31',
  previousEndDate: '2024-12-31'
};

// Test functions
async function testOriginalIndicators() {
  console.log('🔍 Testing Original Indicators API...');
  const startTime = performance.now();
  
  try {
    const response = await axios.get(`${BASE_URL}/indicators/all`, {
      params: TEST_PARAMS,
      timeout: 30000
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Original API completed in ${duration.toFixed(2)}ms`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Data count: ${response.data.data?.length || 0}`);
    
    return {
      success: true,
      duration,
      dataCount: response.data.data?.length || 0,
      status: response.status
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`❌ Original API failed in ${duration.toFixed(2)}ms`);
    console.log(`   Error: ${error.message}`);
    
    return {
      success: false,
      duration,
      error: error.message
    };
  }
}

async function testOptimizedIndicators() {
  console.log('⚡ Testing Optimized Indicators API...');
  const startTime = performance.now();
  
  try {
    const response = await axios.get(`${BASE_URL}/indicators-optimized/all`, {
      params: TEST_PARAMS,
      timeout: 30000
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Optimized API completed in ${duration.toFixed(2)}ms`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Data count: ${response.data.data?.length || 0}`);
    console.log(`   Performance: ${JSON.stringify(response.data.performance, null, 2)}`);
    
    return {
      success: true,
      duration,
      dataCount: response.data.data?.length || 0,
      status: response.status,
      performance: response.data.performance
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`❌ Optimized API failed in ${duration.toFixed(2)}ms`);
    console.log(`   Error: ${error.message}`);
    
    return {
      success: false,
      duration,
      error: error.message
    };
  }
}

async function testCachedIndicators() {
  console.log('📦 Testing Cached Indicators API...');
  const startTime = performance.now();
  
  try {
    const response = await axios.get(`${BASE_URL}/indicators-optimized/all`, {
      params: TEST_PARAMS,
      timeout: 30000
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Cached API completed in ${duration.toFixed(2)}ms`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Data count: ${response.data.data?.length || 0}`);
    console.log(`   Performance: ${JSON.stringify(response.data.performance, null, 2)}`);
    
    return {
      success: true,
      duration,
      dataCount: response.data.data?.length || 0,
      status: response.status,
      performance: response.data.performance
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`❌ Cached API failed in ${duration.toFixed(2)}ms`);
    console.log(`   Error: ${error.message}`);
    
    return {
      success: false,
      duration,
      error: error.message
    };
  }
}

async function testPerformanceComparison() {
  console.log('🔬 Testing Performance Comparison...');
  const startTime = performance.now();
  
  try {
    const response = await axios.get(`${BASE_URL}/indicators-optimized/compare/performance`, {
      params: TEST_PARAMS,
      timeout: 30000
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Performance comparison completed in ${duration.toFixed(2)}ms`);
    console.log(`   Comparison results:`);
    console.log(JSON.stringify(response.data.comparison, null, 2));
    
    return {
      success: true,
      duration,
      comparison: response.data.comparison
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`❌ Performance comparison failed in ${duration.toFixed(2)}ms`);
    console.log(`   Error: ${error.message}`);
    
    return {
      success: false,
      duration,
      error: error.message
    };
  }
}

// Main test function
async function runPerformanceTest() {
  console.log('🚀 Starting Performance Test Suite');
  console.log('=====================================');
  console.log(`Test Parameters: ${JSON.stringify(TEST_PARAMS, null, 2)}`);
  console.log('');

  const results = {};

  // Test 1: Original API
  console.log('Test 1: Original Indicators API');
  console.log('--------------------------------');
  results.original = await testOriginalIndicators();
  console.log('');

  // Test 2: Optimized API (first run - no cache)
  console.log('Test 2: Optimized Indicators API (No Cache)');
  console.log('--------------------------------------------');
  results.optimized = await testOptimizedIndicators();
  console.log('');

  // Test 3: Optimized API (second run - with cache)
  console.log('Test 3: Optimized Indicators API (With Cache)');
  console.log('----------------------------------------------');
  results.cached = await testCachedIndicators();
  console.log('');

  // Test 4: Performance Comparison
  console.log('Test 4: Performance Comparison');
  console.log('-------------------------------');
  results.comparison = await testPerformanceComparison();
  console.log('');

  // Summary
  console.log('📊 Performance Test Summary');
  console.log('============================');
  
  if (results.original.success && results.optimized.success) {
    const improvement = ((results.original.duration - results.optimized.duration) / results.original.duration * 100).toFixed(2);
    console.log(`Original API:     ${results.original.duration.toFixed(2)}ms`);
    console.log(`Optimized API:    ${results.optimized.duration.toFixed(2)}ms`);
    console.log(`Improvement:      ${improvement}% faster`);
  }

  if (results.optimized.success && results.cached.success) {
    const cacheImprovement = ((results.optimized.duration - results.cached.duration) / results.optimized.duration * 100).toFixed(2);
    console.log(`Cached API:       ${results.cached.duration.toFixed(2)}ms`);
    console.log(`Cache Improvement: ${cacheImprovement}% faster`);
  }

  if (results.comparison.success) {
    console.log(`\n🔬 Detailed Comparison:`);
    console.log(`Optimized: ${results.comparison.comparison.optimized.executionTime.toFixed(2)}ms`);
    console.log(`Cached:    ${results.comparison.comparison.cached.executionTime.toFixed(2)}ms`);
    console.log(`Time Saved: ${results.comparison.comparison.improvement.timeSaved.toFixed(2)}ms`);
    console.log(`Improvement: ${results.comparison.comparison.improvement.percentageImprovement}%`);
  }

  console.log('\n✅ Performance test completed!');
}

// Run the test
if (require.main === module) {
  runPerformanceTest().catch(console.error);
}

module.exports = {
  testOriginalIndicators,
  testOptimizedIndicators,
  testCachedIndicators,
  testPerformanceComparison,
  runPerformanceTest
};
