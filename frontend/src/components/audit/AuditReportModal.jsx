import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar, Download, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import auditApi from '../../services/auditApi';

const AuditReportModal = ({ 
  isOpen, 
  onClose, 
  report, 
  sites = [], 
  selectedSite = null 
}) => {
  const [activeTab, setActiveTab] = useState('single');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-03-31'
  });
  const [selectedSiteCode, setSelectedSiteCode] = useState(selectedSite?.code || '');

  useEffect(() => {
    if (isOpen && report) {
      setError(null);
      setReportData(null);
    }
  }, [isOpen, report]);

  const handleGenerateReport = async () => {
    if (!report) return;

    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (activeTab === 'single' && selectedSiteCode) {
        response = await auditApi.getReportForSite(
          report.id, 
          selectedSiteCode, 
          dateRange.startDate, 
          dateRange.endDate
        );
      } else {
        response = await auditApi.getReportForAllSites(
          report.id, 
          dateRange.startDate, 
          dateRange.endDate
        );
      }

      setReportData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!reportData) return;

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.id}_audit_report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderSingleSiteResults = () => {
    if (!reportData?.results) return null;

    const results = Array.isArray(reportData.results) ? reportData.results : [reportData.results];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Report Results</h3>
            <p className="text-sm text-muted-foreground">
              Site: {reportData.siteCode} | 
              Period: {reportData.startDate} to {reportData.endDate}
            </p>
          </div>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        {results.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(results[0]).map((key) => (
                      <TableHead key={key} className="capitalize">
                        {key.replace(/_/g, ' ')}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, cellIndex) => (
                        <TableCell key={cellIndex}>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No data available for the selected criteria
          </div>
        )}
      </div>
    );
  };

  const renderAllSitesResults = () => {
    if (!reportData?.sites) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">All Sites Report</h3>
            <p className="text-sm text-muted-foreground">
              Period: {reportData.startDate} to {reportData.endDate}
            </p>
          </div>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        <div className="grid gap-4">
          {reportData.sites.map((siteData, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {siteData.siteName} ({siteData.siteCode})
                  </CardTitle>
                  {siteData.error ? (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Error
                    </Badge>
                  ) : (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Success
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {siteData.error ? (
                  <div className="text-sm text-destructive">
                    Error: {siteData.error}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {siteData.results?.length || 0} records found
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Audit Report: {report.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  onClick={handleGenerateReport} 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Report Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Site</TabsTrigger>
              <TabsTrigger value="all">All Sites</TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="space-y-4">
              <div>
                <Label htmlFor="siteSelect">Select Site</Label>
                <Select value={selectedSiteCode} onValueChange={setSelectedSiteCode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.code} value={site.code}>
                        {site.name} ({site.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {renderSingleSiteResults()}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {renderAllSitesResults()}
            </TabsContent>
          </Tabs>

          {/* Error Display */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuditReportModal;
