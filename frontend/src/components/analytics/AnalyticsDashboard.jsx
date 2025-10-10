import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Database,
  Activity
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch('/apiv1/analytics/summary');
      const data = await response.json();
      
      if (data.success) {
        setSummary(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch analytics summary');
      }
    } catch (err) {
      setError('Failed to connect to analytics service');
    } finally {
      setLoading(false);
    }
  };

  const triggerCalculation = async () => {
    try {
      setLoading(true);
      // Trigger a sample calculation for current quarter
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentQuarter = Math.ceil((currentDate.getMonth() + 1) / 3);
      
      const period = {
        periodType: 'quarterly',
        periodYear: currentYear,
        periodQuarter: currentQuarter,
        startDate: '2025-07-01',
        endDate: '2025-09-30',
        previousEndDate: '2025-06-30'
      };

      const response = await fetch('/apiv1/analytics/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          indicatorId: '1',
          siteCode: '2101',
          period: period,
          options: { forceRefresh: true }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh summary after calculation
        await fetchSummary();
      } else {
        setError(data.message || 'Failed to trigger calculation');
      }
    } catch (err) {
      setError('Failed to trigger calculation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Analytics Error</h3>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchSummary} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4" />;
      case 'unhealthy': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Engine</h1>
          <p className="text-gray-600 mt-1">Pre-calculated indicator values for fast reporting</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchSummary} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={triggerCalculation} disabled={loading}>
            <Activity className="h-4 w-4 mr-2" />
            Test Calculation
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalRecords?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Pre-calculated indicators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary?.completedRecords?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Successfully calculated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary?.failedRecords?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Calculation errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summary?.successRate || 0}%</div>
            <p className="text-xs text-muted-foreground">Calculation success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Status and Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Engine Status</span>
                <Badge className={getStatusColor(summary?.successRate > 90 ? 'healthy' : 'degraded')}>
                  {getStatusIcon(summary?.successRate > 90 ? 'healthy' : 'degraded')}
                  <span className="ml-1">{summary?.successRate > 90 ? 'Healthy' : 'Degraded'}</span>
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-muted-foreground">
                  {summary?.lastUpdated ? new Date(summary.lastUpdated).toLocaleString() : 'Never'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending Calculations</span>
                <span className="text-sm text-muted-foreground">{summary?.pendingRecords || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Data Freshness</span>
                <span className="text-sm text-muted-foreground">
                  {summary?.lastUpdated ? 
                    `${Math.floor((Date.now() - new Date(summary.lastUpdated).getTime()) / (1000 * 60 * 60))} hours ago` : 
                    'Unknown'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage Efficiency</span>
                <span className="text-sm text-muted-foreground">
                  {summary?.totalRecords > 0 ? 
                    `${Math.round((summary.completedRecords / summary.totalRecords) * 100)}%` : 
                    '0%'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Error Rate</span>
                <span className="text-sm text-muted-foreground">
                  {summary?.totalRecords > 0 ? 
                    `${Math.round((summary.failedRecords / summary.totalRecords) * 100)}%` : 
                    '0%'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => window.open('/apiv1/analytics/health', '_blank')} 
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <Activity className="h-6 w-6 mb-2" />
              <span>Health Check</span>
            </Button>
            <Button 
              onClick={() => window.open('/apiv1/analytics/data', '_blank')} 
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <Database className="h-6 w-6 mb-2" />
              <span>View Data</span>
            </Button>
            <Button 
              onClick={triggerCalculation} 
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              disabled={loading}
            >
              <RefreshCw className={`h-6 w-6 mb-2 ${loading ? 'animate-spin' : ''}`} />
              <span>Test Calculation</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
