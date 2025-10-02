import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Calendar, Download, RefreshCw, BarChart3, Users, Activity, Heart, TestTube, Eye, 
  TrendingUp, CheckCircle, AlertTriangle, Target, Clock, EyeOff, Lock, Printer
} from 'lucide-react';
import siteApi from '../../services/siteApi';
import reportingApi from '../../services/reportingApi';
import IndicatorsReportSkeleton from '../../components/common/IndicatorsReportSkeleton';
import SiteFilter from '../../components/common/SiteFilter';
import { IndicatorDetailsModal } from '../../components/modals';
import { useAuth } from '../../contexts/AuthContext';

const IndicatorsReport = () => {
  const { user } = useAuth();
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isLoadingRef = useRef(false);
  
  // Check if user is a viewer (read-only access)
  const isViewer = user?.role === 'viewer';
  // Check if user is super admin (can print reports)
  const isSuperAdmin = user?.role === 'super_admin';
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    previousEndDate: '2024-12-31'
  });
  const [activeTab, setActiveTab] = useState('all');
  
  // Year and Quarter selection
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);
  
  // Site filtering
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [sitesLoading, setSitesLoading] = useState(false);
  
  // Auto-select first site when sites are loaded
  // "All Sites" functionality is disabled
  
  // Enterprise-level state
  const [summaryStats, setSummaryStats] = useState({
    activePatients: 0,
    newEnrolled: 0,
    viralSuppressed: 0,
    tptCompleted: 0
  });
  
  // Modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [indicatorDetails, setIndicatorDetails] = useState([]);
  const [pagination, setPagination] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilters, setCurrentFilters] = useState({});
  const [detailsError, setDetailsError] = useState(null);
  const [isSampleData, setIsSampleData] = useState(false);
  const [sampleDataInfo, setSampleDataInfo] = useState(null);

  // Debug modal state changes (only when modal opens with data)
  useEffect(() => {
    if (showDetailsModal && indicatorDetails.length > 0) {
      console.log('🔍 Modal opened with', indicatorDetails.length, 'records for', selectedIndicator?.Indicator);
    }
  }, [showDetailsModal, selectedIndicator, indicatorDetails]);


  // Generate available years (current year and previous years)
  const availableYears = (() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 10; year--) {
      years.push(year);
    }
    return years;
  })();

  // Generate available quarters based on selected year
  const availableQuarters = (() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;
    
    const quarters = [
      { value: 1, label: 'Q1 (Jan-Mar)', disabled: false },
      { value: 2, label: 'Q2 (Apr-Jun)', disabled: false },
      { value: 3, label: 'Q3 (Jul-Sep)', disabled: false },
      { value: 4, label: 'Q4 (Oct-Dec)', disabled: false }
    ];

    // Disable future quarters
    if (selectedYear === currentYear) {
      quarters.forEach(quarter => {
        if (quarter.value > currentQuarter) {
          quarter.disabled = true;
        }
      });
    }

    return quarters;
  })();

  // Get date range for selected year and quarter
  const getDateRangeForYearQuarter = (year, quarter) => {
    // Define quarter boundaries with explicit dates
    const quarterDates = {
      1: { start: `${year}-01-01`, end: `${year}-03-31` }, // Jan-Mar
      2: { start: `${year}-04-01`, end: `${year}-06-30` }, // Apr-Jun
      3: { start: `${year}-07-01`, end: `${year}-09-30` }, // Jul-Sep
      4: { start: `${year}-10-01`, end: `${year}-12-31` }  // Oct-Dec
    };
    
    const q = quarterDates[quarter];
    
    // Previous quarter end date
    const prevQuarter = quarter === 1 ? 4 : quarter - 1;
    const prevQ = quarterDates[prevQuarter];
    
    return {
      startDate: q.start,
      endDate: q.end,
      previousEndDate: prevQ.end
    };
  };

  // Handle year change
  const handleYearChange = (year) => {
    const newYear = parseInt(year);
    setSelectedYear(newYear);
    
    // If current year, make sure quarter is not in the future
    const currentYear = new Date().getFullYear();
    const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
    
    if (newYear === currentYear && selectedQuarter > currentQuarter) {
      setSelectedQuarter(currentQuarter);
      const dateRange = getDateRangeForYearQuarter(newYear, currentQuarter);
      setDateRange(dateRange);
    } else {
      const dateRange = getDateRangeForYearQuarter(newYear, selectedQuarter);
      setDateRange(dateRange);
    }
  };

  // Handle quarter change
  const handleQuarterChange = (quarter) => {
    const newQuarter = parseInt(quarter);
    setSelectedQuarter(newQuarter);
    
    const dateRange = getDateRangeForYearQuarter(selectedYear, newQuarter);
    setDateRange(dateRange);
  };

  // Validate data consistency between summary stats and detailed indicators
  const validateDataConsistency = (summaryStats, indicatorsData) => {
    const mismatches = [];
    
    // Helper function to find indicators with flexible matching
    const findIndicator = (patterns) => {
      for (const pattern of patterns) {
        const found = indicatorsData.find(ind => 
          ind.Indicator && ind.Indicator.toLowerCase().includes(pattern.toLowerCase())
        );
        if (found) return found;
      }
      return null;
    };
    
    // Check Active ART patients
    const activePatientsIndicator = findIndicator([
      '10. active art patients in this quarter',
      '10. active art patients',
      'active art patients in this quarter',
      'active art patients'
    ]);
    if (activePatientsIndicator && activePatientsIndicator.TOTAL !== summaryStats.activePatients) {
      mismatches.push({
        type: 'Active ART Patients',
        summaryValue: summaryStats.activePatients,
        indicatorValue: activePatientsIndicator.TOTAL,
        indicatorName: activePatientsIndicator.Indicator
      });
    }
    
    // Check Newly Enrolled
    const newEnrolledIndicator = findIndicator([
      '3. newly enrolled',
      'newly enrolled'
    ]);
    if (newEnrolledIndicator && newEnrolledIndicator.TOTAL !== summaryStats.newEnrolled) {
      mismatches.push({
        type: 'Newly Enrolled',
        summaryValue: summaryStats.newEnrolled,
        indicatorValue: newEnrolledIndicator.TOTAL,
        indicatorName: newEnrolledIndicator.Indicator
      });
    }
    
    // Check Viral Suppressed
    const viralSuppressedIndicator = findIndicator([
      '10.8. vl suppression',
      'vl suppression',
      'viral suppression'
    ]);
    if (viralSuppressedIndicator && viralSuppressedIndicator.TOTAL !== summaryStats.viralSuppressed) {
      mismatches.push({
        type: 'Viral Suppressed',
        summaryValue: summaryStats.viralSuppressed,
        indicatorValue: viralSuppressedIndicator.TOTAL,
        indicatorName: viralSuppressedIndicator.Indicator
      });
    }
    
    // Check TPT Completed
    const tptCompletedIndicator = findIndicator([
      '10.5. tpt complete',
      'tpt complete'
    ]);
    if (tptCompletedIndicator && tptCompletedIndicator.TOTAL !== summaryStats.tptCompleted) {
      mismatches.push({
        type: 'TPT Completed',
        summaryValue: summaryStats.tptCompleted,
        indicatorValue: tptCompletedIndicator.TOTAL,
        indicatorName: tptCompletedIndicator.Indicator
      });
    }
    
    return {
      hasMismatches: mismatches.length > 0,
      mismatches
    };
  };

  // Calculate summary statistics
  const calculateSummaryStats = (indicatorsData) => {
    console.log('Calculating summary stats from indicators:', indicatorsData.map(ind => ind.Indicator));
    
    // Helper function to find indicators with flexible matching
    const findIndicator = (patterns) => {
      for (const pattern of patterns) {
        const found = indicatorsData.find(ind => 
          ind.Indicator && ind.Indicator.toLowerCase().includes(pattern.toLowerCase())
        );
        if (found) {
          console.log(`Found indicator for pattern "${pattern}":`, found.Indicator, 'Value:', found.TOTAL);
          return found.TOTAL || 0;
        }
      }
      return 0;
    };
    
    // Find specific indicators with multiple possible patterns
    const activePatients = findIndicator([
      '10. active art patients in this quarter',
      '10. active art patients',
      'active art patients in this quarter',
      'active art patients'
    ]);
    
    const newEnrolled = findIndicator([
      '3. newly enrolled',
      'newly enrolled'
    ]);
    
    const viralSuppressed = findIndicator([
      '10.8. vl suppression',
      'vl suppression',
      'viral suppression'
    ]);
    
    const tptCompleted = findIndicator([
      '10.5. tpt complete',
      'tpt complete'
    ]);

    console.log('Summary stats calculated:', {
      activePatients,
      newEnrolled,
      viralSuppressed,
      tptCompleted
    });

    return {
      activePatients,
      newEnrolled,
      viralSuppressed,
      tptCompleted
    };
  };

  const fetchIndicators = useCallback(async (category = 'all') => {
    // Prevent multiple simultaneous requests
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const params = { 
        ...dateRange,
        useCache: true
      };
      
      if (selectedSite) {
        params.siteCode = selectedSite.code;
      }
      
      console.log('🔍 API Request Parameters:', {
        category,
        params,
        selectedSite: selectedSite ? { code: selectedSite.code, name: selectedSite.name } : 'No site selected'
      });
      
      // Always get all indicators, filtering will be done on frontend
      const response = await reportingApi.getAllIndicators(params);
      
      if (response.success) {
        console.log('🔍 FRONTEND API RESPONSE ANALYSIS');
        console.log('=====================================');
        console.log('📊 Raw API response:', response);
        console.log('📈 Performance data:', response.performance);
        console.log('📅 Period:', response.period);
        console.log('📋 Raw data structure:', response.data);
        console.log('📊 Data type:', Array.isArray(response.data) ? 'Array' : typeof response.data);
        
        // Process the data based on whether it's site-specific or all sites
        let indicatorsData = [];
        
        if (selectedSite) {
          // Site-specific data: response.data is an array of indicator objects
          console.log('🏥 Processing site-specific data');
          console.log('📊 Site info:', response.site);
          console.log('📋 Raw site data:', response.data);
          
          // Extract the data from each indicator (data is already the indicator object)
          indicatorsData = response.data.map(indicatorData => ({
            Indicator: indicatorData.Indicator,
            TOTAL: Number(indicatorData.TOTAL || 0),
            Male_0_14: Number(indicatorData.Male_0_14 || 0),
            Female_0_14: Number(indicatorData.Female_0_14 || 0),
            Male_over_14: Number(indicatorData.Male_over_14 || 0),
            Female_over_14: Number(indicatorData.Female_over_14 || 0),
            error: indicatorData.error || null
          }));
          
          console.log(`📊 Processed ${indicatorsData.length} indicators for site ${selectedSite.code}`);
        } else {
          // All sites data: response.data is an array of indicator objects (already aggregated by backend)
          console.log('🌐 Processing all sites data - using pre-aggregated indicators');
          console.log('📊 Raw aggregated data:', response.data);
          
          // The backend already aggregates the data, so we just need to process it
          indicatorsData = response.data.map(indicatorData => ({
            Indicator: indicatorData.Indicator,
            TOTAL: Number(indicatorData.TOTAL || 0),
            Male_0_14: Number(indicatorData.Male_0_14 || 0),
            Female_0_14: Number(indicatorData.Female_0_14 || 0),
            Male_over_14: Number(indicatorData.Male_over_14 || 0),
            Female_over_14: Number(indicatorData.Female_over_14 || 0),
            error: indicatorData.error || null
          }));
          
          console.log(`📊 Processed ${indicatorsData.length} pre-aggregated indicators`);
        }
        
        console.log('📋 Processed indicators data (first 3):', indicatorsData.slice(0, 3));
        console.log('📊 Total indicators processed:', indicatorsData.length);
        
        // Log each indicator with detailed breakdown
        console.log('🔍 DETAILED INDICATOR BREAKDOWN:');
        indicatorsData.forEach((indicator, index) => {
          console.log(`\n📊 Indicator ${index + 1}:`, {
            name: indicator.Indicator,
            total: indicator.TOTAL,
            male_0_14: indicator.Male_0_14,
            female_0_14: indicator.Female_0_14,
            male_over_14: indicator.Male_over_14,
            female_over_14: indicator.Female_over_14,
            error: indicator.error || 'none'
          });
        });
        
        // Filter indicators to show only 1-10.8 range
        const filteredIndicators = indicatorsData.filter(indicator => {
          if (!indicator.Indicator) return false;
          
          // Extract the indicator number from the indicator name
          const match = indicator.Indicator.match(/^(\d+(?:\.\d+)*)/);
          if (!match) return false;
          
          const indicatorNum = parseFloat(match[1]);
          const shouldInclude = indicatorNum >= 1 && indicatorNum <= 10.8;
          
          if (shouldInclude) {
            console.log(`✅ Including indicator: ${indicator.Indicator} (${indicatorNum})`);
          } else {
            console.log(`❌ Excluding indicator: ${indicator.Indicator} (${indicatorNum})`);
          }
          
          return shouldInclude;
        });
        
        console.log('\n🎯 FILTERED INDICATORS SUMMARY:');
        console.log('================================');
        console.log('📊 Total filtered indicators:', filteredIndicators.length);
        console.log('📋 Filtered indicators data:', filteredIndicators);
        
        setIndicators(filteredIndicators);
        
        // Calculate and update summary statistics
        const stats = calculateSummaryStats(filteredIndicators);
        console.log('\n📈 CALCULATED SUMMARY STATISTICS:');
        console.log('==================================');
        console.log('Active Patients:', stats.activePatients);
        console.log('New Enrolled:', stats.newEnrolled);
        console.log('Viral Suppressed:', stats.viralSuppressed);
        console.log('TPT Completed:', stats.tptCompleted);
        setSummaryStats(stats);
        
        // Debug: Log the specific indicators we're looking for
        console.log('\n🔍 SPECIFIC INDICATOR LOOKUP:');
        console.log('==============================');
        console.log('10. Active ART patients:', filteredIndicators.find(ind => ind.Indicator && ind.Indicator.toLowerCase().includes('active art patients')));
        console.log('3. Newly Enrolled:', filteredIndicators.find(ind => ind.Indicator && ind.Indicator.toLowerCase().includes('newly enrolled')));
        console.log('10.8. VL suppression:', filteredIndicators.find(ind => ind.Indicator && ind.Indicator.toLowerCase().includes('vl suppression')));
        console.log('10.5. TPT Complete:', filteredIndicators.find(ind => ind.Indicator && ind.Indicator.toLowerCase().includes('tpt complete')));
        
        // Validate data consistency
        const validationResults = validateDataConsistency(stats, filteredIndicators);
        if (validationResults.hasMismatches) {
          console.warn('⚠️ Data consistency issues found:', validationResults.mismatches);
        } else {
          console.log('✅ Data consistency validation passed');
        }
        
        console.log('\n🎉 FRONTEND DATA PROCESSING COMPLETE');
        console.log('=====================================');
        
        setIsInitialLoad(false);
      } else {
        setError(response.data.message || 'Failed to fetch indicators');
      }
    } catch (err) {
      console.error('Error fetching indicators:', err);
      setError(err.response?.data?.message || 'Failed to fetch indicators');
    } finally {
      // Add minimum loading time to prevent flashing
      setTimeout(() => {
        setLoading(false);
        isLoadingRef.current = false;
      }, 500);
    }
  }, [dateRange, selectedSite]);

  // Load sites on component mount
  const loadSites = useCallback(async () => {
    try {
      setSitesLoading(true);
      const response = await siteApi.getAllSites();
      console.log('Raw sites response:', response);
      
      // Handle the response structure properly
      const sitesData = response.sites || response.data || response;
      console.log('Processed sites data:', sitesData);
      
      setSites(sitesData);
      console.log('Loaded sites with data:', sitesData?.length || 0);
      
      // Auto-select first site if none is selected
      if (sitesData && sitesData.length > 0 && !selectedSite) {
        setSelectedSite(sitesData[0]);
        console.log('Auto-selected first site:', sitesData[0]);
      }
    } catch (error) {
      console.error('Error loading sites with data:', error);
      // Fallback to all sites if the new endpoint fails
      try {
        const fallbackResponse = await siteApi.getAllSites();
        const fallbackSites = fallbackResponse.sites || fallbackResponse.data || fallbackResponse;
        // Remove duplicates based on site code
        const uniqueSites = fallbackSites.filter((site, index, self) => 
          index === self.findIndex(s => s.code === site.code)
        );
        setSites(uniqueSites);
        console.log('Loaded fallback sites (deduplicated):', uniqueSites.length);
        
        // Auto-select first site if none is selected
        if (uniqueSites && uniqueSites.length > 0 && !selectedSite) {
          setSelectedSite(uniqueSites[0]);
          console.log('Auto-selected first fallback site:', uniqueSites[0]);
        }
      } catch (fallbackError) {
        console.error('Error loading fallback sites:', fallbackError);
        setSites([]);
      }
    } finally {
      setSitesLoading(false);
    }
  }, []);

  // Load sites on mount
  useEffect(() => {
    loadSites();
  }, [loadSites]);

  // Initialize date range on component mount
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
    const initialDateRange = getDateRangeForYearQuarter(currentYear, currentQuarter);
    setDateRange(initialDateRange);
  }, []);

  useEffect(() => {
    // Debounce the request to prevent rapid-fire calls
    const timeoutId = setTimeout(() => {
      fetchIndicators(activeTab);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [activeTab, dateRange.startDate, dateRange.endDate, dateRange.previousEndDate, fetchIndicators]);

  // Fetch data when site selection changes
  useEffect(() => {
    if (!isInitialLoad) {
      console.log('🔄 Site changed, fetching new data...', selectedSite);
      const timeoutId = setTimeout(() => {
        fetchIndicators(activeTab);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedSite, fetchIndicators, activeTab, isInitialLoad]);


  const handleRefresh = () => {
    // Clear any cached data and force fresh fetch
    setIndicators([]);
    setSummaryStats({
      activePatients: 0,
      newEnrolled: 0,
      viralSuppressed: 0,
      tptCompleted: 0
    });
    fetchIndicators(activeTab);
  };

  // Modal handlers
  const handleIndicatorClick = async (indicator, filters = {}) => {
    setSelectedIndicator(indicator);
    setCurrentFilters(filters);
    setShowDetailsModal(true);
    setSearchTerm('');
    setDetailsError(null);
    
    await fetchIndicatorDetails(indicator, 1, '', filters);
  };

  const handleModalClose = () => {
    setShowDetailsModal(false);
    setSelectedIndicator(null);
    setIndicatorDetails([]);
    setPagination({});
    setSearchTerm('');
    setCurrentFilters({});
    setDetailsError(null);
    setIsSampleData(false);
    setSampleDataInfo(null);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSearch = async (page = 1, search = searchTerm) => {
    if (!selectedIndicator) return;
    setSearchLoading(true);
    await fetchIndicatorDetails(selectedIndicator, page, search, currentFilters);
    setSearchLoading(false);
  };

  const handleClearSearch = async () => {
    setSearchTerm('');
    if (selectedIndicator) {
      await fetchIndicatorDetails(selectedIndicator, 1, '', currentFilters);
    }
  };

  const handlePageChange = async (page) => {
    if (!selectedIndicator) return;
    await fetchIndicatorDetails(selectedIndicator, page, searchTerm, currentFilters);
  };

  const fetchIndicatorDetails = async (indicator, page = 1, search = '', filters = {}) => {
    if (!indicator) {
      console.log('❌ No indicator provided');
      return;
    }
    
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      // Map indicator names to their corresponding SQL file names
      const indicatorMap = {
        '1. Active ART patients in previous quarter': '01_active_art_previous',
        '2. Active Pre-ART patients in previous quarter': '02_active_pre_art_previous',
        '3. Newly Enrolled': '03_newly_enrolled',
        '4. Re-tested positive': '04_retested_positive',
        '5. Newly Initiated': '05_newly_initiated',
        '5.1.1. New ART started: Same day': '05.1.1_art_same_day',
        '5.1.2. New ART started: 1-7 days': '05.1.2_art_1_7_days',
        '5.1.3. New ART started: >7 days': '05.1.3_art_over_7_days',
        '5.2. New ART started with TLD': '05.2_art_with_tld',
        '6. Transfer-in patients': '06_transfer_in',
        '7. Lost and Return': '07_lost_and_return',
        '8.1. Dead': '08.1_dead',
        '8.2. Lost to follow up (LTFU)': '08.2_lost_to_followup',
        '8.3. Transfer-out': '08.3_transfer_out',
        '9. Active Pre-ART': '09_active_pre_art',
        '10. Active ART patients in this quarter': '10_active_art_current',
        '10.1. Eligible MMD': '10.1_eligible_mmd',
        '10.2. MMD': '10.2_mmd',
        '10.3. TLD': '10.3_tld',
        '10.4. TPT Start': '10.4_tpt_start',
        '10.5. TPT Complete': '10.5_tpt_complete',
        '10.6. Eligible for VL test': '10.6_eligible_vl_test',
        '10.7. VL tested in 12M': '10.7_vl_tested_12m',
        '10.8. VL suppression': '10.8_vl_suppression'
      };

      const indicatorKey = indicatorMap[indicator.Indicator] || indicator.Indicator;
      
      // For details queries, use the same date range as the aggregate
      // This ensures consistency between aggregate display and detail modal
      const detailsDateRange = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        previousEndDate: dateRange.previousEndDate
      };
      
      // Build filter parameters
      const filterParams = {
        ...detailsDateRange,
        page,
        limit: 100,
        search, // Use 'search' parameter name
        _t: Date.now() // Cache busting
      };

      // Add gender and age group filters if provided
      if (filters.gender) {
        filterParams.gender = filters.gender;
      }
      if (filters.ageGroup) {
        filterParams.ageGroup = filters.ageGroup;
      }
      
      const response = await reportingApi.getIndicatorDetails(indicatorKey, {
        ...filterParams,
        siteCode: selectedSite?.code
      });

      if (response.success) {
        setIndicatorDetails(response.data || []);
        setPagination(response.pagination || {});
        setDetailsError(null);
        
        // Check if this is sample data or aggregated data
        if (response.isSampleData) {
          setIsSampleData(true);
          setSampleDataInfo({
            sampleSite: response.sampleSite,
            message: response.message
          });
          console.log('📊 Sample data detected:', response.message);
        } else if (response.isAggregatedData) {
          setIsSampleData(false);
          setSampleDataInfo({
            isAggregated: true,
            sourceSites: response.sourceSites,
            message: response.message
          });
          console.log('📊 Aggregated data detected:', response.message);
        } else {
          setIsSampleData(false);
          setSampleDataInfo(null);
        }
        
        console.log('✅ Loaded', response.data?.length || 0, 'records for', indicator.Indicator);
        console.log('📊 Full API Response:', response);
        console.log('📊 Pagination data:', response.pagination);
        console.log('📊 Total count:', response.pagination?.totalCount);
      } else {
        console.error('❌ Failed to fetch details:', response.message);
        setIndicatorDetails([]);
        setPagination({});
        setDetailsError(response.message || 'Failed to fetch indicator details');
      }
    } catch (error) {
      console.error('Error fetching indicator details:', error);
      setIndicatorDetails([]);
      setPagination({});
      setDetailsError(error.message || 'Failed to fetch indicator details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const exportToCSV = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportTitle = `National ART Indicators Report - ${dateRange.startDate} to ${dateRange.endDate}`;
    
    const csvContent = [
      [reportTitle],
      [`Generated on: ${new Date().toLocaleString()}`],
      [''],
      ['EXECUTIVE SUMMARY'],
      ['Active ART Patients', summaryStats.activePatients.toLocaleString()],
      ['Newly Enrolled', summaryStats.newEnrolled.toLocaleString()],
      ['Viral Suppressed', summaryStats.viralSuppressed.toLocaleString()],
      ['TPT Completed', summaryStats.tptCompleted.toLocaleString()],
      [''],
      ['DETAILED INDICATORS'],
      ['Indicator', 'Total', 'Male 0-14', 'Female 0-14', 'Male 15+', 'Female 15+'],
      ...indicators.map(indicator => [
        indicator.Indicator || '',
        indicator.TOTAL || 0,
        indicator.Male_0_14 || 0,
        indicator.Female_0_14 || 0,
        indicator.Male_over_14 || 0,
        indicator.Female_over_14 || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `national-art-report-${timestamp}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Helper functions for print
  const getProvinceName = (siteCode) => {
    if (!siteCode) return 'Unknown';
    
    const provinceCode = siteCode.substring(0, 2);
    const provinceMap = {
      '02': 'Battambang',
      '03': 'Kampong Cham', 
      '12': 'Kampong Thom',
      '18': 'Preah Sihanouk',
      '01': 'Phnom Penh',
      '04': 'Kampong Chhnang',
      '05': 'Kampong Speu',
      '06': 'Kampong Thom',
      '07': 'Kampot',
      '08': 'Kandal',
      '09': 'Koh Kong',
      '10': 'Kratie',
      '11': 'Mondulkiri',
      '13': 'Preah Vihear',
      '14': 'Pursat',
      '15': 'Ratanakiri',
      '16': 'Siem Reap',
      '17': 'Stung Treng',
      '19': 'Svay Rieng',
      '20': 'Takeo',
      '21': 'Oddar Meanchey',
      '22': 'Kep',
      '23': 'Pailin',
      '24': 'Tbong Khmum'
    };
    
    return `${provinceCode}. ${provinceMap[provinceCode] || 'Unknown Province'}`;
  };

  const getOperationalDistrict = (site) => {
    if (!site || !site.code) return 'Unknown';
    
    const districtCode = site.code.substring(0, 4);
    const siteName = site.name || '';
    
    // Extract district name from site name (usually the second part after province)
    const nameParts = siteName.split(' ');
    const districtName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : siteName;
    
    return `OD ${districtCode}. ${districtName}`;
  };

  const getDisplayIndicatorName = (backendName) => {
    const nameMap = {
      '1. Active ART patients in previous quarter': '1. ចំនួនអ្នកជំងឺ ART សកម្មដល់ចុងត្រីមាសមុន (Number of active ART patients in previous quarter)',
      '2. Active Pre-ART patients in previous quarter': '2. ចំនួនអ្នកជំងឺ Pre-ART សកម្មដល់ចុងត្រីមាសមុន (Number of active Pre-ART patients in previous quarter)',
      '3. Newly Enrolled': '3. ចំនួនអ្នកជំងឺចុះឈ្មោះថ្មី (Number of newly enrolled patients)',
      '4. Re-tested positive': '4. ចំនួនអ្នកជំងឺដែលវិជ្ជមានពីតេស្តបញ្ជាក់ (Number of patient re-tested positive)',
      '5. Newly Initiated': '5. ចំនួនអ្នកជំងឺចាប់ផ្តើមព្យាបាលដោយ ARV ថ្មី (Number of newly initiated ART)',
      '5.1.1. New ART started: Same day': '5.1.1. ក្នុងថ្ងៃតែមួយ (Same day – 0 day)',
      '5.1.2. New ART started: 1-7 days': '5.1.2. ពី ១ ទៅ ៧ ថ្ងៃ (1–7 days)',
      '5.1.3. New ART started: >7 days': '5.1.3. ច្រើនជាង ៧ ថ្ងៃ (>7 days)',
      '5.2. New ART started with TLD': '5.2. ចំនួនអ្នកជំងឹចាប់ផ្តើមព្យាបាលថ្មីដោយ TDF+3TC+DTG (Number of new ART started with TLD)',
      '6. Transfer-in patients': '6. ចំនួនអ្នកជំងឺដែលបានបញ្ជូនចូល (Number of transfer-in patients)',
      '7. Lost and Return': '7. ចំនួនអ្នកជំងឺដែលបានបោះបង់ហើយត្រឡប់មកវិញ (Number of Lost-Return patients)',
      '7.1. In the same ART site': '7.1. នៅក្នុងសេវា ART តែមួយ (In the same ART site)',
      '7.2. From other ART site': '7.2. មកពីសេវា ART ផ្សេង (From other ART site)',
      '8.1. Dead': '8.1. ចំនួនអ្នកជំងឺដែលបានស្លាប់ (Dead)',
      '8.2. Lost to follow up (LTFU)': '8.2. ចំនួនអ្នកជំងឺដែលបានបោះបង់ (Lost to follow up – LTFU)',
      '8.3. Transfer-out': '8.3. ចំនួនអ្នកជំងឺដែលបានបញ្ជូនចេញ (Transfer-out)',
      '9. Active Pre-ART': '9. ចំនួនអ្នកជំងឺ Pre-ART សកម្មដល់ចុងត្រីមាសនេះ (Number of active Pre-ART patients in this quarter)',
      '10. Active ART patients in this quarter': '10. ចំនួនអ្នកជំងឺ ART សកម្មដល់ចុងត្រីមាសនេះ (Number of active ART patients in this quarter)',
      '10.1. Eligible MMD': '10.1. ចំនួនអ្នកជំងឺដែលសមស្របសំរាប់ការផ្តល់ថ្នាំរយៈពេលវែង (Eligible for Multi Month Dispensing – MMD)',
      '10.2. MMD': '10.2. ចំនួនអ្នកជំងឺកំពុងទទួលថ្នាំរយៈពេលវែង (Number of patients received MMD)',
      '10.3. TLD': '10.3. ចំនួនអ្នកជំងឺកំពុងទទួលការព្យាបាលដោយ TLD (Number of patients received TLD)',
      '10.4. TPT Start': '10.4. ចំនួនអ្នកជំងឺដែលបានចាប់ផ្តើមការបង្ការជំងឺរបេង (Number of patients started TPT)',
      '10.5. TPT Complete': '10.5. ចំនួនអ្នកជំងឺដែលបានបញ្ចប់ការបង្ការជំងឺរបេង (Number of patients completed TPT)',
      '10.6. Eligible for VL test': '10.6. ចំនួនអ្នកជំងឺដែលសមស្របធ្វើតេស្ត Viral Load (Eligible for Viral Load test)',
      '10.7. VL tested in 12M': '10.7. ចំនួនអ្នកជំងឺធ្វើតេស្ត Viral Load ក្នុងរយៈពេល ១២ ខែចុងក្រោយ (Receive VL test in last 12 months)',
      '10.8. VL suppression': '10.8. ចំនួនអ្នកជំងឺដែលមានលទ្ធផល VL ចុងក្រោយតិចជាង 1000 copies (Last VL is suppressed)'
    };
    return nameMap[backendName] || backendName;
  };

  const generateReportHTML = () => {
    // Get the current date and time
    const now = new Date();
    const timestamp = now.toLocaleString();
    const dateRange = `${selectedYear} Q${selectedQuarter}`;
    
    // Get site information
    const siteName = selectedSite?.name || 'All Sites';
    const siteCode = selectedSite?.code || 'N/A';
    
    // Create HTML content for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ART Indicators Report - ${siteName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 14px;
            color: #333;
            line-height: 1.4;
            font-size: 14px;
          }
          .report-header {
            background: #ffffff;
            margin-bottom: 24px;
          }
          .main-title {
            text-align: center;
            margin-bottom: 24px;
          }
          .main-title h1 {
            color: #1f2937;
            margin: 0;
            font-size: 24px;
            font-weight: bold;
            line-height: 1.2;
          }
          .report-parameters {
            border: 1px solid #e5e7eb;
            overflow: hidden;
          }
          .report-parameters table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }
          .report-parameters tr {
            border-bottom: 1px solid #e5e7eb;
          }
          .report-parameters tr:last-child {
            border-bottom: none;
          }
          .report-parameters .label {
            padding: 12px 16px;
            font-weight: 600;
            color: #1f2937;
            border-right: 1px solid #e5e7eb;
            width: 25%;
            background: #f9fafb;
          }
          .report-parameters .value {
            padding: 12px 16px;
            color: #1f2937;
            border-right: 1px solid #e5e7eb;
            width: 25%;
          }
          .report-parameters .value:last-child {
            border-right: none;
          }
          .indicators-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }
          .indicators-table th {
            background: #2563eb;
            color: white;
            padding: 10px 8px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #1d4ed8;
            font-size: 12px;
          }
          .indicators-table td {
            padding: 8px 6px;
            border: 1px solid #e2e8f0;
            text-align: center;
            font-size: 11px;
          }
          .indicators-table tr:nth-child(even) {
            background: #f8fafc;
          }
          .indicators-table td:first-child {
            font-weight: bold;
            text-align: left;
            padding-left: 8px;
          }
          .indicators-table td:nth-child(2) {
            text-align: left;
            padding-left: 8px;
            font-weight: bold;
          }
          .footer {
            margin-top: 25px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
          }
          @media print {
            @page {
              margin: 0.5in;
              size: A4;
            }
            
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            body { 
              margin: 0; 
              font-size: 12px;
              line-height: 1.4;
              background: white !important;
            }
            
            .report-header { 
              page-break-after: avoid; 
              margin-bottom: 20px;
              break-inside: avoid;
            }
            
            .main-title h1 {
              font-size: 18px;
              margin: 10px 0;
              line-height: 1.3;
            }
            
            .report-parameters {
              page-break-inside: avoid;
              margin-bottom: 15px;
            }
            
            .report-parameters table {
              width: 100%;
            }
            
            .report-parameters .label,
            .report-parameters .value {
              font-size: 11px;
              padding: 8px 12px;
            }
            
            .indicators-table { 
              page-break-inside: auto;
              font-size: 10px;
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            
            .indicators-table thead {
              display: table-header-group;
            }
            
            .indicators-table tbody {
              display: table-row-group;
            }
            
            .indicators-table th {
              background: #2563eb !important;
              color: white !important;
              padding: 8px 6px;
              font-size: 10px;
              font-weight: bold;
              border: 1px solid #1d4ed8 !important;
              page-break-inside: avoid;
            }
            
            .indicators-table thead tr:first-child th:first-child {
              padding-top: 15px;
            }
            
            .indicators-table td {
              padding: 6px 4px;
              font-size: 10px;
              border: 1px solid #e2e8f0 !important;
              page-break-inside: avoid;
            }
            
            .indicators-table tr {
              page-break-inside: avoid;
              break-inside: avoid;
              orphans: 3;
              widows: 3;
            }
            
            .indicators-table tr:nth-child(even) {
              background: #f8fafc !important;
            }
            
            .indicators-table td:first-child,
            .indicators-table td:nth-child(2) {
              font-weight: bold;
              text-align: left;
              padding-left: 6px;
            }
            
            .footer {
              page-break-inside: avoid;
              margin-top: 20px;
              font-size: 10px;
            }
            
            /* Prevent orphaned rows */
            .indicators-table tbody tr {
              page-break-inside: avoid;
              orphans: 3;
              widows: 3;
            }
            
            /* Keep indicator groups together when possible */
            .indicator-group {
              page-break-inside: avoid;
              orphans: 3;
              widows: 3;
            }
            
            /* Add space when table breaks to new page */
            .indicators-table {
              page-break-before: auto;
            }
            
            .indicators-table thead {
              page-break-after: avoid;
            }
            
            /* Ensure space at top of new page for table */
            @page :first {
              margin-top: 0.7in;
            }
            
            @page :left, :right {
              margin-top: 0.7in;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="main-title">
            <h1>របាយការណ៍ស្តីពីការព្យាបាលអ្នកជំងឺអេដស៍ Quarterly Report on ART</h1>
          </div>

          <div class="report-parameters">
            <table>
              <tbody>
                <tr>
                  <td class="label">ឈ្មោះមន្ទីរពេទ្យបង្អែក (Facility):</td>
                  <td class="value">${siteName}</td>
                  <td class="label">ឈ្មោះឯកសារ (File Name):</td>
                  <td class="value">${selectedSite?.fileName || selectedSite?.file_name || siteCode}</td>
                </tr>
                <tr>
                  <td class="label">ឈ្មោះស្រុកប្រតិបត្តិ (Operational District):</td>
                  <td class="value">${selectedSite ? getOperationalDistrict(selectedSite) : 'All Operational Districts'}</td>
                  <td class="label">ខេត្ត-ក្រុង (Province):</td>
                  <td class="value">${selectedSite ? getProvinceName(selectedSite.code) : 'All Provinces'}</td>
                </tr>
                <tr>
                  <td class="label">ឆ្នាំ (Year):</td>
                  <td class="value">${selectedYear}</td>
                  <td class="label">ត្រីមាសទី (Quarter):</td>
                  <td class="value">Quarter ${selectedQuarter}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        
        <table class="indicators-table">
          <thead>
            <tr>
              <th>#</th>
              <th>សុចនាករ Indicator</th>
              <th>អាយុ Age</th>
              <th>ប្រុស Male</th>
              <th>ស្រី Female</th>
              <th>សរុប Total</th>
            </tr>
          </thead>
          <tbody>
            ${indicators.map((indicator, index) => `
              <!-- Indicator Header Row -->
              <tr>
                <td rowspan="3">${index + 1}</td>
                <td rowspan="3" style="text-align: left; font-weight: bold;">${getDisplayIndicatorName(indicator.Indicator)}</td>
                <td style="text-align: center; background: #f8fafc;">0-14</td>
                <td style="text-align: right;">${(indicator.Male_0_14 || 0).toLocaleString()}</td>
                <td style="text-align: right;">${(indicator.Female_0_14 || 0).toLocaleString()}</td>
                <td style="text-align: right;">${(Number(indicator.Male_0_14 || 0) + Number(indicator.Female_0_14 || 0)).toLocaleString()}</td>
              </tr>
              
              <!-- 15+ Age Group Row -->
              <tr style="background: #f8fafc;">
                <td style="text-align: center; background: #f8fafc;">>14</td>
                <td style="text-align: right;">${(indicator.Male_over_14 || 0).toLocaleString()}</td>
                <td style="text-align: right;">${(indicator.Female_over_14 || 0).toLocaleString()}</td>
                <td style="text-align: right;">${(Number(indicator.Male_over_14 || 0) + Number(indicator.Female_over_14 || 0)).toLocaleString()}</td>
              </tr>
              
              <!-- Total Row -->
              <tr>
                <td style="text-align: center; background: #e2e8f0; font-weight: bold;">សរុប Total</td>
                <td style="text-align: right; font-weight: bold;">${(Number(indicator.Male_0_14 || 0) + Number(indicator.Male_over_14 || 0)).toLocaleString()}</td>
                <td style="text-align: right; font-weight: bold;">${(Number(indicator.Female_0_14 || 0) + Number(indicator.Female_over_14 || 0)).toLocaleString()}</td>
                <td style="text-align: right; font-weight: bold;">${(Number(indicator.Male_0_14 || 0) + Number(indicator.Female_0_14 || 0) + Number(indicator.Male_over_14 || 0) + Number(indicator.Female_over_14 || 0)).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          
        </div>
      </body>
      </html>
     `;
     
     return htmlContent;
   };

   const previewReport = () => {
     const htmlContent = generateReportHTML();
     setPreviewContent(htmlContent);
     setShowPreview(true);
   };

   const printToPDF = () => {
     // Create a new window for printing
     const printWindow = window.open('', '_blank');
     const htmlContent = generateReportHTML();
     
     // Write content to the new window
     printWindow.document.write(htmlContent);
     printWindow.document.close();
     
     // Wait for content to load, then trigger print
     printWindow.onload = () => {
       printWindow.focus();
       printWindow.print();
       printWindow.close();
     };
   };

  const categories = [
    { id: 'all', name: 'All Indicators', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'enrollment', name: 'Enrollment', icon: <Users className="h-4 w-4" /> },
    { id: 'retention', name: 'Retention', icon: <Activity className="h-4 w-4" /> },
    { id: 'outcomes', name: 'Outcomes', icon: <Heart className="h-4 w-4" /> },
    { id: 'treatment', name: 'Treatment', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'viral-load', name: 'Viral Load', icon: <TestTube className="h-4 w-4" /> }
  ];

  // Function to filter indicators by category
  const getFilteredIndicators = (categoryId) => {
    if (categoryId === 'all') {
      return indicators;
    }
    
    // Map category IDs to indicator patterns/names
    const categoryPatterns = {
      'enrollment': ['enrolled', 'enrollment', 'newly enrolled', 'new enrollment'],
      'retention': ['active', 'retention', 'lost to follow', 'returned', 'transfer'],
      'outcomes': ['dead', 'died', 'outcome', 'viral suppressed', 'suppression'],
      'treatment': ['initiated', 'started', 'art', 'pre-art', 'tpt', 'tb'],
      'viral-load': ['viral', 'vl', 'suppressed', 'suppression', 'load']
    };
    
    const patterns = categoryPatterns[categoryId] || [];
    
    return indicators.filter(indicator => {
      const indicatorName = (indicator.Indicator || '').toLowerCase();
      return patterns.some(pattern => indicatorName.includes(pattern));
    });
  };

  // Show loading skeleton only on initial load or when no data exists
  if (loading && (isInitialLoad || indicators.length === 0)) {
    return <IndicatorsReportSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className=" p-4 space-y-6">
      


       


        {/* Report Configuration Panel */}
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Health Facility Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <Label className="text-sm font-semibold text-foreground">Health Facility</Label>
                </div>
                <div className="space-y-3">
                  <SiteFilter
                    sites={sites}
                    selectedSite={selectedSite}
                    onSiteChange={setSelectedSite}
                    disabled={sitesLoading}
                    showAllOption={false}
                    variant="minimal"
                    className="w-full h-11 text-sm"
                  />
           
                </div>
              </div>

              {/* Time Period Configuration */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-semibold text-foreground">Reporting Period</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={handleRefresh} 
                      disabled={loading} 
                      variant="outline" 
                      size="sm" 
                      className="h-9 text-xs border-border/60 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <RefreshCw className={`h-3 w-3 mr-2 transition-transform duration-200 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                      {loading ? 'Refreshing...' : 'Refresh'}
                    </Button>
                    <Button 
                      onClick={exportToCSV} 
                      variant="outline" 
                      size="sm" 
                      className="h-9 text-xs border-border/60 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                      disabled={!selectedSite || loading}
                    >
                      <Download className="h-3 w-3 mr-2 transition-transform duration-200 group-hover:translate-y-0.5" />
                      Export
                    </Button>
                     {isSuperAdmin && (
                       <>
                         <Button 
                           onClick={previewReport} 
                           variant="outline" 
                           size="sm" 
                           className="h-9 text-xs border-border/60 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                           disabled={!selectedSite || loading}
                         >
                           <Eye className="h-3 w-3 mr-2 transition-transform duration-200 group-hover:scale-105" />
                           Preview
                         </Button>
                         <Button 
                           onClick={printToPDF} 
                           variant="outline" 
                           size="sm" 
                           className="h-9 text-xs border-border/60 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                           disabled={!selectedSite || loading}
                         >
                           <Printer className="h-3 w-3 mr-2 transition-transform duration-200 group-hover:scale-105" />
                           Print PDF
                         </Button>
                       </>
                     )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Year</Label>
                      <Select 
                        value={selectedYear.toString()} 
                        onValueChange={handleYearChange}
                      >
                        <SelectTrigger className="h-11 text-sm border-border/60 hover:border-border focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableYears.map(year => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quarter</Label>
                      <Select 
                        value={selectedQuarter.toString()} 
                        onValueChange={handleQuarterChange}
                      >
                        <SelectTrigger className="h-11 text-sm border-border/60 hover:border-border focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableQuarters.map(quarter => (
                            <SelectItem 
                              key={quarter.value} 
                              value={quarter.value.toString()}
                              disabled={quarter.disabled}
                            >
                              Q{quarter.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                 
                </div>
              </div>

             
            </div>
          </div>
        </div>
         {/* Executive Summary Dashboard */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-xs sm:text-sm font-medium">Active ART Patients</p>
                  <p className="text-xl sm:text-3xl font-bold">{summaryStats.activePatients.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="text-xs sm:text-sm text-primary-foreground/80">Currently on treatment</span>
                  </div>
                </div>
                <Users className="h-8 w-8 sm:h-12 sm:w-12 text-primary-foreground/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-success text-success-foreground border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-success-foreground/80 text-xs sm:text-sm font-medium">Newly Enrolled</p>
                  <p className="text-xl sm:text-3xl font-bold">{summaryStats.newEnrolled.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="text-xs sm:text-sm text-success-foreground/80">This quarter</span>
                  </div>
                </div>
                <Heart className="h-8 w-8 sm:h-12 sm:w-12 text-success-foreground/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary text-secondary-foreground border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-xs sm:text-sm font-medium">Viral Suppressed</p>
                  <p className="text-xl sm:text-3xl font-bold">{summaryStats.viralSuppressed.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="text-xs sm:text-sm text-secondary-foreground/80">VL &lt; 1000 copies/ml</span>
                  </div>
                </div>
                <TestTube className="h-8 w-8 sm:h-12 sm:w-12 text-secondary-foreground/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warning text-warning-foreground border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-warning-foreground/80 text-xs sm:text-sm font-medium">TPT Completed</p>
                  <p className="text-xl sm:text-3xl font-bold">{summaryStats.tptCompleted.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="text-xs sm:text-sm text-warning-foreground/80">TB prevention</span>
                  </div>
                </div>
                <Activity className="h-8 w-8 sm:h-12 sm:w-12 text-warning-foreground/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-destructive bg-destructive/10 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
                <p className="text-destructive font-medium text-sm sm:text-base">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Indicators Table */}
        <div className="bg-card rounded-lg ">
   
           
          </div>
          <div className="p-0">

            
              <IndicatorsTable 
                indicators={indicators} 
                loading={loading} 
                onIndicatorClick={handleIndicatorClick}
                selectedSite={selectedSite}
                selectedYear={selectedYear}
                selectedQuarter={selectedQuarter}
                isViewer={isViewer}
              />
       
          </div>
        </div>

        {/* Indicator Details Modal */}
        <IndicatorDetailsModal
          isOpen={showDetailsModal}
          onClose={handleModalClose}
          selectedIndicator={selectedIndicator}
          indicatorDetails={indicatorDetails}
          pagination={pagination}
          detailsLoading={detailsLoading}
          searchLoading={searchLoading}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          onPageChange={handlePageChange}
          currentFilters={currentFilters}
          selectedSite={selectedSite}
          dateRange={dateRange}
          error={detailsError}
          isSampleData={isSampleData}
          sampleDataInfo={sampleDataInfo}
        />

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white shadow-xl w-full h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <h3 className="text-lg font-semibold">Report Preview</h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={printToPDF} 
                    variant="outline" 
                    size="sm"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button 
                    onClick={() => setShowPreview(false)} 
                    variant="outline" 
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  srcDoc={previewContent}
                  className="w-full h-full border-0"
                  title="Report Preview"
                />
              </div>
            </div>
          </div>
        )}
      </div>
     
   );
 };

// Helper function to get province name from site code
const getProvinceName = (siteCode) => {
  if (!siteCode) return 'Unknown';
  
  const provinceCode = siteCode.substring(0, 2);
  const provinceMap = {
    '02': 'Battambang',
    '03': 'Kampong Cham', 
    '12': 'Kampong Thom',
    '18': 'Preah Sihanouk',
    '01': 'Phnom Penh',
    '04': 'Kampong Chhnang',
    '05': 'Kampong Speu',
    '06': 'Kampong Thom',
    '07': 'Kampot',
    '08': 'Kandal',
    '09': 'Koh Kong',
    '10': 'Kratie',
    '11': 'Mondulkiri',
    '13': 'Preah Vihear',
    '14': 'Pursat',
    '15': 'Ratanakiri',
    '16': 'Siem Reap',
    '17': 'Stung Treng',
    '19': 'Svay Rieng',
    '20': 'Takeo',
    '21': 'Oddar Meanchey',
    '22': 'Kep',
    '23': 'Pailin',
    '24': 'Tbong Khmum'
  };
  
  return `${provinceCode}. ${provinceMap[provinceCode] || 'Unknown Province'}`;
};

// Helper function to get operational district from site
const getOperationalDistrict = (site) => {
  if (!site || !site.code) return 'Unknown';
  
  const districtCode = site.code.substring(0, 4);
  const siteName = site.name || '';
  
  // Extract district name from site name (usually the second part after province)
  const nameParts = siteName.split(' ');
  const districtName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : siteName;
  
  return `OD ${districtCode}. ${districtName}`;
};

// Function to get bilingual indicator names (Khmer/English)
const getDisplayIndicatorName = (backendName) => {
  const nameMap = {
    '1. Active ART patients in previous quarter': '1. ចំនួនអ្នកជំងឺ ART សកម្មដល់ចុងត្រីមាសមុន (Number of active ART patients in previous quarter)',
    '2. Active Pre-ART patients in previous quarter': '2. ចំនួនអ្នកជំងឺ Pre-ART សកម្មដល់ចុងត្រីមាសមុន (Number of active Pre-ART patients in previous quarter)',
    '3. Newly Enrolled': '3. ចំនួនអ្នកជំងឺចុះឈ្មោះថ្មី (Number of newly enrolled patients)',
    '4. Re-tested positive': '4. ចំនួនអ្នកជំងឺដែលវិជ្ជមានពីតេស្តបញ្ជាក់ (Number of patient re-tested positive)',
    '5. Newly Initiated': '5. ចំនួនអ្នកជំងឺចាប់ផ្តើមព្យាបាលដោយ ARV ថ្មី (Number of newly initiated ART)',
    '5.1.1. New ART started: Same day': '5.1.1. ក្នុងថ្ងៃតែមួយ (Same day – 0 day)',
    '5.1.2. New ART started: 1-7 days': '5.1.2. ពី ១ ទៅ ៧ ថ្ងៃ (1–7 days)',
    '5.1.3. New ART started: >7 days': '5.1.3. ច្រើនជាង ៧ ថ្ងៃ (>7 days)',
    '5.2. New ART started with TLD': '5.2. ចំនួនអ្នកជំងឹចាប់ផ្តើមព្យាបាលថ្មីដោយ TDF+3TC+DTG (Number of new ART started with TLD)',
    '6. Transfer-in patients': '6. ចំនួនអ្នកជំងឺដែលបានបញ្ជូនចូល (Number of transfer-in patients)',
    '7. Lost and Return': '7. ចំនួនអ្នកជំងឺដែលបានបោះបង់ហើយត្រឡប់មកវិញ (Number of Lost-Return patients)',
    '7.1. In the same ART site': '7.1. នៅក្នុងសេវា ART តែមួយ (In the same ART site)',
    '7.2. From other ART site': '7.2. មកពីសេវា ART ផ្សេង (From other ART site)',
    '8.1. Dead': '8.1. ចំនួនអ្នកជំងឺដែលបានស្លាប់ (Dead)',
    '8.2. Lost to follow up (LTFU)': '8.2. ចំនួនអ្នកជំងឺដែលបានបោះបង់ (Lost to follow up – LTFU)',
    '8.3. Transfer-out': '8.3. ចំនួនអ្នកជំងឺដែលបានបញ្ជូនចេញ (Transfer-out)',
    '9. Active Pre-ART': '9. ចំនួនអ្នកជំងឺ Pre-ART សកម្មដល់ចុងត្រីមាសនេះ (Number of active Pre-ART patients in this quarter)',
    '10. Active ART patients in this quarter': '10. ចំនួនអ្នកជំងឺ ART សកម្មដល់ចុងត្រីមាសនេះ (Number of active ART patients in this quarter)',
    '10.1. Eligible MMD': '10.1. ចំនួនអ្នកជំងឺដែលសមស្របសំរាប់ការផ្តល់ថ្នាំរយៈពេលវែង (Eligible for Multi Month Dispensing – MMD)',
    '10.2. MMD': '10.2. ចំនួនអ្នកជំងឺកំពុងទទួលថ្នាំរយៈពេលវែង (Number of patients received MMD)',
    '10.3. TLD': '10.3. ចំនួនអ្នកជំងឺកំពុងទទួលការព្យាបាលដោយ TLD (Number of patients received TLD)',
    '10.4. TPT Start': '10.4. ចំនួនអ្នកជំងឺដែលបានចាប់ផ្តើមការបង្ការជំងឺរបេង (Number of patients started TPT)',
    '10.5. TPT Complete': '10.5. ចំនួនអ្នកជំងឺដែលបានបញ្ចប់ការបង្ការជំងឺរបេង (Number of patients completed TPT)',
    '10.6. Eligible for VL test': '10.6. ចំនួនអ្នកជំងឺដែលសមស្របធ្វើតេស្ត Viral Load (Eligible for Viral Load test)',
    '10.7. VL tested in 12M': '10.7. ចំនួនអ្នកជំងឺធ្វើតេស្ត Viral Load ក្នុងរយៈពេល ១២ ខែចុងក្រោយ (Receive VL test in last 12 months)',
    '10.8. VL suppression': '10.8. ចំនួនអ្នកជំងឺដែលមានលទ្ធផល VL ចុងក្រោយតិចជាង 1000 copies (Last VL is suppressed)'
  };
  return nameMap[backendName] || backendName;
};

// Indicators Table Component
const IndicatorsTable = ({ indicators, loading, onIndicatorClick, selectedSite, selectedYear, selectedQuarter, isViewer }) => {
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Report Header Skeleton - Bilingual Format */}
        <div className="bg-card border border-border rounded-lg shadow-sm p-6 mb-6">
          <div className="animate-pulse">
            {/* Main Title Skeleton */}
            <div className="text-center mb-6">
              <div className="h-8 bg-muted rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>

            {/* Report Parameters Table Skeleton */}
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {/* Row 1: Facility Name, Facility Code */}
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 w-1/4 border-r border-border">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </td>
                    <td className="px-4 py-3 w-1/4 border-r border-border">
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </td>
                    <td className="px-4 py-3 w-1/4 border-r border-border">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </td>
                    <td className="px-4 py-3 w-1/4">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                    </td>
                  </tr>
                  {/* Row 2: Operational District, Province */}
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 border-r border-border">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </td>
                    <td className="px-4 py-3 border-r border-border">
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </td>
                    <td className="px-4 py-3 border-r border-border">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </td>
                  </tr>
                  {/* Row 3: Year, Quarter */}
                  <tr>
                    <td className="px-4 py-3 border-r border-border">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                    </td>
                    <td className="px-4 py-3 border-r border-border">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                    </td>
                    <td className="px-4 py-3 border-r border-border">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Status Indicators Skeleton */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="h-6 bg-muted rounded w-20"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-muted rounded w-32"></div>
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header Skeleton */}
              <thead className="bg-muted border-b-2 border-border">
                <tr>
                  <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-12 border-r border-border">
                    <div className="h-4 bg-muted rounded w-4 mx-auto"></div>
                  </th>
                  <th className="px-4 py-4 text-right text-sm font-bold text-foreground border-r border-border">
                    <div className="h-4 bg-muted rounded w-32"></div>
                  </th>
                  <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-32 border-r border-border">
                    <div className="h-4 bg-muted rounded w-12 mx-auto"></div>
                  </th>
                  <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-24 border-r border-border">
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </th>
                  <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-32 border-r border-border">
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </th>
                  <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-24">
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </th>
                </tr>
              </thead>

              {/* Table Body Skeleton */}
              <tbody className="bg-card divide-y divide-border">
                {[...Array(3)].map((_, i) => (
                  <React.Fragment key={i}>
                    {/* Indicator Header Row Skeleton */}
                    <tr className="border-b border-border">
                      <td className="px-3 py-4 text-right text-sm font-medium text-muted-foreground border-r border-border" rowSpan="3">
                        <div className="h-4 bg-muted rounded w-4 mx-auto"></div>
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground align-middle text-left border-r border-border" rowSpan="3">
                        <div className="h-4 bg-muted rounded w-48 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-32"></div>
                      </td>
                      <td className="px-3 py-4 text-center text-sm font-medium text-muted-foreground bg-muted/50 border-r border-border">
                        <div className="h-4 bg-muted rounded w-8 mx-auto"></div>
                      </td>
                      <td className="px-3 py-4 text-right border-r border-border">
                        <div className="h-6 bg-muted rounded w-12 ml-auto"></div>
                      </td>
                      <td className="px-3 py-4 text-right border-r border-border">
                        <div className="h-6 bg-muted rounded w-12 ml-auto"></div>
                      </td>
                      <td className="px-3 py-4 text-right">
                        <div className="h-6 bg-muted rounded w-12 ml-auto"></div>
                      </td>
                    </tr>

                    {/* 15+ Age Group Row Skeleton */}
                    <tr className="bg-muted border-b border-border">
                      <td className="px-3 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/50 border-r border-border">
                        <div className="h-4 bg-muted rounded w-8 mx-auto"></div>
                      </td>
                      <td className="px-3 py-3 text-right border-r border-border">
                        <div className="h-6 bg-muted rounded w-16 ml-auto"></div>
                      </td>
                      <td className="px-3 py-3 text-right border-r border-border">
                        <div className="h-6 bg-muted rounded w-16 ml-auto"></div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="h-6 bg-muted rounded w-16 ml-auto"></div>
                      </td>
                    </tr>

                    {/* Sub-Total Row Skeleton */}
                    <tr className="bg-muted border-b-2 border-border font-bold">
                      <td className="px-3 py-3 text-center text-sm font-bold text-muted-foreground bg-muted/50 border-r border-border">
                        <div className="h-4 bg-muted rounded w-12 mx-auto"></div>
                      </td>
                      <td className="px-3 py-3 text-right border-r border-border">
                        <div className="h-6 bg-muted rounded w-16 ml-auto"></div>
                      </td>
                      <td className="px-3 py-3 text-right border-r border-border">
                        <div className="h-6 bg-muted rounded w-16 ml-auto"></div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="h-7 bg-muted rounded w-20 ml-auto"></div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Footer Skeleton */}
        <div className="bg-muted border border-border rounded-lg p-4 sm:p-6 mt-6 sm:mt-8">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 ml-auto"></div>
            <div className="h-3 bg-muted rounded w-1/2 ml-auto mt-2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (indicators.length === 0) {
    return (
      <Card className="border-dashed border-2 border-border">
        <CardContent className="p-8 sm:p-12 text-right">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 sm:p-4 bg-muted rounded-full">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No Data Available</h3>
              <p className="text-sm sm:text-base text-muted-foreground">No indicators found for the selected period and filters.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default Table View - Matching the image format exactly
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Report Header */}
       {/* Report Header - Bilingual Format */}
       <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          {/* Main Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              របាយការណ៍ស្តីពីការព្យាបាលអ្នកជំងឺអេដស៍ Quarterly Report on ART
            </h1>
          
          </div>

          {/* Report Parameters Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 font-semibold text-foreground border-r border-border w-1/4">
                    ឈ្មោះមន្ទីរពេទ្យបង្អែក (Facility):
                  </td>
                  <td className="px-4 py-3 text-foreground border-r border-border w-1/4">
                    {selectedSite ? selectedSite.name : 'All Facilities'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground border-r border-border w-1/4">
                    ឈ្មោះឯកសារ (File Name):
                  </td>
                  <td className="px-4 py-3 text-foreground w-1/4">
                    {selectedSite ? (selectedSite.fileName || selectedSite.file_name || selectedSite.code) : 'All Facilities'}
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                    ឈ្មោះស្រុកប្រតិបត្តិ (Operational District):
                  </td>
                  <td className="px-4 py-3 text-foreground border-r border-border">
                    {selectedSite ? getOperationalDistrict(selectedSite) : 'All Operational Districts'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                    ខេត្ត-ក្រុង (Province):
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {selectedSite ? getProvinceName(selectedSite.code) : 'All Provinces'}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                    ឆ្នាំ (Year):
                  </td>
                  <td className="px-4 py-3 text-foreground border-r border-border">
                    {selectedYear}
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground border-r border-border">
                    ត្រីមាសទី (Quarter):
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    Quarter {selectedQuarter}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

       
        </div>

      {/* Indicators Table - Matching the image layout */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-muted border-b-2 border-border">
              <tr>
                <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-12 border-r border-border">
                  #
                </th>
                <th className="px-4 py-4 text-right text-sm font-bold text-foreground border-r border-border">
                  សុចនាករ Indicator
                </th>
                <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-32 border-r border-border">
                  អាយុ Age
                </th>
                <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-24 border-r border-border">
                  ប្រុស Male
                </th>
                <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-32 border-r border-border">
                  ស្រី Female
                </th>
                <th className="px-3 py-4 text-right text-sm font-bold text-foreground w-24">
                  សរុប Total
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-card divide-y divide-border">
              {indicators.map((indicator, index) => (
                <React.Fragment key={index}>
                  {/* Indicator Header Row with Name */}
                  <tr 
                    className="border-b border-border"
                  >
                    {/* Row Number */}
                    <td className="px-3 py-4 text-right text-sm font-medium text-muted-foreground border-r border-border" rowSpan="3">
                      {index + 1}
                    </td>

                    {/* Indicator Name - spans 3 rows */}
                    <td className="px-4 py-4 text-sm text-foreground align-middle text-left border-r border-border" rowSpan="3">
                      <div 
                        className="font-medium leading-tight text-left cursor-pointer hover:text-primary hover:underline transition-colors"
                        onClick={() => onIndicatorClick && onIndicatorClick(indicator)}
                        title="Click to view all patients for this indicator"
                      >
                        {getDisplayIndicatorName(indicator.Indicator)}
                      </div>
                      {indicator.error && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Error: {indicator.error}
                        </Badge>
                      )}
                    </td>

                    {/* Age 0-14 */}
                    <td className="px-3 py-4 text-center text-sm font-medium text-muted-foreground bg-muted/50 border-r border-border hover:bg-muted/70 hover:font-bold transition-all duration-200">
                      0-14
                    </td>

                    {/* Male 0-14 */}
                    <td className="px-3 py-4 text-right border-r border-border">
                      <div 
                        className="text-lg font-normal text-blue-600 cursor-pointer underline hover:text-blue-800 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onIndicatorClick && onIndicatorClick(indicator, { gender: 'male', ageGroup: '0-14' });
                        }}
                        title="Click to view detailed list of male patients aged 0-14"
                      >
                        {(indicator.Male_0_14 || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* Female 0-14 */}
                    <td className="px-3 py-4 text-right border-r border-border">
                      <div 
                        className="text-lg font-normal text-pink-600 cursor-pointer underline hover:text-pink-800 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onIndicatorClick && onIndicatorClick(indicator, { gender: 'female', ageGroup: '0-14' });
                        }}
                        title="Click to view detailed list of female patients aged 0-14"
                      >
                        {(indicator.Female_0_14 || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* Total 0-14 */}
                    <td className="px-3 py-4 text-right">
                      <div className="text-lg text-foreground">
                        {(Number(indicator.Male_0_14 || 0) + Number(indicator.Female_0_14 || 0)).toLocaleString()}
                      </div>
                    </td>

                  </tr>

                  {/* 15+ Age Group Row */}
                  <tr className="bg-muted border-b border-border">
                    <td className="px-3 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/50 border-r border-border hover:bg-muted/70 hover:font-bold transition-all duration-200">
                      {'>'}14
                    </td>
                    <td className="px-3 py-3 text-right border-r border-border">
                      <div 
                        className="text-lg font-normal text-blue-600 cursor-pointer underline hover:text-blue-800 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onIndicatorClick && onIndicatorClick(indicator, { gender: 'male', ageGroup: '>14' });
                        }}
                        title="Click to view detailed list of male patients aged 15+"
                      >
                        {(indicator.Male_over_14 || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right border-r border-border">
                      <div 
                        className="text-lg font-normal text-pink-600 cursor-pointer underline hover:text-pink-800 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onIndicatorClick && onIndicatorClick(indicator, { gender: 'female', ageGroup: '>14' });
                        }}
                        title="Click to view detailed list of female patients aged 15+"
                      >
                        {(indicator.Female_over_14 || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="text-lg text-foreground">
                        {(Number(indicator.Male_over_14 || 0) + Number(indicator.Female_over_14 || 0)).toLocaleString()}
                      </div>
                    </td>
                  </tr>

                  {/* Sub-Total Row for this indicator */}
                  <tr className="bg-muted border-b-2 border-border font-bold">
                    <td className="px-3 py-3 text-center text-sm font-bold text-muted-foreground bg-muted/50 border-r border-border hover:bg-muted/70 hover:font-bold transition-all duration-200">
                      សរុប
                    </td>
                    <td className="px-3 py-3 text-right border-r border-border">
                      <div className="text-lg font-bold text-blue-700">
                        {(Number(indicator.Male_0_14 || 0) + Number(indicator.Male_over_14 || 0)).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right border-r border-border">
                      <div className="text-lg font-bold text-pink-700">
                        {(Number(indicator.Female_0_14 || 0) + Number(indicator.Female_over_14 || 0)).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="text-xl font-bold text-foreground">
                        {(indicator.TOTAL || 0).toLocaleString()}
                      </div>
                    </td>
                  </tr>

                </React.Fragment>
              ))}

            </tbody>
          </table>
        </div>
      </div>

      {/* Report Footer */}
      <div className="bg-muted border border-border rounded-lg p-4 sm:p-6 mt-6 sm:mt-8">
        <div className="text-right text-muted-foreground">
          <p className="text-xs sm:text-sm">
            This report contains {indicators.length} indicator{indicators.length !== 1 ? 's' : ''} 
            {' '}with a total of {indicators.reduce((sum, ind) => sum + (ind.TOTAL || 0), 0).toLocaleString()} patient records.
          </p>
          <p className="text-xs mt-2 text-muted-foreground">
            Data accuracy and completeness may vary by indicator. Please verify critical decisions with source data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndicatorsReport;
