import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { RefreshCw, Search, FileText, Activity, Filter } from 'lucide-react';
import AuditReportCard from '../../components/audit/AuditReportCard';
import AuditReportModal from '../../components/audit/AuditReportModal';
import AuditLogsTable from '../../components/audit/AuditLogsTable';
import auditApi from '../../services/auditApi';
import siteApi from '../../services/siteApi';

const AuditReports = () => {
  const [reports, setReports] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('reports');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [reportsResponse, sitesResponse] = await Promise.all([
        auditApi.getReports(),
        siteApi.getSites()
      ]);

      setReports(reportsResponse.data || []);
      setSites(sitesResponse.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleDownloadReport = (report) => {
    // For now, just show the modal. In a real implementation, 
    // you might want to generate a PDF or Excel file
    handleViewReport(report);
  };

  const getReportCategory = (reportId) => {
    if (reportId.includes('active_art') || reportId.includes('active_pre_art')) {
      return 'Patient Status';
    }
    if (reportId.includes('mmd') || reportId.includes('tld')) {
      return 'Treatment';
    }
    if (reportId.includes('tpt')) {
      return 'Prevention';
    }
    if (reportId.includes('vl')) {
      return 'Monitoring';
    }
    return 'General';
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           getReportCategory(report.id) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(reports.map(r => getReportCategory(r.id)))];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Reports</h1>
          <p className="text-muted-foreground">
            Generate and view audit reports for data validation and compliance
          </p>
        </div>
        <Button onClick={fetchData} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <Activity className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports">Audit Reports</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mr-2" />
              <span>Loading audit reports...</span>
            </div>
          ) : filteredReports.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reports found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'Try adjusting your search criteria' 
                      : 'No audit reports are available'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <AuditReportCard
                  key={report.id}
                  report={report}
                  onView={handleViewReport}
                  onDownload={handleDownloadReport}
                  isLoading={loading}
                />
              ))}
            </div>
          )}

          {/* Results Summary */}
          {filteredReports.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Showing {filteredReports.length} of {reports.length} reports
                  </span>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">
                      {reports.filter(r => getReportCategory(r.id) === 'Patient Status').length} Patient Status
                    </Badge>
                    <Badge variant="outline">
                      {reports.filter(r => getReportCategory(r.id) === 'Treatment').length} Treatment
                    </Badge>
                    <Badge variant="outline">
                      {reports.filter(r => getReportCategory(r.id) === 'Prevention').length} Prevention
                    </Badge>
                    <Badge variant="outline">
                      {reports.filter(r => getReportCategory(r.id) === 'Monitoring').length} Monitoring
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs">
          <AuditLogsTable sites={sites} />
        </TabsContent>
      </Tabs>

      {/* Report Modal */}
      <AuditReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        report={selectedReport}
        sites={sites}
      />
    </div>
  );
};

export default AuditReports;
