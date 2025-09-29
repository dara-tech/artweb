import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Alert, AlertDescription, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  Database, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  BarChart3,
  RotateCcw,
  Settings,
  Activity
} from 'lucide-react';
import api from "../../../services/api";

// Import the new smaller components
import ImportTab from './ImportTab';
import ExportTab from './ExportTab';
import AggregateTab from './AggregateTab';
import FilesTab from './FilesTab';
import DatabasesTab from './DatabasesTab';
import HistoryTab from './HistoryTab';
import SitePreviewModal from './SitePreviewModal';

const DataImportExport = () => {
  const [activeTab, setActiveTab] = useState('import');
  const [sites, setSites] = useState([]);
  const [exportFiles, setExportFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Data states
  const [importHistory, setImportHistory] = useState([]);
  const [databases, setDatabases] = useState([]);

  // Preview states
  const [sitePreview, setSitePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    console.log('🔍 DataImportExport useEffect triggered');
    fetchSites();
    fetchExportFiles();
    fetchImportHistory();
    fetchDatabases();
  }, []);

  const fetchSites = async () => {
    try {
      console.log('🔍 Fetching sites...');
      const response = await api.get('/api/sites');
      console.log('Response data:', response.data);
      
      if (response.data.success) {
        console.log('Sites loaded:', response.data.sites.length);
        setSites(response.data.sites);
      } else {
        console.error('API returned error:', response.data.message);
        showMessage('error', response.data.message || 'Failed to fetch sites');
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
      showMessage('error', 'Failed to fetch sites: ' + error.message);
    }
  };

  const fetchExportFiles = async () => {
    try {
      const response = await api.get('/api/data/exports');
      if (response.data.success) {
        setExportFiles(response.data.exports);
      }
    } catch (error) {
      console.error('Error fetching export files:', error);
      showMessage('error', 'Failed to fetch export files');
    }
  };

  const fetchImportHistory = async () => {
    try {
      const response = await api.get('/api/data/import-history');
      if (response.data.success) {
        setImportHistory(response.data.history);
      }
    } catch (error) {
      console.error('Error fetching import history:', error);
    }
  };

  const fetchDatabases = async () => {
    try {
      const response = await api.get('/api/data/databases');
      if (response.data.success) {
        setDatabases(response.data.databases);
      }
    } catch (error) {
      console.error('Error fetching databases:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handlePreview = async (siteCode) => {
    try {
      const response = await api.get(`/api/data/preview/${siteCode}`);
      const data = response.data;
      if (data.success) {
        setSitePreview(data);
        setShowPreview(true);
      } else {
        showMessage('error', 'Failed to fetch site preview');
      }
    } catch (error) {
      showMessage('error', 'Failed to fetch site preview');
    }
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'import':
        return <Upload className="h-4 w-4" />;
      case 'export':
        return <Download className="h-4 w-4" />;
      case 'aggregate':
        return <BarChart3 className="h-4 w-4" />;
      case 'files':
        return <FileText className="h-4 w-4" />;
      case 'databases':
        return <Database className="h-4 w-4" />;
      case 'history':
        return <RotateCcw className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getTabBadge = (tab) => {
    switch (tab) {
      case 'files':
        return exportFiles.length > 0 ? (
          <Badge variant="secondary" className="ml-2">
            {exportFiles.length}
          </Badge>
        ) : null;
      case 'databases':
        return databases.length > 0 ? (
          <Badge variant="secondary" className="ml-2">
            {databases.length}
          </Badge>
        ) : null;
      case 'history':
        return importHistory.length > 0 ? (
          <Badge variant="secondary" className="ml-2">
            {importHistory.length}
          </Badge>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Data Management</CardTitle>
                <CardDescription>
                  Import, export, and manage your ART data across multiple sites
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {sites.length} Sites
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {databases.length} Databases
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Message Display */}
      {message.text && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="import" className="flex items-center space-x-2">
                {getTabIcon('import')}
                <span>Import</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center space-x-2">
                {getTabIcon('export')}
                <span>Export</span>
              </TabsTrigger>
              <TabsTrigger value="aggregate" className="flex items-center space-x-2">
                {getTabIcon('aggregate')}
                <span>Aggregate</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center space-x-2">
                {getTabIcon('files')}
                <span>Files</span>
                {getTabBadge('files')}
              </TabsTrigger>
              <TabsTrigger value="databases" className="flex items-center space-x-2">
                {getTabIcon('databases')}
                <span>Databases</span>
                {getTabBadge('databases')}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                {getTabIcon('history')}
                <span>History</span>
                {getTabBadge('history')}
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <CardContent className="pt-6">
            <TabsContent value="import">
              <ImportTab
                sites={sites}
                loading={loading}
                setLoading={setLoading}
                showMessage={showMessage}
                fetchImportHistory={fetchImportHistory}
              />
            </TabsContent>
            
            <TabsContent value="export">
              <ExportTab
                sites={sites}
                databases={databases}
                loading={loading}
                setLoading={setLoading}
                showMessage={showMessage}
                fetchExportFiles={fetchExportFiles}
                onPreview={handlePreview}
              />
            </TabsContent>
            
            <TabsContent value="aggregate">
              <AggregateTab
                sites={sites}
                databases={databases}
                loading={loading}
                setLoading={setLoading}
                showMessage={showMessage}
                fetchImportHistory={fetchImportHistory}
              />
            </TabsContent>
            
            <TabsContent value="files">
              <FilesTab
                exportFiles={exportFiles}
                showMessage={showMessage}
              />
            </TabsContent>
            
            <TabsContent value="databases">
              <DatabasesTab
                databases={databases}
              />
            </TabsContent>
            
            <TabsContent value="history">
              <HistoryTab
                importHistory={importHistory}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Site Preview Modal */}
      <SitePreviewModal
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        sitePreview={sitePreview}
      />
    </div>
  );
};

export default DataImportExport;