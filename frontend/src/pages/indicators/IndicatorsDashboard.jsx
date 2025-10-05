import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  RefreshCw, 
  Users, 
  Heart, 
  TestTube,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  FileText,
  Shield,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  PieChart,
  LineChart,
  AreaChart
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart as RechartsAreaChart, 
  Area,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import api from '../../services/api';
import siteApi from '../../services/siteApi';
import IndicatorsDashboardSkeleton from '../../components/common/IndicatorsDashboardSkeleton';
import SiteFilter from '../../components/common/SiteFilter';
import { IndicatorDetailsModal } from '../../components/modals';

const IndicatorsDashboard = () => {
  const [allIndicators, setAllIndicators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isLoadingRef = useRef(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [indicatorDetails, setIndicatorDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  
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

  // Initialize date range based on current year and quarter
  const getInitialDateRange = () => {
    const currentYear = new Date().getFullYear();
    const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
    return getDateRangeForYearQuarter(currentYear, currentQuarter);
  };

  const [dateRange, setDateRange] = useState(() => getInitialDateRange());
  const [chartView, setChartView] = useState('mixed'); // 'mixed', 'pie', 'bar', 'line', 'area'
  
  // Year and Quarter selection
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);
  
  // Site filtering
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [sitesLoading, setSitesLoading] = useState(false);

  // Chart color configurations
  const chartColors = {
    primary: 'hsl(var(--chart-1))',
    secondary: 'hsl(var(--chart-2))',
    tertiary: 'hsl(var(--chart-3))',
    quaternary: 'hsl(var(--chart-4))',
    quinary: 'hsl(var(--chart-5))',
    male: '#3b82f6',
    female: '#ec4899',
    maleOver14: '#1d4ed8',
    femaleOver14: '#be185d'
  };

  const chartConfig = {
    male: {
      label: "Male 0-14",
      color: chartColors.male,
    },
    female: {
      label: "Female 0-14", 
      color: chartColors.female,
    },
    maleOver14: {
      label: "Male 15+",
      color: chartColors.maleOver14,
    },
    femaleOver14: {
      label: "Female 15+",
      color: chartColors.femaleOver14,
    },
  };


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

  const fetchAllIndicators = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    
    console.log('Fetching data for date range:', dateRange);
    console.log('Selected year:', selectedYear, 'Selected quarter:', selectedQuarter);
    console.log('Selected site:', selectedSite);
    
    try {
      const params = { ...dateRange };
      if (selectedSite) {
        params.siteCode = selectedSite.code;
      }
      
      console.log('API request params:', params);
      console.log('Selected site for API:', selectedSite);
      
      const response = await api.get('/apiv1/indicators-optimized/all', {
        params
      });
      
      if (response.data.success) {
        console.log('🔍 DASHBOARD API RESPONSE ANALYSIS');
        console.log('====================================');
        console.log('📊 Raw API response:', response.data);
        console.log('📈 Performance data:', response.data.performance);
        console.log('📅 Period:', response.data.period);
        console.log('📋 Raw indicators data (first 3):', response.data.data.slice(0, 3));
        console.log('📊 Total indicators received:', response.data.data.length);
        
        // Log each indicator with detailed breakdown
        console.log('🔍 DETAILED INDICATOR BREAKDOWN:');
        response.data.data.forEach((indicator, index) => {
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
        const filteredIndicators = response.data.data.filter(indicator => {
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
        
        setAllIndicators(filteredIndicators);
        setIsInitialLoad(false);
      } else {
        setError(response.data.message || 'Failed to fetch indicators data');
      }
    } catch (err) {
      console.error('Error fetching indicators data:', err);
      setError(err.response?.data?.message || 'Failed to fetch indicators data');
    } finally {
      // Add minimum loading time to prevent flashing
      setTimeout(() => {
        setLoading(false);
        isLoadingRef.current = false;
      }, 500);
    }
  }, [dateRange, selectedYear, selectedQuarter, selectedSite]);

  // Load sites on component mount
  const loadSites = useCallback(async () => {
    try {
      setSitesLoading(true);
      const response = await siteApi.getSitesWithData();
      setSites(response.sites || response);
      console.log('Loaded sites with data:', response.sites?.length || 0);
    } catch (error) {
      console.error('Error loading sites with data:', error);
      // Fallback to all sites if the new endpoint fails
      try {
        const fallbackResponse = await siteApi.getAllSites();
        setSites(fallbackResponse.sites || fallbackResponse);
      } catch (fallbackError) {
        console.error('Error loading fallback sites:', fallbackError);
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
      fetchAllIndicators();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dateRange.startDate, dateRange.endDate, dateRange.previousEndDate, fetchAllIndicators]);

  // Update date range when year or quarter changes
  useEffect(() => {
    const newDateRange = getDateRangeForYearQuarter(selectedYear, selectedQuarter);
    setDateRange(newDateRange);
  }, [selectedYear, selectedQuarter]);

  // Fetch data when site selection changes
  useEffect(() => {
    console.log('Site selection useEffect triggered:', { selectedSite, isInitialLoad });
    if (!isInitialLoad) {
      console.log('Site selection changed, fetching data for site:', selectedSite);
      const timeoutId = setTimeout(() => {
        fetchAllIndicators();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedSite, fetchAllIndicators, isInitialLoad]);



  const handleRefresh = () => {
    fetchAllIndicators();
  };

  const fetchIndicatorDetails = async (indicator, page = 1, search = '') => {
    if (page === 1 && search !== searchTerm) {
      setSearchLoading(true);
    } else {
      setDetailsLoading(true);
    }
    setSelectedIndicator(indicator);
    
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
      
      const response = await api.get(`/apiv1/indicators-optimized/${indicatorKey}/details`, {
        params: {
          ...dateRange,
          page,
          limit: 100,
          search
        }
      });
      
      if (response.data.success) {
        setIndicatorDetails(response.data.data);
        setPagination(response.data.pagination);
        setShowDetailsModal(true);
      } else {
        setError(response.data.message || 'Failed to fetch indicator details');
      }
    } catch (err) {
      console.error('Error fetching indicator details:', err);
      setError(err.response?.data?.message || 'Failed to fetch indicator details');
    } finally {
      setDetailsLoading(false);
      setSearchLoading(false);
    }
  };

  // Modal handler functions
  const handleModalClose = () => {
    setShowDetailsModal(false);
    setSelectedIndicator(null);
    setIndicatorDetails([]);
    setSearchTerm('');
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSearch = (page, search) => {
    if (selectedIndicator) {
      fetchIndicatorDetails(selectedIndicator, page, search);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (selectedIndicator) {
      fetchIndicatorDetails(selectedIndicator, 1, '');
    }
  };

  const handlePageChange = (page) => {
    if (selectedIndicator) {
      fetchIndicatorDetails(selectedIndicator, page, searchTerm);
    }
  };

  const getIndicatorIcon = (indicator) => {
    const title = indicator.Indicator?.toLowerCase() || '';
    if (title.includes('active') && title.includes('art')) return <Users className="h-4 w-4" />;
    if (title.includes('enrolled')) return <Users className="h-4 w-4" />;
    if (title.includes('initiated')) return <Heart className="h-4 w-4" />;
    if (title.includes('transfer')) return <ArrowUpRight className="h-4 w-4" />;
    if (title.includes('lost') || title.includes('ltfu')) return <AlertCircle className="h-4 w-4" />;
    if (title.includes('dead')) return <Minus className="h-4 w-4" />;
    if (title.includes('mmd')) return <Zap className="h-4 w-4" />;
    if (title.includes('tld')) return <Shield className="h-4 w-4" />;
    if (title.includes('tpt')) return <Target className="h-4 w-4" />;
    if (title.includes('vl') || title.includes('suppression')) return <TestTube className="h-4 w-4" />;
    if (title.includes('tested')) return <CheckCircle className="h-4 w-4" />;
    return <BarChart3 className="h-4 w-4" />;
  };

  const getIndicatorColor = (indicator) => {
    const title = indicator.Indicator?.toLowerCase() || '';
    if (title.includes('active') && title.includes('art')) return 'text-primary';
    if (title.includes('enrolled') || title.includes('initiated')) return 'text-success';
    if (title.includes('transfer')) return 'text-warning';
    if (title.includes('lost') || title.includes('ltfu')) return 'text-warning';
    if (title.includes('dead')) return 'text-destructive';
    if (title.includes('mmd') || title.includes('tld')) return 'text-secondary';
    if (title.includes('tpt')) return 'text-success';
    if (title.includes('vl') || title.includes('suppression')) return 'text-info';
    return 'text-muted-foreground';
  };

  const getIndicatorBgColor = (indicator) => {
    const title = indicator.Indicator?.toLowerCase() || '';
    if (title.includes('active') && title.includes('art')) return 'bg-primary-light';
    if (title.includes('enrolled') || title.includes('initiated')) return 'bg-success-light';
    if (title.includes('transfer')) return 'bg-warning-light';
    if (title.includes('lost') || title.includes('ltfu')) return 'bg-warning-light';
    if (title.includes('dead')) return 'bg-destructive-light';
    if (title.includes('mmd') || title.includes('tld')) return 'bg-secondary-light';
    if (title.includes('tpt')) return 'bg-success-light';
    if (title.includes('vl') || title.includes('suppression')) return 'bg-info-light';
    return 'bg-muted';
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return parseInt(num).toLocaleString();
  };

  // Chart data preparation functions
  const preparePieChartData = (indicator) => {
    const total = Number(indicator.TOTAL) || 0;
    const male014 = Number(indicator.Male_0_14) || 0;
    const female014 = Number(indicator.Female_0_14) || 0;
    const male15Plus = Number(indicator.Male_over_14) || 0;
    const female15Plus = Number(indicator.Female_over_14) || 0;
    
    // Calculate percentages for meaningful visualization
    const data = [
      { 
        name: 'Male 0-14', 
        value: male014, 
        percentage: total > 0 ? ((male014 / total) * 100).toFixed(1) : 0,
        fill: chartColors.male 
      },
      { 
        name: 'Female 0-14', 
        value: female014, 
        percentage: total > 0 ? ((female014 / total) * 100).toFixed(1) : 0,
        fill: chartColors.female 
      },
      { 
        name: 'Male 15+', 
        value: male15Plus, 
        percentage: total > 0 ? ((male15Plus / total) * 100).toFixed(1) : 0,
        fill: chartColors.maleOver14 
      },
      { 
        name: 'Female 15+', 
        value: female15Plus, 
        percentage: total > 0 ? ((female15Plus / total) * 100).toFixed(1) : 0,
        fill: chartColors.femaleOver14 
      },
    ];
    
    // If all values are 0, show a single slice with the total
    if (total === 0) {
      return [{ name: 'No Data', value: 1, fill: '#e5e7eb', percentage: 0 }];
    }
    
    // Filter out zero values but keep at least one item
    const filteredData = data.filter(item => item.value > 0);
    
    // If no valid data, return a single "No Data" slice
    if (filteredData.length === 0) {
      return [{ name: 'No Data', value: 1, fill: '#e5e7eb', percentage: 0 }];
    }
    
    // If only one data point, add a small complementary slice for better visualization
    if (filteredData.length === 1) {
      const singleItem = filteredData[0];
      return [
        singleItem,
        { 
          name: 'Other', 
          value: Math.max(1, Math.round(singleItem.value * 0.1)), 
          fill: '#e5e7eb', 
          percentage: 0 
        }
      ];
    }
    
    return filteredData;
  };

  const prepareBarChartData = (indicator) => {
    const total = indicator.TOTAL || 0;
    const male014 = indicator.Male_0_14 || 0;
    const female014 = indicator.Female_0_14 || 0;
    const male15Plus = indicator.Male_over_14 || 0;
    const female15Plus = indicator.Female_over_14 || 0;
    
    return [
      { 
        category: 'Male 0-14', 
        value: male014,
        percentage: total > 0 ? ((male014 / total) * 100).toFixed(1) : 0,
        color: chartColors.male
      },
      { 
        category: 'Female 0-14', 
        value: female014,
        percentage: total > 0 ? ((female014 / total) * 100).toFixed(1) : 0,
        color: chartColors.female
      },
      { 
        category: 'Male 15+', 
        value: male15Plus,
        percentage: total > 0 ? ((male15Plus / total) * 100).toFixed(1) : 0,
        color: chartColors.maleOver14
      },
      { 
        category: 'Female 15+', 
        value: female15Plus,
        percentage: total > 0 ? ((female15Plus / total) * 100).toFixed(1) : 0,
        color: chartColors.femaleOver14
      },
    ];
  };

  const prepareAreaChartData = (indicator) => {
    const total = indicator.TOTAL || 0;
    const male014 = indicator.Male_0_14 || 0;
    const female014 = indicator.Female_0_14 || 0;
    const male15Plus = indicator.Male_over_14 || 0;
    const female15Plus = indicator.Female_over_14 || 0;
    
    // Create age group distribution for area chart
    return [
      { 
        ageGroup: '0-14 Years', 
        male: male014, 
        female: female014,
        total: male014 + female014,
        malePercentage: total > 0 ? ((male014 / total) * 100).toFixed(1) : 0,
        femalePercentage: total > 0 ? ((female014 / total) * 100).toFixed(1) : 0
      },
      { 
        ageGroup: '15+ Years', 
        male: male15Plus, 
        female: female15Plus,
        total: male15Plus + female15Plus,
        malePercentage: total > 0 ? ((male15Plus / total) * 100).toFixed(1) : 0,
        femalePercentage: total > 0 ? ((female15Plus / total) * 100).toFixed(1) : 0
      },
    ];
  };

  const prepareLineChartData = (indicator) => {
    const total = indicator.TOTAL || 0;
    const male014 = indicator.Male_0_14 || 0;
    const female014 = indicator.Female_0_14 || 0;
    const male15Plus = indicator.Male_over_14 || 0;
    const female15Plus = indicator.Female_over_14 || 0;
    
    // Create age group data for line chart
    return [
      { 
        ageGroup: 'Male 0-14', 
        value: male014,
        percentage: total > 0 ? ((male014 / total) * 100).toFixed(1) : 0,
        color: chartColors.male
      },
      { 
        ageGroup: 'Female 0-14', 
        value: female014,
        percentage: total > 0 ? ((female014 / total) * 100).toFixed(1) : 0,
        color: chartColors.female
      },
      { 
        ageGroup: 'Male 15+', 
        value: male15Plus,
        percentage: total > 0 ? ((male15Plus / total) * 100).toFixed(1) : 0,
        color: chartColors.maleOver14
      },
      { 
        ageGroup: 'Female 15+', 
        value: female15Plus,
        percentage: total > 0 ? ((female15Plus / total) * 100).toFixed(1) : 0,
        color: chartColors.femaleOver14
      },
    ];
  };

  const getChartType = (indicator, index) => {
    if (chartView === 'pie') return 'pie';
    if (chartView === 'bar') return 'bar';
    if (chartView === 'line') return 'line';
    if (chartView === 'area') return 'area';
    
    // Mixed view - assign different chart types based on indicator type
    const title = indicator.Indicator?.toLowerCase() || '';
    if (title.includes('active') && title.includes('art')) return 'pie';
    if (title.includes('enrolled') || title.includes('initiated')) return 'bar';
    if (title.includes('transfer')) return 'line';
    if (title.includes('lost') || title.includes('ltfu')) return 'area';
    if (title.includes('mmd') || title.includes('tld')) return 'pie';
    if (title.includes('vl') || title.includes('suppression')) return 'bar';
    
    // Default rotation for remaining indicators
    const chartTypes = ['pie', 'bar', 'line', 'area'];
    return chartTypes[index % chartTypes.length];
  };

  // Chart rendering components
  const renderPieChart = (indicator) => {
    const data = preparePieChartData(indicator);
    
    // Fallback if no data
    if (!data || data.length === 0) {
      return (
        <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
          No data available
        </div>
      );
    }
    
    // Check if all values are 0
    const hasValidData = data.some(item => item.value > 0);
    if (!hasValidData) {
      return (
        <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
          No data to display
        </div>
      );
    }
    
    try {
      return (
        <ChartContainer config={chartConfig} className="h-[200px] rounded-sm">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={20}
                paddingAngle={2}
                startAngle={90}
                endAngle={450}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name, props) => [
                  `${value.toLocaleString()} (${props.payload?.percentage || 0}%)`, 
                  name
                ]}
              />
              <ChartLegend 
                content={<ChartLegendContent />}
                verticalAlign="bottom"
                height={36}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartContainer>
      );
    } catch (error) {
      console.error('Error rendering pie chart:', error);
      return (
        <div className="h-[200px] flex items-center justify-center text-red-500 text-sm">
          <div className="text-center">
            <div className="text-red-600 font-semibold">Chart Error</div>
            <div className="text-xs text-red-400 mt-1">Unable to render pie chart</div>
          </div>
        </div>
      );
    }
  };

  const renderBarChart = (indicator) => {
    const data = prepareBarChartData(indicator);
    
    return (
      <ChartContainer config={chartConfig} className="h-[200px] rounded-sm">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value, name, props) => [
              `${value.toLocaleString()} (${props.payload?.percentage || 0}%)`, 
              name
            ]}
          />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ChartContainer>
    );
  };

  const renderLineChart = (indicator) => {
    const data = prepareLineChartData(indicator);
    
    return (
      <ChartContainer config={chartConfig} className="h-[200px] rounded-sm">
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ageGroup" />
          <YAxis />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value, name, props) => [
              `${value.toLocaleString()} (${props.payload?.percentage || 0}%)`, 
              props.payload?.ageGroup || name
            ]}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={chartColors.primary} 
            strokeWidth={2}
            dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
          />
        </RechartsLineChart>
      </ChartContainer>
    );
  };

  const renderAreaChart = (indicator) => {
    const data = prepareAreaChartData(indicator);
    
    return (
      <ChartContainer config={chartConfig} className="h-[200px] rounded-sm">
        <RechartsAreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ageGroup" />
          <YAxis />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value, name, props) => [
              `${value.toLocaleString()} (${props.payload?.[`${name}Percentage`] || 0}%)`, 
              name === 'male' ? 'Male' : 'Female'
            ]}
          />
          <Area 
            type="monotone" 
            dataKey="male" 
            stackId="1" 
            stroke={chartColors.male} 
            fill={chartColors.male}
            fillOpacity={0.6}
            name="male"
          />
          <Area 
            type="monotone" 
            dataKey="female" 
            stackId="1" 
            stroke={chartColors.female} 
            fill={chartColors.female}
            fillOpacity={0.6}
            name="female"
          />
        </RechartsAreaChart>
      </ChartContainer>
    );
  };

  const renderChart = (indicator, index) => {
    const chartType = getChartType(indicator, index);
    
    switch (chartType) {
      case 'pie':
        return renderPieChart(indicator);
      case 'bar':
        return renderBarChart(indicator);
      case 'line':
        return renderLineChart(indicator);
      case 'area':
        return renderAreaChart(indicator);
      default:
        return renderBarChart(indicator);
    }
  };

  // Show loading skeleton only on initial load or when no data exists
  if (loading && (isInitialLoad || allIndicators.length === 0)) {
    return <IndicatorsDashboardSkeleton />;
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className=" border-b border-gray-200">
        <div className="max-w-7xl mx-auto p-0 sm:px-0 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">ART Indicators</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {selectedSite ? `${selectedSite.name} (${selectedSite.code})` : 'All Sites'} - Comprehensive performance metrics
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <span className="truncate">{dateRange.startDate} - {dateRange.endDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">View: {chartView}</div>
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <Button
                    variant={chartView === 'mixed' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setChartView('mixed')}
                    className="h-6 px-2 text-xs"
                  >
                    Mixed
                  </Button>
                  <Button
                    variant={chartView === 'pie' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setChartView('pie')}
                    className="h-6 px-2 text-xs"
                  >
                    <PieChart className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={chartView === 'bar' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setChartView('bar')}
                    className="h-6 px-2 text-xs"
                  >
                    <BarChart3 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={chartView === 'line' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setChartView('line')}
                    className="h-6 px-2 text-xs"
                  >
                    <LineChart className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={chartView === 'area' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setChartView('area')}
                    className="h-6 px-2 text-xs"
                  >
                    <AreaChart className="h-3 w-3" />
                  </Button>
                </div>
                <Button 
                  onClick={handleRefresh} 
                  disabled={loading} 
                  variant="outline" 
                  size="sm"
                  className="h-7 sm:h-8 w-full sm:w-auto text-xs sm:text-sm"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector - Year, Quarter, and Site */}
      <div className="w-full px-0 sm:px-0 lg:px-8 py-4 sm:py-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-3 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Report Filters</h3>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Configure your reporting period and site selection</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Year Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  <span className="hidden sm:inline">Year:</span>
                  <span className="sm:hidden">Year</span>
                </Label>
                <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-full sm:w-28 h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  <span className="hidden sm:inline">Quarter:</span>
                  <span className="sm:hidden">Quarter</span>
                </Label>
                <Select value={selectedQuarter.toString()} onValueChange={handleQuarterChange}>
                  <SelectTrigger className="w-full sm:w-36 h-9 border-gray-300 focus:border-green-500 focus:ring-green-500">
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

              {/* Site Filter */}
              <div className="sm:col-span-2 lg:col-span-1">
                <SiteFilter
                  sites={sites}
                  selectedSite={selectedSite}
                  onSiteChange={setSelectedSite}
                  disabled={sitesLoading}
                  showAllOption={true}
                  variant="compact"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="status-critical rounded-lg p-3">
            <p className="text-xs sm:text-sm text-foreground">{error}</p>
          </div>
        </div>
      )}

      {/* Charts Grid - Modern Dashboard Style */}
      <div className="w-full px-0 sm:px-0 lg:px-8 py-3 sm:py-4">
        {/* Subtle loading overlay for subsequent loads */}
        {loading && !isInitialLoad && allIndicators.length > 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center transition-opacity duration-300 ease-in-out">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700 bg-white/80 px-3 sm:px-4 py-2 rounded-full shadow-lg">
              <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
              <span className="font-medium">Updating data...</span>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {allIndicators.map((indicator, index) => (
            <Card
              key={index}
              onClick={() => fetchIndicatorDetails(indicator)}
              className={`${getIndicatorBgColor(indicator)} card-interactive animate-fade-in flex flex-col`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <div className={`${getIndicatorColor(indicator)} flex-shrink-0 mt-0.5`}>
                      {getIndicatorIcon(indicator)}
                    </div>
                    <CardTitle className="text-xs sm:text-sm font-medium text-foreground leading-tight break-words">
                      {indicator.Indicator}
                    </CardTitle>
                  </div>
                  {indicator.error && (
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 ml-2" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className={`text-lg sm:text-xl font-bold ${getIndicatorColor(indicator)} transition-all duration-500 ease-out`}>
                    {formatNumber(indicator.TOTAL)}
                  </div>
                  <Badge 
                    variant={indicator.error ? "destructive" : "default"} 
                    className={`text-xs ${indicator.error ? 'animate-pulse' : 'status-active'}`}
                  >
                    {indicator.error ? 'Error' : 'Active'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex flex-col overflow-hidden">
                <div key={`${chartView}-${index}`} className="flex-1 flex items-center justify-center min-h-[180px] max-h-[220px] w-full p-1">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-full h-full max-w-full max-h-full flex items-center justify-center">
                      {renderChart(indicator, index)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Details Modal */}
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
      />
    </div>
  );
};


export default IndicatorsDashboard;
