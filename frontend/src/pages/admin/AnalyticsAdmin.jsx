import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import YearlyAnalytics from '../../components/analytics/YearlyAnalytics';
import analyticsApi from '../../services/analyticsApi';
import { 
  RefreshCw,
  Activity,
  Download,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Function to get bilingual indicator names (Khmer/English) - same as IndicatorsTable
const getDisplayIndicatorName = (backendName) => {
  const nameMap = {
    // Original numbered versions
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
    '10.8. VL suppression': '10.8. ចំនួនអ្នកជំងឺដែលមានលទ្ធផល VL ចុងក្រោយតិចជាង 1000 copies (Last VL is suppressed)',
    
    // Non-numbered versions (from analytics data)
    'Active ART patients in previous quarter': '1. ចំនួនអ្នកជំងឺ ART សកម្មដល់ចុងត្រីមាសមុន (Number of active ART patients in previous quarter)',
    'Active Pre-ART patients in previous quarter': '2. ចំនួនអ្នកជំងឺ Pre-ART សកម្មដល់ចុងត្រីមាសមុន (Number of active Pre-ART patients in previous quarter)',
    'Newly Enrolled': '3. ចំនួនអ្នកជំងឺចុះឈ្មោះថ្មី (Number of newly enrolled patients)',
    'Re-tested positive': '4. ចំនួនអ្នកជំងឺដែលវិជ្ជមានពីតេស្តបញ្ជាក់ (Number of patient re-tested positive)',
    'Newly Initiated': '5. ចំនួនអ្នកជំងឺចាប់ផ្តើមព្យាបាលដោយ ARV ថ្មី (Number of newly initiated ART)',
    'New ART started: Same day': '5.1.1. ក្នុងថ្ងៃតែមួយ (Same day – 0 day)',
    'New ART started: 1-7 days': '5.1.2. ពី ១ ទៅ ៧ ថ្ងៃ (1–7 days)',
    'New ART started: >7 days': '5.1.3. ច្រើនជាង ៧ ថ្ងៃ (>7 days)',
    'New ART started with TLD': '5.2. ចំនួនអ្នកជំងឹចាប់ផ្តើមព្យាបាលថ្មីដោយ TDF+3TC+DTG (Number of new ART started with TLD)',
    'Transfer-in patients': '6. ចំនួនអ្នកជំងឺដែលបានបញ្ជូនចូល (Number of transfer-in patients)',
    'Lost and Return': '7. ចំនួនអ្នកជំងឺដែលបានបោះបង់ហើយត្រឡប់មកវិញ (Number of Lost-Return patients)',
    'Dead': '8.1. ចំនួនអ្នកជំងឺដែលបានស្លាប់ (Dead)',
    'Lost to follow up (LTFU)': '8.2. ចំនួនអ្នកជំងឺដែលបានបោះបង់ (Lost to follow up – LTFU)',
    'Transfer-out': '8.3. ចំនួនអ្នកជំងឺដែលបានបញ្ជូនចេញ (Transfer-out)',
    'Active Pre-ART': '9. ចំនួនអ្នកជំងឺ Pre-ART សកម្មដល់ចុងត្រីមាសនេះ (Number of active Pre-ART patients in this quarter)',
    'Active ART patients in this quarter': '10. ចំនួនអ្នកជំងឺ ART សកម្មដល់ចុងត្រីមាសនេះ (Number of active ART patients in this quarter)',
    'Eligible MMD': '10.1. ចំនួនអ្នកជំងឺដែលសមស្របសំរាប់ការផ្តល់ថ្នាំរយៈពេលវែង (Eligible for Multi Month Dispensing – MMD)',
    'MMD': '10.2. ចំនួនអ្នកជំងឺកំពុងទទួលថ្នាំរយៈពេលវែង (Number of patients received MMD)',
    'TLD': '10.3. ចំនួនអ្នកជំងឺកំពុងទទួលការព្យាបាលដោយ TLD (Number of patients received TLD)',
    'TPT Start': '10.4. ចំនួនអ្នកជំងឺដែលបានចាប់ផ្តើមការបង្ការជំងឺរបេង (Number of patients started TPT)',
    'TPT Complete': '10.5. ចំនួនអ្នកជំងឺដែលបានបញ្ចប់ការបង្ការជំងឺរបេង (Number of patients completed TPT)',
    'Eligible for VL test': '10.6. ចំនួនអ្នកជំងឺដែលសមស្របធ្វើតេស្ត Viral Load (Eligible for Viral Load test)',
    'VL tested in 12M': '10.7. ចំនួនអ្នកជំងឺធ្វើតេស្ត Viral Load ក្នុងរយៈពេល ១២ ខែចុងក្រោយ (Receive VL test in last 12 months)',
    'VL suppression': '10.8. ចំនួនអ្នកជំងឺដែលមានលទ្ធផល VL ចុងក្រោយតិចជាង 1000 copies (Last VL is suppressed)',
    
    // Database-generated names (from backend processing)
    'active art previous': '1. ចំនួនអ្នកជំងឺ ART សកម្មដល់ចុងត្រីមាសមុន (Number of active ART patients in previous quarter)',
    'active pre art previous': '2. ចំនួនអ្នកជំងឺ Pre-ART សកម្មដល់ចុងត្រីមាសមុន (Number of active Pre-ART patients in previous quarter)',
    'newly enrolled': '3. ចំនួនអ្នកជំងឺចុះឈ្មោះថ្មី (Number of newly enrolled patients)',
    'retested positive': '4. ចំនួនអ្នកជំងឺដែលវិជ្ជមានពីតេស្តបញ្ជាក់ (Number of patient re-tested positive)',
    'newly initiated': '5. ចំនួនអ្នកជំងឺចាប់ផ្តើមព្យាបាលដោយ ARV ថ្មី (Number of newly initiated ART)',
    'art same day': '5.1.1. ក្នុងថ្ងៃតែមួយ (Same day – 0 day)',
    'art 1 7 days': '5.1.2. ពី ១ ទៅ ៧ ថ្ងៃ (1–7 days)',
    'art over 7 days': '5.1.3. ច្រើនជាង ៧ ថ្ងៃ (>7 days)',
    'art with tld': '5.2. ចំនួនអ្នកជំងឹចាប់ផ្តើមព្យាបាលថ្មីដោយ TDF+3TC+DTG (Number of new ART started with TLD)',
    'transfer in': '6. ចំនួនអ្នកជំងឺដែលបានបញ្ជូនចូល (Number of transfer-in patients)',
    'lost and return': '7. ចំនួនអ្នកជំងឺដែលបានបោះបង់ហើយត្រឡប់មកវិញ (Number of Lost-Return patients)',
    'dead': '8.1. ចំនួនអ្នកជំងឺដែលបានស្លាប់ (Dead)',
    'lost to followup': '8.2. ចំនួនអ្នកជំងឺដែលបានបោះបង់ (Lost to follow up – LTFU)',
    'transfer out': '8.3. ចំនួនអ្នកជំងឺដែលបានបញ្ជូនចេញ (Transfer-out)',
    'active pre art': '9. ចំនួនអ្នកជំងឺ Pre-ART សកម្មដល់ចុងត្រីមាសនេះ (Number of active Pre-ART patients in this quarter)',
    'active art current': '10. ចំនួនអ្នកជំងឺ ART សកម្មដល់ចុងត្រីមាសនេះ (Number of active ART patients in this quarter)',
    'eligible mmd': '10.1. ចំនួនអ្នកជំងឺដែលសមស្របសំរាប់ការផ្តល់ថ្នាំរយៈពេលវែង (Eligible for Multi Month Dispensing – MMD)',
    'mmd': '10.2. ចំនួនអ្នកជំងឺកំពុងទទួលថ្នាំរយៈពេលវែង (Number of patients received MMD)',
    'tld': '10.3. ចំនួនអ្នកជំងឺកំពុងទទួលការព្យាបាលដោយ TLD (Number of patients received TLD)',
    'tpt start': '10.4. ចំនួនអ្នកជំងឺដែលបានចាប់ផ្តើមការបង្ការជំងឺរបេង (Number of patients started TPT)',
    'tpt complete': '10.5. ចំនួនអ្នកជំងឺដែលបានបញ្ចប់ការបង្ការជំងឺរបេង (Number of patients completed TPT)',
    'eligible vl test': '10.6. ចំនួនអ្នកជំងឺដែលសមស្របធ្វើតេស្ត Viral Load (Eligible for Viral Load test)',
    'vl tested 12m': '10.7. ចំនួនអ្នកជំងឺធ្វើតេស្ត Viral Load ក្នុងរយៈពេល ១២ ខែចុងក្រោយ (Receive VL test in last 12 months)',
    'vl suppression': '10.8. ចំនួនអ្នកជំងឺដែលមានលទ្ធផល VL ចុងក្រោយតិចជាង 1000 copies (Last VL is suppressed)'
  };
  return nameMap[backendName] || backendName;
};

const AnalyticsAdmin = () => {
  const [summary, setSummary] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sites, setSites] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [years, setYears] = useState([]);
  const [filters, setFilters] = useState(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;
    // Always use the last completed quarter
    const lastCompletedQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
    const lastCompletedYear = currentQuarter === 1 ? currentYear - 1 : currentYear;
    
    return {
      indicatorId: 'all',
      siteCode: 'all',
      periodType: 'quarterly',
      periodQuarter: lastCompletedQuarter,
      periodYear: lastCompletedYear.toString()
    };
  });

  // Time picker states
  const [isPeriodPickerOpen, setIsPeriodPickerOpen] = useState(false);
  const [showYearGrid, setShowYearGrid] = useState(false);
  const [currentDecade, setCurrentDecade] = useState(2020);
  const pickerRef = useRef(null);

  // Helper functions for time picker
  const generateDecadeYears = () => {
    const years = [];
    for (let i = currentDecade; i < currentDecade + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const decadeYears = generateDecadeYears();

  const isYearAvailable = (year) => {
    return years.some(y => y.period_year === year);
  };

  const isYearInCurrentDecade = (year) => {
    return year >= currentDecade && year < currentDecade + 10;
  };

  const availableQuarters = [
    { value: 1, label: 'Q1', disabled: false },
    { value: 2, label: 'Q2', disabled: false },
    { value: 3, label: 'Q3', disabled: false },
    { value: 4, label: 'Q4', disabled: false }
  ];

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsPeriodPickerOpen(false);
        setShowYearGrid(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Time picker handlers
  const onYearChange = (year) => {
    setFilters({...filters, periodYear: year});
    setShowYearGrid(false);
  };

  const onQuarterChange = (quarter) => {
    setFilters({...filters, periodQuarter: parseInt(quarter)});
    setIsPeriodPickerOpen(false);
    setShowYearGrid(false);
  };

  // Fetch analytics summary
  const fetchSummary = async () => {
    try {
      const data = await analyticsApi.getAnalyticsSummary();
      
      if (data.success) {
        setSummary(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch analytics summary');
      }
    } catch (err) {
      setError('Failed to connect to analytics service');
      console.error('Analytics summary error:', err);
    }
  };

  // Fetch analytics data with filters
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Process filters to handle "all" values
      const processedFilters = {
        indicatorId: filters.indicatorId === 'all' ? '' : filters.indicatorId,
        siteCode: filters.siteCode === 'all' ? '' : filters.siteCode,
        periodType: filters.periodType,
        periodQuarter: filters.periodQuarter === 'all' ? '' : filters.periodQuarter,
        periodYear: filters.periodYear === 'all' ? '' : filters.periodYear
      };
      
      console.log('🔍 Analytics Admin - Fetching data with filters:', processedFilters);

      const data = await analyticsApi.getAllAnalyticsData(processedFilters);
      

      
      if (data.success) {
        setAnalyticsData(data.data);
        setError(null);
        console.log('🔍 Analytics Admin - Set analytics data:', data.data.length, 'records');
      } else {
        setError(data.message || 'Failed to fetch analytics data');
        console.error('🔍 Analytics Admin - API error:', data.message);
      }
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('🔍 Analytics Admin - Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };


  // Export analytics data
  const exportAnalyticsData = () => {
    const csvContent = [
      ['Indicator ID', 'Indicator Name', 'Site Code', 'Site Name', 'Period Type', 'Period Year', 'Period Quarter', 'Total', 'Male 0-14', 'Female 0-14', 'Male 15+', 'Female 15+', 'Status', 'Last Updated'],
      ...analyticsData.map(record => [
        record.indicator_id,
        record.indicator_name,
        record.site_code,
        record.site_name,
        record.period_type,
        record.period_year,
        record.period_quarter || '',
        record.total,
        record.male_0_14,
        record.female_0_14,
        record.male_over_14,
        record.female_over_14,
        record.calculation_status,
        new Date(record.last_updated).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Clear cache function (now includes auto-increment reset)
  const clearCache = async () => {
    if (window.confirm('Are you sure you want to clear all cached analytics data and reset auto-increment IDs? This action cannot be undone.')) {
      try {
        // Clear cache first
        const clearResponse = await analyticsApi.clearCache();
        
        if (clearResponse.success) {
          // Then reset auto-increment IDs
          const resetResponse = await analyticsApi.resetAutoIncrement();
          
          if (resetResponse.success) {
            alert('Cache cleared and auto-increment IDs reset successfully!');
            // Refresh the data
            fetchAnalyticsData();
            fetchSummary();
          } else {
            alert('Cache cleared but failed to reset auto-increment IDs');
            // Still refresh data since cache was cleared
            fetchAnalyticsData();
            fetchSummary();
          }
        } else {
          alert('Failed to clear cache');
        }
      } catch (error) {
        console.error('Error clearing cache and resetting IDs:', error);
        alert('Error clearing cache and resetting IDs');
      }
    }
  };


  // Fetch sites for dropdown
  const fetchSites = async () => {
    try {
      const data = await analyticsApi.getAnalyticsSites();
      if (data.success) {
        setSites(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch sites:', err);
    }
  };

  // Fetch available indicators
  const fetchIndicators = async () => {
    try {
      const data = await analyticsApi.getAnalyticsIndicators();
      if (data.success) {
        setIndicators(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch indicators:', err);
    }
  };

  // Fetch available years from analytics data
  const fetchYears = async () => {
    try {
      const data = await analyticsApi.getAnalyticsYears();
      if (data.success) {
        setYears(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch years:', err);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchAnalyticsData();
    fetchSites();
    fetchIndicators();
    fetchYears();
  }, []);


  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics admin...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>{summary?.completedRecords || 0} / {summary?.totalRecords || 0}</span>
          <Badge variant={summary?.successRate > 90 ? "default" : "secondary"}>
            {summary?.successRate || 0}%
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data">Analytics Data</TabsTrigger>
          <TabsTrigger value="yearly">Yearly Analytics</TabsTrigger>
        </TabsList>

        {/* Analytics Data Tab */}
        <TabsContent value="data" className="space-y-4">
          {/* Compact Filters */}
          <Card className="shadow-none rounded-none">
            <CardContent className=" py-3">
              <div className="flex items-center space-x-4">
                <Select value={filters.indicatorId} onValueChange={(value) => setFilters({...filters, indicatorId: value})}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="សុចនាករ Indicator" />
                  </SelectTrigger>
                  <SelectContent className="overflow-y-auto max-h-48 ">
                    <SelectItem value="all">សុចនាករទាំងអស់ All Indicators</SelectItem>
                    {indicators.map((indicator) => (
                      <SelectItem key={indicator.indicator_id} value={indicator.indicator_id}>
                        {getDisplayIndicatorName(indicator.indicator_name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.siteCode} onValueChange={(value) => setFilters({...filters, siteCode: value})}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Site" />
                  </SelectTrigger>
                  <SelectContent className="overflow-y-auto max-h-48">
                    <SelectItem value="all">All Sites</SelectItem>
                    {sites.map((site) => (
                      <SelectItem key={site.site_code} value={site.site_code}>
                        {site.site_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Custom Time Picker */}
                <div className="relative">
                  <input
                    type="text"
                    value={filters.periodYear === 'all' ? 'All Years' : `${filters.periodYear}-Q${filters.periodQuarter}`}
                    readOnly
                    className="w-32 h-10 px-3 pr-10 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 cursor-pointer transition-colors"
                    onClick={() => setIsPeriodPickerOpen(!isPeriodPickerOpen)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>

                  {/* Custom Period Picker Panel */}
                  {isPeriodPickerOpen && (
                    <div ref={pickerRef} className="absolute top-full left-0 right-0 z-50 mt-2 bg-background border border-border rounded-xl shadow-xl p-6 min-w-[320px]">
                      {/* Year Navigation */}
                      <div className="flex items-center justify-between mb-6">
                        <Button
                          type="button"
                          onClick={() => setCurrentDecade(currentDecade - 10)}
                          variant="ghost"
                          size="sm"
                          className="p-2 rounded-lg hover:bg-primary transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-primary" />
                        </Button>
                        
                        <Button
                          type="button"
                          onClick={() => setShowYearGrid(!showYearGrid)}
                          variant="ghost"
                          className="px-4 py-2 text-base font-semibold hover:text-blue-500 rounded-lg transition-colors cursor-pointer"
                        >
                          {filters.periodYear === 'all' ? 'All Years' : filters.periodYear}
                        </Button>
                        
                        <Button
                          type="button"
                          onClick={() => setCurrentDecade(currentDecade + 10)}
                          variant="ghost"
                          size="sm"
                          className="p-2 rounded-lg hover:bg-primary transition-colors text-primary"
                        >
                          <ChevronRight className="w-4 h-4 text-primary" />
                        </Button>
                      </div>

                      {/* Year Grid - Conditionally Visible */}
                      {showYearGrid && (
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <Button
                            key="all"
                            type="button"
                            onClick={() => onYearChange('all')}
                            variant={filters.periodYear === 'all' ? "default" : "ghost"}
                            size="sm"
                            className={`
                              px-3 py-2 text-sm rounded-md transition-all duration-200
                              ${filters.periodYear === 'all'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                              }
                            `}
                          >
                            All
                          </Button>
                          {decadeYears.map((year) => {
                            const isSelected = year.toString() === filters.periodYear;
                            const isAvailable = isYearAvailable(year);
                            const isCurrentYear = year === new Date().getFullYear();
                            const isInCurrentDecade = isYearInCurrentDecade(year);
                            
                            return (
                              <Button
                                key={year}
                                type="button"
                                onClick={() => {
                                  if (isAvailable) {
                                    onYearChange(year.toString());
                                  }
                                }}
                                disabled={!isAvailable}
                                variant={isSelected ? "default" : "ghost"}
                                size="sm"
                                className={`
                                  px-3 py-2 text-sm rounded-md transition-all duration-200 relative
                                  ${isSelected
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : isCurrentYear && isAvailable && isInCurrentDecade
                                    ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                    : isAvailable && isInCurrentDecade
                                    ? 'text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                                    : isAvailable && !isInCurrentDecade
                                    ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    : 'text-gray-300 cursor-not-allowed'
                                  }
                                `}
                              >
                                {year}
                                {isCurrentYear && isAvailable && !isSelected && isInCurrentDecade && (
                                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
                                )}
                              </Button>
                            );
                          })}
                        </div>
                      )}

                      {/* Quarter Selection */}
                      <div className="grid grid-cols-4 gap-2">
                        {availableQuarters.map(quarter => (
                          <Button
                            key={quarter.value}
                            type="button"
                            onClick={() => onQuarterChange(quarter.value.toString())}
                            disabled={quarter.disabled}
                            variant={filters.periodQuarter === quarter.value ? "default" : "outline"}
                            size="sm"
                            className={`
                              px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium
                              ${filters.periodQuarter === quarter.value
                                ? 'bg-blue-500 text-white shadow-md'
                                : quarter.disabled
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:border-gray-300'
                              }
                            `}
                          >
                            Q{quarter.value}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 ml-auto">
                  <Button onClick={fetchAnalyticsData} disabled={loading} size="sm">
                    <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Apply
                  </Button>
                  <Button onClick={clearCache} variant="outline" size="sm" className="text-red-600" title="Clear cache and reset auto-increment IDs">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear & Reset
                  </Button>
                  {/* <Button onClick={exportAnalyticsData} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compact Data Table */}
          <Card className="shadow-none rounded-none">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-3 font-medium">សុចនាករ Indicator</th>
                      <th className="text-left p-3 font-medium">កន្លែង Site</th>
                      <th className="text-left p-3 font-medium">រយៈពេល Period</th>
                      <th className="text-right p-3 font-medium">សរុប Total</th>
                      <th className="text-center p-3 font-medium">ស្ថានភាព Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-muted-foreground">
                          <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                          Loading...
                        </td>
                      </tr>
                    ) : analyticsData.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-muted-foreground">
                          No data found
                        </td>
                      </tr>
                    ) : (
                      analyticsData.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{getDisplayIndicatorName(record.indicator_name)}</div>
                            <div className="text-xs text-muted-foreground">{record.indicator_id}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium">{record.site_name}</div>
                            <div className="text-xs text-muted-foreground">{record.site_code}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium">{record.period_type} {record.period_year}</div>
                            <div className="text-xs text-muted-foreground">
                              Q{record.period_quarter}
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="font-medium">{record.total.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              M: {record.male_0_14 + record.male_over_14} | F: {record.female_0_14 + record.female_over_14}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant={record.calculation_status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                              {record.calculation_status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Yearly Analytics Tab */}
        <TabsContent value="yearly" className="space-y-4">
          <YearlyAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsAdmin;
