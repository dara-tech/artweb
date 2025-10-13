import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Database,
  Eye
} from 'lucide-react';
import api from "../../../services/api";
import toastService from "../../../services/toastService";

// Import the components
import ImportTab from './ImportTab';
import DataViewer from './DataViewer';

const DataImportExport = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);

  const showMessage = (type, message) => {
    // Use toast notifications instead of alerts
    if (type === 'success') {
      toastService.success('Success', message);
    } else if (type === 'error') {
      toastService.error('Error', message);
    } else if (type === 'warning') {
      toastService.warning('Warning', message);
    } else if (type === 'info') {
      toastService.info('Info', message);
    }
  };

  // Helper function to get active sites only
  const getActiveSites = () => {
    return sites.filter(site => site.status === 1);
  };

  useEffect(() => {
    console.log('🔍 DataImportExport useEffect triggered');
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching sites...');
      const response = await api.get('/apiv1/lookups/sites-registry');
      console.log('Response data:', response.data);
      
      if (Array.isArray(response.data)) {
        // Filter out inactive sites (status = 0)
        const activeSites = response.data.filter(site => site.status === 1);
        console.log('Sites loaded:', activeSites.length, 'out of', response.data.length);
        setSites(activeSites);
        toastService.success('Sites Loaded', `Successfully loaded ${activeSites.length} active sites`);
      } else {
        console.error('API returned unexpected format:', response.data);
        showMessage('error', 'Failed to load sites: Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching sites from sites-registry:', error);
      
      // Fallback to original sites endpoint
      try {
        console.log('🔍 Trying fallback sites endpoint...');
        const fallbackResponse = await api.get('/apiv1/sites');
        console.log('Fallback response data:', fallbackResponse.data);
        
        if (fallbackResponse.data.success && Array.isArray(fallbackResponse.data.sites)) {
          // Filter out inactive sites (status = 0)
          const activeSites = fallbackResponse.data.sites.filter(site => site.status === 1);
          console.log('Sites loaded from fallback:', activeSites.length, 'out of', fallbackResponse.data.sites.length);
          setSites(activeSites);
          toastService.info('Sites Loaded', `Loaded ${activeSites.length} active sites from fallback endpoint`);
        } else {
          showMessage('error', 'Failed to load sites from both endpoints');
          setSites([]);
        }
      } catch (fallbackError) {
        console.error('Error fetching sites from fallback:', fallbackError);
        showMessage('error', 'Failed to load sites. Please check your connection and try again.');
        setSites([]);
      }
    } finally {
      setLoading(false);
    }
  };




  console.log('DataImportExport component rendered');

  return (
    <div >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Database className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-semibold text-foreground">Data Management</h1>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Import SQL files and view all imported data with file names</p>
          
        
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="import" 
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import Data</span>
          </TabsTrigger>
          <TabsTrigger 
            value="viewer" 
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>View Data</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="mt-6">
          <div className="bg-card rounded-lg border border-border shadow-sm">
            <ImportTab
              sites={getActiveSites()}
              loading={loading}
              setLoading={setLoading}
              showMessage={showMessage}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="viewer" className="mt-6">
          <DataViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataImportExport;