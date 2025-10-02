import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@/components/ui";
import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';
import api from "../../../services/api";

// Import the Import component
import ImportTab from './ImportTab';

const DataImportExport = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔍 DataImportExport useEffect triggered');
    fetchSites();
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
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };




  return (
    <div className="max-w-4xl mx-auto">
      {/* Minimal Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Upload className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-semibold text-foreground">Import Data</h1>
        </div>
        <p className="text-muted-foreground">Upload SQL files to add new data to your ART system</p>
      </div>


      {/* Import Section */}
      <div className="bg-card rounded-lg border border-border shadow-sm">
        <ImportTab
          sites={sites}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

export default DataImportExport;