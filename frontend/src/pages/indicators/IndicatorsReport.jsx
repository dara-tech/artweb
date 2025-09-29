import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Calendar, Download, RefreshCw, BarChart3, Users, Activity, Heart, TestTube, Eye, 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Globe, Building2, 
  Search, FileText, PieChart, LineChart, MapPin, Clock, Target
} from 'lucide-react';
import siteApi from '../../services/siteApi';
import reportingApi from '../../services/reportingApi';
import IndicatorsReportSkeleton from '../../components/common/IndicatorsReportSkeleton';
import SiteFilter from '../../components/common/SiteFilter';
import { IndicatorDetailsModal } from '../../components/modals';

const IndicatorsReport = () => {
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isLoadingRef = useRef(false);
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
  
  // Auto-select site 0201 when sites are loaded
  useEffect(() => {
    if (sites.length > 0 && !selectedSite) {
      const site0201 = sites.find(site => site.code === '0201');
      if (site0201) {
        console.log('🏥 Auto-selecting site 0201:', site0201);
        setSelectedSite(site0201);
      }
    }
  }, [sites, selectedSite]);
  
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
        selectedSite: selectedSite ? { code: selectedSite.code, name: selectedSite.name } : 'All Sites'
      });
      
      let response;
      if (category === 'all') {
        response = await reportingApi.getAllIndicators(params);
      } else {
        response = await reportingApi.getIndicatorsByCategory(category, params);
      }
      
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

  const handleForceRefresh = () => {
    // Force refresh with cache busting
    console.log('🔄 Force refreshing with cache busting...');
    handleRefresh();
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


  const categories = [
    { id: 'all', name: 'All Indicators', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'enrollment', name: 'Enrollment', icon: <Users className="h-4 w-4" /> },
    { id: 'retention', name: 'Retention', icon: <Activity className="h-4 w-4" /> },
    { id: 'outcomes', name: 'Outcomes', icon: <Heart className="h-4 w-4" /> },
    { id: 'treatment', name: 'Treatment', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'viral-load', name: 'Viral Load', icon: <TestTube className="h-4 w-4" /> }
  ];

  // Show loading skeleton only on initial load or when no data exists
  if (loading && (isInitialLoad || indicators.length === 0)) {
    return <IndicatorsReportSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Enterprise Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    {selectedSite ? `${selectedSite.name} ART Indicators Report` : 'National ART Indicators Report'}
                  </h1>
                  <p className="text-sm sm:text-lg text-gray-600 mt-1">
                    {selectedSite ? `Site Code: ${selectedSite.code} - ` : ''}Comprehensive HIV/AIDS Treatment Performance Dashboard
                  </p>
                  {selectedSite && selectedSite.code === '0201' && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Building2 className="h-3 w-3 mr-1" />
                      Single Site View - Maung Russey RH
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Last Updated: {new Date().toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>National Coverage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Real-time Monitoring</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <Button onClick={handleRefresh} disabled={loading} variant="outline" size="sm" className="w-full sm:w-auto">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                <span className="sm:hidden">Refresh</span>
                <span className="hidden sm:inline">Refresh Data</span>
              </Button>
              <Button onClick={handleForceRefresh} disabled={loading} variant="outline" size="sm" className="w-full sm:w-auto border-orange-200 text-orange-600 hover:bg-orange-50">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                <span className="sm:hidden">Force</span>
                <span className="hidden sm:inline">Force Refresh</span>
              </Button>
              <Button onClick={exportToCSV} variant="default" size="sm" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Export</span>
                <span className="hidden sm:inline">Export Report</span>
              </Button>
            </div>
          </div>
        </div>


        {/* Executive Summary Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className=" sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs sm:text-sm font-medium">Active ART Patients</p>
                  <p className="text-xl sm:text-3xl font-bold">{summaryStats.activePatients.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="text-xs sm:text-sm text-blue-100">Currently on treatment</span>
                  </div>
                </div>
                <Users className="h-8 w-8 sm:h-12 sm:w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs sm:text-sm font-medium">Newly Enrolled</p>
                  <p className="text-xl sm:text-3xl font-bold">{summaryStats.newEnrolled.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="text-xs sm:text-sm text-green-100">This quarter</span>
                  </div>
                </div>
                <Heart className="h-8 w-8 sm:h-12 sm:w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-xs sm:text-sm font-medium">Viral Suppressed</p>
                  <p className="text-xl sm:text-3xl font-bold">{summaryStats.viralSuppressed.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="text-xs sm:text-sm text-purple-100">VL &lt; 1000 copies/ml</span>
                  </div>
                </div>
                <TestTube className="h-8 w-8 sm:h-12 sm:w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-xs sm:text-sm font-medium">TPT Completed</p>
                  <p className="text-xl sm:text-3xl font-bold">{summaryStats.tptCompleted.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="text-xs sm:text-sm text-orange-100">TB prevention</span>
                  </div>
                </div>
                <Activity className="h-8 w-8 sm:h-12 sm:w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Period Selector */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-50 to-blue-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-slate-800 text-lg sm:text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <span>Reporting Configuration</span>
                <p className="text-sm font-normal text-slate-600 mt-1">Configure your reporting parameters and filters</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Period Selection */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  Period Selection
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* Year Selector */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      Year
                    </Label>
                    <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                      <SelectTrigger className="h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Year" />
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
                  
                  {/* Quarter Selector */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-green-600" />
                      Quarter
                    </Label>
                    <Select value={selectedQuarter.toString()} onValueChange={handleQuarterChange}>
                      <SelectTrigger className="h-10 border-slate-300 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Quarter" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableQuarters.map(quarter => (
                          <SelectItem 
                            key={quarter.value} 
                            value={quarter.value.toString()}
                            disabled={quarter.disabled}
                          >
                            {quarter.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Site Selection */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-green-600" />
                  Site Selection
                </h4>
                <SiteFilter
                  sites={sites}
                  selectedSite={selectedSite}
                  onSiteChange={setSelectedSite}
                  disabled={sitesLoading}
                  showAllOption={false}
                  variant="card"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                <p className="text-red-600 font-medium text-sm sm:text-base">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Area */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <CardTitle className="flex items-center gap-2 text-gray-900 text-lg sm:text-xl">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
                Performance Indicators Dashboard
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-600">
                <span>Showing {indicators.length} indicators</span>
                <Separator orientation="vertical" className="h-4 hidden sm:block" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-3 sm:px-6 pt-4">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-gray-100 h-auto">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id} 
                      className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm p-2 sm:p-3 text-xs sm:text-sm"
                    >
                      {category.icon}
                      <span className="truncate">{category.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* All Indicators Tab */}
              <TabsContent value="all" className="p-3 sm:p-6 space-y-4">
                <IndicatorsTable 
                  indicators={indicators} 
                  loading={loading} 
                  onIndicatorClick={handleIndicatorClick}
                />
              </TabsContent>

              {/* Category Tabs */}
              {categories.slice(1).map((category) => (
                <TabsContent key={category.id} value={category.id} className="p-3 sm:p-6 space-y-4">
                  <IndicatorsTable 
                    indicators={indicators} 
                    loading={loading} 
                    onIndicatorClick={handleIndicatorClick}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

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
          error={detailsError}
        />
      </div>
    </div>
  );
};

// Indicators Table Component
const IndicatorsTable = ({ indicators, loading, onIndicatorClick }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-4 sm:p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="text-right">
                      <div className="h-6 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (indicators.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-200">
        <CardContent className="p-8 sm:p-12 text-right">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 sm:p-4 bg-gray-100 rounded-full">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
              <p className="text-sm sm:text-base text-gray-500">No indicators found for the selected period and filters.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Table View - Card-based layout matching the image
  // eslint-disable-next-line no-constant-condition
  if (false) {
    return (
      <div className="space-y-6">
        {indicators.map((indicator, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Indicator Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {indicator.Indicator}
                  </h3>
                  {indicator.error && (
                    <Badge variant="destructive" className="mt-2 text-xs">
                      Error: {indicator.error}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndicatorClick && onIndicatorClick(indicator);
                  }}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>

            {/* Data Cards Layout */}
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Total Card - Left Side */}
                <div className="lg:w-1/3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-right">
                    <div className="text-4xl font-bold text-blue-700 mb-2">
                      {(indicator.TOTAL || 0).toLocaleString()}
                    </div>
                    <div className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                      TOTAL
                    </div>
                  </div>
                </div>

                {/* Breakdown Cards - Right Side */}
                <div className="lg:w-2/3">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Male 0-14 */}
                    <div className="bg-blue-25 border border-blue-100 rounded-lg p-4 text-right">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {(indicator.Male_0_14 || 0).toLocaleString()}
                      </div>
                      <div className="text-xs font-medium text-gray-700">Male</div>
                      <div className="text-xs text-gray-500">0-14 years</div>
                    </div>

                    {/* Female 0-14 */}
                    <div className="bg-pink-25 border border-pink-100 rounded-lg p-4 text-right">
                      <div className="text-2xl font-bold text-pink-600 mb-1">
                        {(indicator.Female_0_14 || 0).toLocaleString()}
                      </div>
                      <div className="text-xs font-medium text-gray-700">Female</div>
                      <div className="text-xs text-gray-500">0-14 years</div>
                    </div>

                    {/* Male 15+ */}
                    <div className="bg-blue-25 border border-blue-100 rounded-lg p-4 text-right">
                      <div className="text-2xl font-bold text-blue-700 mb-1">
                        {(indicator.Male_over_14 || 0).toLocaleString()}
                      </div>
                      <div className="text-xs font-medium text-gray-700">Male</div>
                      <div className="text-xs text-gray-500">15+ years</div>
                    </div>

                    {/* Female 15+ */}
                    <div className="bg-pink-25 border border-pink-100 rounded-lg p-4 text-right">
                      <div className="text-2xl font-bold text-pink-700 mb-1">
                        {(indicator.Female_over_14 || 0).toLocaleString()}
                      </div>
                      <div className="text-xs font-medium text-gray-700">Female</div>
                      <div className="text-xs text-gray-500">15+ years</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Percentage Summary */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="text-right">
                    <span className="text-gray-500">Male 0-14:</span>
                    <span className="ml-1 font-semibold text-blue-600">
                      {indicator.TOTAL ? Math.round(((indicator.Male_0_14 || 0) / indicator.TOTAL) * 100) : 0}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500">Female 0-14:</span>
                    <span className="ml-1 font-semibold text-pink-600">
                      {indicator.TOTAL ? Math.round(((indicator.Female_0_14 || 0) / indicator.TOTAL) * 100) : 0}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500">Male 15+:</span>
                    <span className="ml-1 font-semibold text-blue-700">
                      {indicator.TOTAL ? Math.round(((indicator.Male_over_14 || 0) / indicator.TOTAL) * 100) : 0}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500">Female 15+:</span>
                    <span className="ml-1 font-semibold text-pink-700">
                      {indicator.TOTAL ? Math.round(((indicator.Female_over_14 || 0) / indicator.TOTAL) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Charts View (placeholder for future implementation)
  // eslint-disable-next-line no-constant-condition
  if (false) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <PieChart className="h-4 w-4 sm:h-5 sm:w-5" />
              Gender Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="text-right text-gray-500 py-6 sm:py-8">
              <PieChart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-sm sm:text-base">Chart visualization coming soon</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <LineChart className="h-4 w-4 sm:h-5 sm:w-5" />
              Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="text-right text-gray-500 py-6 sm:py-8">
              <LineChart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-sm sm:text-base">Trend analysis coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default Table View - Matching the image format exactly
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Report Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">សុចនាករ Indicator</h2>
            <p className="text-sm sm:text-base text-gray-600">Comprehensive overview of key HIV treatment and prevention indicators</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm text-gray-500">Generated on</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Indicators Table - Matching the image layout */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gray-50 border-b-2 border-gray-300">
              <tr>
                <th className="px-3 py-4 text-right text-sm font-bold text-gray-700 w-12">
                  #
                </th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700">
                  សុចនាករ Indicator
                </th>
                <th className="px-3 py-4 text-right text-sm font-bold text-gray-700 w-20">
                  អាយុ Age
                </th>
                <th className="px-3 py-4 text-right text-sm font-bold text-gray-700 w-24">
                  ប្រុស Male
                </th>
                <th className="px-3 py-4 text-right text-sm font-bold text-gray-700 w-24">
                  ស្រី Female
                </th>
                <th className="px-3 py-4 text-right text-sm font-bold text-gray-700 w-24">
                  សរុប Total
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {indicators.map((indicator, index) => (
                <React.Fragment key={index}>
                  {/* Indicator Header Row with Name */}
                  <tr 
                    className="border-b border-gray-100"
                  >
                    {/* Row Number */}
                    <td className="px-3 py-4 text-right text-sm font-medium text-gray-900" rowSpan="3">
                      {index + 1}
                    </td>

                    {/* Indicator Name - spans 3 rows */}
                    <td className="px-4 py-4 text-sm text-gray-900 align-middle text-left" rowSpan="3">
                      <div 
                        className="font-medium leading-tight text-left cursor-pointer hover:underline transition-colors"
                        onClick={() => onIndicatorClick && onIndicatorClick(indicator)}
                        title="Click to view all patients for this indicator"
                      >
                        {indicator.Indicator}
                      </div>
                      {indicator.error && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Error: {indicator.error}
                        </Badge>
                      )}
                    </td>

                    {/* Age 0-14 */}
                    <td className="px-3 py-4 text-center text-sm font-medium text-gray-700">
                      0-14
                    </td>

                    {/* Male 0-14 */}
                    <td className="px-3 py-4 text-right">
                      <div 
                        className="text-lg font-normal text-blue-600 cursor-pointer underline hover:font-bold rounded px-2 py-1 transition-colors"
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
                    <td className="px-3 py-4 text-right">
                      <div 
                        className="text-lg font-normal text-pink-600 cursor-pointer underline hover:font-bold rounded px-2 py-1 transition-colors"
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
                      <div className="text-lg text-gray-900">
                        {(Number(indicator.Male_0_14 || 0) + Number(indicator.Female_0_14 || 0)).toLocaleString()}
                      </div>
                    </td>

                  </tr>

                  {/* 15+ Age Group Row */}
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="px-3 py-3 text-center text-sm font-medium text-gray-700">
                      {'>'}14
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div 
                        className="text-lg font-normal text-blue-700 cursor-pointer underline hover:font-bold rounded px-2 py-1 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onIndicatorClick && onIndicatorClick(indicator, { gender: 'male', ageGroup: '>14' });
                        }}
                        title="Click to view detailed list of male patients aged 15+"
                      >
                        {(indicator.Male_over_14 || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div 
                        className="text-lg font-normal text-pink-700 cursor-pointer underline hover:font-bold rounded px-2 py-1 transition-colors"
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
                      <div className="text-lg text-gray-900">
                        {(Number(indicator.Male_over_14 || 0) + Number(indicator.Female_over_14 || 0)).toLocaleString()}
                      </div>
                    </td>
                  </tr>

                  {/* Sub-Total Row for this indicator */}
                  <tr className="bg-blue-50 border-b-2 border-blue-200 font-bold">
                    <td className="px-3 py-3 text-center text-sm font-bold text-gray-700">
                      សរុប
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="text-lg font-bold text-blue-800">
                        {(Number(indicator.Male_0_14 || 0) + Number(indicator.Male_over_14 || 0)).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="text-lg font-bold text-pink-800">
                        {(Number(indicator.Female_0_14 || 0) + Number(indicator.Female_over_14 || 0)).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="text-xl font-bold text-gray-900">
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
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mt-6 sm:mt-8">
        <div className="text-right text-gray-600">
          <p className="text-xs sm:text-sm">
            This report contains {indicators.length} indicator{indicators.length !== 1 ? 's' : ''} 
            {' '}with a total of {indicators.reduce((sum, ind) => sum + (ind.TOTAL || 0), 0).toLocaleString()} records.
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Data accuracy and completeness may vary by indicator. Please verify critical decisions with source data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndicatorsReport;
