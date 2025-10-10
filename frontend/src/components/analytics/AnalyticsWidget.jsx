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
  Activity,
  Zap
} from 'lucide-react';

const AnalyticsWidget = () => {
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

  const triggerQuickCalculation = async () => {
    try {
      setLoading(true);
      const response = await fetch('/apiv1/analytics/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          indicatorId: '1',
          siteCode: '2101',
          period: {
            periodType: 'quarterly',
            periodYear: 2025,
            periodQuarter: 2,
            startDate: '2025-04-01',
            endDate: '2025-06-30',
            previousEndDate: '2025-03-31'
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchSummary();
        alert('Quick calculation completed!');
      } else {
        alert(`Calculation failed: ${data.message}`);
      }
    } catch (err) {
      alert('Failed to trigger calculation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading && !summary) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 mb-2">Analytics Error</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchSummary} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Analytics Engine
          </CardTitle>
          {/* <div className="flex space-x-2">
            <Button onClick={fetchSummary} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={triggerQuickCalculation} size="sm" disabled={loading}>
              <Zap className="h-4 w-4 mr-1" />
              Quick Calc
            </Button>
          </div> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status Row */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">System Status</span>
            <Badge className={getStatusColor(summary?.successRate > 90 ? 'healthy' : 'degraded')}>
              {getStatusIcon(summary?.successRate > 90 ? 'healthy' : 'degraded')}
              <span className="ml-1">{summary?.successRate > 90 ? 'Healthy' : 'Degraded'}</span>
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{summary?.totalRecords || 0}</div>
              <div className="text-xs text-gray-500">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary?.completedRecords || 0}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary?.failedRecords || 0}</div>
              <div className="text-xs text-gray-500">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{summary?.successRate || 0}%</div>
              <div className="text-xs text-gray-500">Success Rate</div>
            </div>
          </div>

          {/* Performance Info */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Last Updated</span>
              <span className="text-gray-700">
                {summary?.lastUpdated ? 
                  `${Math.floor((Date.now() - new Date(summary.lastUpdated).getTime()) / (1000 * 60 * 60))}h ago` : 
                  'Never'
                }
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-500">Data Freshness</span>
              <span className="text-gray-700">
                {summary?.lastUpdated ? 
                  `${Math.floor((Date.now() - new Date(summary.lastUpdated).getTime()) / (1000 * 60))}m ago` : 
                  'Unknown'
                }
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t">
            <div className="flex space-x-2">
              <Button 
                onClick={() => window.open('/analytics-admin', '_blank')} 
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                <Database className="h-4 w-4 mr-1" />
                Admin Panel
              </Button>
              <Button 
                onClick={() => window.open('/apiv1/analytics/health', '_blank')} 
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                <Activity className="h-4 w-4 mr-1" />
                Health Check
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsWidget;
