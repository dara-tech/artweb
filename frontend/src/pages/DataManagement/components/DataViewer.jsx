import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  FileText, 
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import api from '../../../services/api';

const DataViewer = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('DataViewer component rendered');

  const showMessage = (type, message) => {
    // Simple alert for now - you can replace this with a proper notification system
    if (type === 'success') {
      alert(`✅ ${message}`);
    } else if (type === 'error') {
      alert(`❌ ${message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch only sites registry - it contains all the data we need
      const sitesResponse = await api.get('/apiv1/lookups/sites-registry');

      if (Array.isArray(sitesResponse.data)) {
        setSites(sitesResponse.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const deleteSite = async (siteCode) => {
    if (!window.confirm(`Are you sure you want to delete site "${siteCode}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await api.delete(`/apiv1/site-operations/sites/${siteCode}`);
      if (response.data.success) {
        // Refresh the data
        await fetchData();
        showMessage('success', `Site ${siteCode} deleted successfully`);
      } else {
        showMessage('error', response.data.message || 'Failed to delete site');
      }
    } catch (err) {
      console.error('Error deleting site:', err);
      showMessage('error', 'Failed to delete site. Please try again.');
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Data Viewer</h2>
          <p className="text-muted-foreground">View all imported data with file names and database information</p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sites.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sites with File Names</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sites.filter(site => site.fileName).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sites without File Names</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sites.filter(site => !site.fileName).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sites Data Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">All Sites Data</h3>
        
        {sites.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No sites found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-card rounded-lg border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Site Code</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Site Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">File Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Search Terms</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sites.map((site) => (
                    <tr key={site.code} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                       
                          <span className="text-sm font-medium text-foreground">{site.code}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-foreground">{site.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground truncate max-w-xs" title={site.fileName || 'No file name'}>
                            {site.fileName || 'No file name'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">{site.searchTerms}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={site.fileName ? "default" : "secondary"}>
                          {site.fileName ? "Has File" : "No File"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteSite(site.code)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default DataViewer;
