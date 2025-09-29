import api from './api'

export const reportingApi = {
  // Get all indicators (site-specific or all sites combined)
  getAllIndicators: async (params = {}) => {
    const { siteCode, startDate, endDate, previousEndDate, useCache = true } = params
    const queryParams = {
      startDate,
      endDate,
      previousEndDate,
      useCache
    }
    
    if (siteCode) {
      queryParams.siteCode = siteCode
    }
    
    const response = await api.get('/api/indicators-optimized/all', { params: queryParams })
    return response.data
  },

  // Get indicators by category
  getIndicatorsByCategory: async (category, params = {}) => {
    const { siteCode, startDate, endDate, previousEndDate, useCache = true } = params
    const queryParams = {
      startDate,
      endDate,
      previousEndDate,
      useCache
    }
    
    if (siteCode) {
      queryParams.siteCode = siteCode
    }
    
    const response = await api.get(`/api/indicators-optimized/category/${category}`, { params: queryParams })
    return response.data
  },

  // Get specific indicator
  getIndicator: async (indicatorId, params = {}) => {
    const { siteCode, startDate, endDate, previousEndDate, useCache = true } = params
    const queryParams = {
      startDate,
      endDate,
      previousEndDate,
      useCache
    }
    
    if (siteCode) {
      queryParams.siteCode = siteCode
    }
    
    const response = await api.get(`/api/indicators-optimized/${indicatorId}`, { params: queryParams })
    return response.data
  },

  // Get indicator details with pagination and filtering
  getIndicatorDetails: async (indicatorId, params = {}) => {
    const { 
      siteCode, 
      startDate, 
      endDate, 
      previousEndDate, 
      page = 1, 
      limit = 50,
      search = '',
      searchTerm = '',
      ageGroup = '',
      gender = '',
      useCache = true 
    } = params
    
    // Use search if provided, otherwise use searchTerm
    const searchParam = search || searchTerm
    
    const queryParams = {
      startDate,
      endDate,
      previousEndDate,
      page,
      limit,
      search: searchParam, // Backend expects 'search' parameter
      ageGroup,
      gender,
      useCache
    }
    
    console.log('🔍 API Request:', {
      indicatorId,
      queryParams,
      siteCode
    })
    
    // Use site-specific endpoint if siteCode is provided, otherwise use general endpoint
    const endpoint = siteCode 
      ? `/api/site-indicators/sites/${siteCode}/indicators/${indicatorId}/details`
      : `/api/indicators-optimized/${indicatorId}/details`
    
    const response = await api.get(endpoint, { params: queryParams })
    return response.data
  },

  // Get performance metrics
  getPerformanceMetrics: async () => {
    const response = await api.get('/api/performance/metrics')
    return response.data
  },

  // Get performance summary
  getPerformanceSummary: async () => {
    const response = await api.get('/api/performance/summary')
    return response.data
  },

  // Get system health
  getSystemHealth: async () => {
    const response = await api.get('/api/performance/health')
    return response.data
  },

  // Get cache statistics
  getCacheStats: async () => {
    const response = await api.get('/api/performance/cache')
    return response.data
  },

  // Clear cache
  clearCache: async () => {
    const response = await api.post('/api/performance/cache/clear')
    return response.data
  },

  // Get database status
  getDatabaseStatus: async () => {
    const response = await api.get('/api/performance/database')
    return response.data
  },

  // Helper function to get available categories
  getAvailableCategories: () => {
    return [
      { value: 'enrollment', label: 'Enrollment', description: 'New enrollments and retesting' },
      { value: 'art', label: 'ART', description: 'Antiretroviral therapy indicators' },
      { value: 'preart', label: 'Pre-ART', description: 'Pre-ART patient indicators' },
      { value: 'outcomes', label: 'Outcomes', description: 'Patient outcomes and status changes' },
      { value: 'quality', label: 'Quality', description: 'Quality of care indicators' },
      { value: 'viral_load', label: 'Viral Load', description: 'Viral load testing and suppression' },
      { value: 'timing', label: 'Timing', description: 'Treatment timing indicators' }
    ]
  },

  // Helper function to get available indicators
  getAvailableIndicators: () => {
    return [
      { id: '01_active_art_previous', name: 'Active ART Previous', category: 'art' },
      { id: '02_active_pre_art_previous', name: 'Active Pre-ART Previous', category: 'preart' },
      { id: '03_newly_enrolled', name: 'Newly Enrolled', category: 'enrollment' },
      { id: '04_retested_positive', name: 'Retested Positive', category: 'enrollment' },
      { id: '05_newly_initiated', name: 'Newly Initiated', category: 'art' },
      { id: '05.1.1_art_same_day', name: 'ART Same Day', category: 'timing' },
      { id: '05.1.2_art_1_7_days', name: 'ART 1-7 Days', category: 'timing' },
      { id: '05.1.3_art_over_7_days', name: 'ART Over 7 Days', category: 'timing' },
      { id: '05.2_art_with_tld', name: 'ART with TLD', category: 'art' },
      { id: '06_transfer_in', name: 'Transfer In', category: 'outcomes' },
      { id: '07_lost_and_return', name: 'Lost and Return', category: 'outcomes' },
      { id: '08.1_dead', name: 'Dead', category: 'outcomes' },
      { id: '08.2_lost_to_followup', name: 'Lost to Follow-up', category: 'outcomes' },
      { id: '08.3_transfer_out', name: 'Transfer Out', category: 'outcomes' },
      { id: '09_active_pre_art', name: 'Active Pre-ART', category: 'preart' },
      { id: '10_active_art_current', name: 'Active ART Current', category: 'art' },
      { id: '10.1_eligible_mmd', name: 'Eligible MMD', category: 'quality' },
      { id: '10.2_mmd', name: 'MMD', category: 'quality' },
      { id: '10.3_tld', name: 'TLD', category: 'quality' },
      { id: '10.4_tpt_start', name: 'TPT Start', category: 'quality' },
      { id: '10.5_tpt_complete', name: 'TPT Complete', category: 'quality' },
      { id: '10.6_eligible_vl_test', name: 'Eligible VL Test', category: 'viral_load' },
      { id: '10.7_vl_tested_12m', name: 'VL Tested 12M', category: 'viral_load' },
      { id: '10.8_vl_suppression', name: 'VL Suppression', category: 'viral_load' }
    ]
  }
}

export default reportingApi
