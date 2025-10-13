import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Activity, Filter, RefreshCw, Download, Eye, Search, Calendar, User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import userLogsApi from '../services/userLogsApi';

const UserLogs = ({ users = [] }) => {
  // User logs state
  const [userLogs, setUserLogs] = useState([]);
  const [logStats, setLogStats] = useState(null);
  const [logsLoading, setLogsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalLogs, setTotalLogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(25);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);
  
  const [logFilters, setLogFilters] = useState({
    page: 1,
    limit: 25,
    userId: 'all',
    action: 'all',
    startDate: '',
    endDate: '',
    search: ''
  });

  useEffect(() => {
    fetchUserLogs();
    fetchLogStats();
  }, []);

  useEffect(() => {
    fetchUserLogs();
  }, [logFilters, currentPage, logsPerPage]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchUserLogs();
        fetchLogStats();
      }, 30000); // Refresh every 30 seconds
      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh]);

  // Fetch user logs
  const fetchUserLogs = async () => {
    try {
      setLogsLoading(true);
      // Filter out "all" values and empty strings
      const filters = { 
        ...logFilters, 
        page: currentPage, 
        limit: logsPerPage,
        search: searchTerm 
      };
      if (filters.userId === 'all') filters.userId = '';
      if (filters.action === 'all') filters.action = '';
      
      const data = await userLogsApi.getUserLogs(filters);
    //   console.log('API Response:', data); // Debug: Check what backend returns
      
      if (data.success) {
        // Process and normalize the logs data
        const processedLogs = data.data.logs.map(log => ({
          ...log,
          // Ensure timestamp is properly formatted
          timestamp: log.timestamp || log.created_at || log.date || new Date().toISOString(),
          // Backend already provides correct user structure, just ensure it exists
          user: log.user || {
            id: log.userId || 'unknown',
            username: 'Unknown',
            fullName: 'N/A',
            role: 'Unknown'
          },
          // Ensure other fields have proper fallbacks
          ipAddress: log.ipAddress || log.ip_address || log.ip || log.client_ip || '-',
          userAgent: log.userAgent || log.user_agent || log.user_agent_string || null,
          action: log.action || log.activity || 'unknown'
        }));
        
        // console.log('Processed logs:', processedLogs); // Debug: Check processed data
        setUserLogs(processedLogs);
        setTotalLogs(data.data.total || data.data.logs.length);
      }
    } catch (err) {
      console.error('Failed to fetch user logs:', err);
      setUserLogs([]);
      setTotalLogs(0);
    } finally {
      setLogsLoading(false);
    }
  };

  // Fetch user log statistics
  const fetchLogStats = async () => {
    try {
      const data = await userLogsApi.getUserLogStats({
        startDate: logFilters.startDate,
        endDate: logFilters.endDate
      });
      if (data.success) {
        setLogStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch log stats:', err);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle logs per page change
  const handleLogsPerPageChange = (value) => {
    setLogsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Handle log detail view
  const handleLogDetail = (log) => {
    setSelectedLog(log);
    setIsDetailDialogOpen(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchUserLogs();
    fetchLogStats();
  };

  // Handle export
  const handleExport = () => {
    const csvContent = [
      ['User', 'Action', 'Timestamp', 'IP Address', 'User Agent'],
      ...userLogs.map(log => [
        log.user?.username || 'Unknown',
        log.action,
        new Date(log.timestamp).toLocaleString(),
        log.ipAddress || '-',
        log.userAgent || '-'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Utility function to safely format dates
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Invalid Date';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleString();
    } catch (error) {
      console.error('Error formatting timestamp:', error, timestamp);
      return 'Invalid Date';
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalLogs / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage + 1;
  const endIndex = Math.min(currentPage * logsPerPage, totalLogs);

  return (
    <div className="space-y-4">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Activity Logs</h2>
          <p className="text-muted-foreground">Monitor and analyze user activities across the system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={logsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${logsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={userLogs.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Clock className="h-4 w-4 mr-2" />
            {autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}
          </Button>
        </div>
      </div>

      {/* Log Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by user, action, or table..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="log-user">User</Label>
                <Select 
                  value={logFilters.userId} 
                  onValueChange={(value) => setLogFilters({...logFilters, userId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.username} ({user.fullName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="log-action">Action</Label>
                <Select 
                  value={logFilters.action} 
                  onValueChange={(value) => setLogFilters({...logFilters, action: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                    <SelectItem value="never_logged_in">Never Logged In</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={logFilters.startDate}
                  onChange={(e) => setLogFilters({...logFilters, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={logFilters.endDate}
                  onChange={(e) => setLogFilters({...logFilters, endDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="logs-per-page">Logs per Page</Label>
                <Select 
                  value={logsPerPage.toString()} 
                  onValueChange={handleLogsPerPageChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Log Statistics */}
      {logStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Login Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {logStats.loginStats?.slice(0, 7).map((stat, index) => (
                  <div key={`login-stat-${stat.date}-${index}`} className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{stat.date}</span>
                    <span className="font-medium">{stat.count} logins</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Most Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {logStats.activeUsers?.slice(0, 7).map((user, index) => (
                  <div key={`active-user-${user.user?.id || user.user?.username}-${index}`} className="flex justify-between">
                    <span className="text-sm">{user.user?.username}</span>
                    <span className="font-medium">{user.loginCount} logins</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              User Activity Logs
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {startIndex}-{endIndex} of {totalLogs} logs
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">User</TableHead>
                  <TableHead className="min-w-[120px]">Action</TableHead>
                  <TableHead className="min-w-[150px]">Timestamp</TableHead>
                  <TableHead className="min-w-[120px]">IP Address</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logsLoading ? (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading logs...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : userLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center py-8 text-muted-foreground">
                      No logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  userLogs.map((log, index) => (
                    <TableRow key={`log-${log.id}-${index}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {log.user?.username || log.username || 'Unknown'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {log.user?.fullName || log.fullName || log.user?.name || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            log.action === 'login' ? 'default' : 
                            log.action === 'create' ? 'default' :
                            log.action === 'update' ? 'secondary' :
                            log.action === 'delete' ? 'destructive' :
                            log.action === 'view' ? 'outline' :
                            log.action === 'never_logged_in' ? 'destructive' : 
                            'outline'
                          }
                        >
                          {log.action === 'never_logged_in' ? 'Never Logged In' : log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground font-mono">
                          {log.ipAddress || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLogDetail(log)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Log Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about this log entry
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">User</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{selectedLog.user?.username || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">{selectedLog.user?.fullName || 'N/A'}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Action</Label>
                  <div className="mt-1">
                    <Badge 
                      variant={
                        selectedLog.action === 'login' ? 'default' : 
                        selectedLog.action === 'create' ? 'default' :
                        selectedLog.action === 'update' ? 'secondary' :
                        selectedLog.action === 'delete' ? 'destructive' :
                        selectedLog.action === 'view' ? 'outline' :
                        selectedLog.action === 'never_logged_in' ? 'destructive' : 
                        'outline'
                      }
                    >
                      {selectedLog.action === 'never_logged_in' ? 'Never Logged In' : selectedLog.action}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Timestamp</Label>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatTimestamp(selectedLog.timestamp)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">IP Address</Label>
                  <div className="mt-1">
                    <span className="text-sm font-mono">{selectedLog.ipAddress || '-'}</span>
                  </div>
                </div>
              </div>
              
              {selectedLog.userAgent && (
                <div>
                  <Label className="text-sm font-medium">User Agent</Label>
                  <div className="mt-1 p-2 bg-muted rounded text-xs font-mono break-all">
                    {selectedLog.userAgent}
                  </div>
                </div>
              )}
              
              {selectedLog.details && (
                <div>
                  <Label className="text-sm font-medium">Additional Details</Label>
                  <div className="mt-1 p-2 bg-muted rounded text-sm">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(selectedLog.details, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserLogs;
