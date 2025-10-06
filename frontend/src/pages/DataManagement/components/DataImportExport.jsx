import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@/components/ui";
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

// Import the components
import ImportTab from './ImportTab';
import DataViewer from './DataViewer';

const DataImportExport = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);

  const showMessage = (type, message) => {
    // Simple alert for now - you can replace this with a proper notification system
    if (type === 'success') {
      alert(`✅ ${message}`);
    } else if (type === 'error') {
      alert(`❌ ${message}`);
    }
  };

  useEffect(() => {
    console.log('🔍 DataImportExport useEffect triggered');
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      console.log('🔍 Fetching sites...');
      const response = await api.get('/apiv1/lookups/sites-registry');
      console.log('Response data:', response.data);
      
      if (Array.isArray(response.data)) {
        console.log('Sites loaded:', response.data.length);
        setSites(response.data);
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
          console.log('Sites loaded from fallback:', fallbackResponse.data.sites.length);
          setSites(fallbackResponse.data.sites);
        } else {
          showMessage('error', 'Failed to load sites from both endpoints');
          setSites([]);
        }
      } catch (fallbackError) {
        console.error('Error fetching sites from fallback:', fallbackError);
        showMessage('error', 'Failed to load sites. Please check your connection and try again.');
        setSites([]);
      }
    }
  };




  console.log('DataImportExport component rendered');

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Database className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-semibold text-foreground">Data Management</h1>
        </div>
        <p className="text-muted-foreground">Import SQL files and view all imported data with file names</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import Data</span>
          </TabsTrigger>
          <TabsTrigger value="viewer" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>View Data</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="mt-6">
          <div className="bg-card rounded-lg border border-border shadow-sm">
            <ImportTab
              sites={sites}
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