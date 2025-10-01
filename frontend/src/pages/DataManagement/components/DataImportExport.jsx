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
  const [message, setMessage] = useState({ type: '', text: '' });

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
        showMessage('error', response.data.message || 'Failed to fetch sites');
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
      showMessage('error', 'Failed to fetch sites: ' + error.message);
    }
  };


  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
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

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-success-light border-success text-success-dark' 
            : 'bg-destructive-light border-destructive text-destructive-dark'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Import Section */}
      <div className="bg-card rounded-lg border border-border shadow-sm">
        <ImportTab
          sites={sites}
          loading={loading}
          setLoading={setLoading}
          showMessage={showMessage}
        />
      </div>
    </div>
  );
};

export default DataImportExport;