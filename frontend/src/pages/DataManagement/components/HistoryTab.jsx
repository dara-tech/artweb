import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Badge, Alert, AlertDescription, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import React from 'react';
import { 
  RotateCcw, 
  RefreshCw,
  Calendar,
  FileText,
  Database,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search
} from 'lucide-react';

const HistoryTab = ({ 
  importHistory 
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [modeFilter, setModeFilter] = React.useState('all');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'replace':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'merge':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'append':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredHistory = importHistory.filter(import_ => {
    const matchesSearch = import_.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         import_.siteCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || import_.status === statusFilter;
    const matchesMode = modeFilter === 'all' || import_.mode === modeFilter;
    
    return matchesSearch && matchesStatus && matchesMode;
  });

  const getSuccessRate = (successful, total) => {
    if (!total || total === 0) return 0;
    return Math.round((successful / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <RotateCcw className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Import History</CardTitle>
                <CardDescription>Track all your data import operations and their results</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      {importHistory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{importHistory.length}</p>
                  <p className="text-xs text-muted-foreground">Total Imports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {importHistory.filter(imp => imp.status === 'success').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Successful</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {importHistory.filter(imp => imp.status === 'error').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {importHistory.reduce((total, imp) => total + (imp.successfulRecords || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Records Imported</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {importHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter import history by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files or sites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mode</label>
                <Select value={modeFilter} onValueChange={setModeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="replace">Replace</SelectItem>
                    <SelectItem value="merge">Merge</SelectItem>
                    <SelectItem value="append">Append</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setModeFilter('all');
                  }}
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Table */}
      {importHistory.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No import history available</h3>
              <p className="text-muted-foreground">
                Start importing data to see your history here
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Import History</CardTitle>
            <CardDescription>
              Showing {filteredHistory.length} of {importHistory.length} imports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Success Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((import_, index) => {
                    const successRate = getSuccessRate(import_.successfulRecords, import_.totalRecords);
                    return (
                      <TableRow key={index}>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">
                              {formatDate(import_.timestamp)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[200px]" title={import_.filename}>
                              {import_.filename}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {import_.siteCode}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getModeColor(import_.mode)}>
                            {import_.mode}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(import_.status)}
                            <Badge variant="outline" className={getStatusColor(import_.status)}>
                              {import_.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="text-sm">
                            <div>{import_.successfulRecords || 0} / {import_.totalRecords || 0}</div>
                            <div className="text-xs text-muted-foreground">
                              {import_.totalRecords ? `${import_.totalRecords.toLocaleString()} total` : 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium">
                              {successRate}%
                            </div>
                            <div className={`w-16 h-2 rounded-full ${
                              successRate >= 90 ? 'bg-green-200' :
                              successRate >= 70 ? 'bg-yellow-200' : 'bg-red-200'
                            }`}>
                              <div 
                                className={`h-2 rounded-full ${
                                  successRate >= 90 ? 'bg-green-500' :
                                  successRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${successRate}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HistoryTab;