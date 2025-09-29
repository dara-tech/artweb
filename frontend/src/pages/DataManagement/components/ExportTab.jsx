import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox, Badge, Alert, AlertDescription, Separator } from "@/components/ui";
import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Eye,
  Info,
  Calendar,
  FileText,
  Database,
  Settings
} from 'lucide-react';
import api from "../../../services/api";

const ExportTab = ({ 
  sites, 
  databases, 
  loading, 
  setLoading, 
  showMessage, 
  fetchExportFiles,
  onPreview 
}) => {
  const [selectedSite, setSelectedSite] = useState('');
  const [exportOptions, setExportOptions] = useState({
    includePatients: true,
    includeVisits: true,
    includeLookups: false,
    includeMetadata: true,
    dateRange: {
      start: '',
      end: ''
    },
    format: 'sql',
    compression: false
  });

  const handleExport = async () => {
    if (!selectedSite) {
      showMessage('error', 'Please select a site to export');
      return;
    }

    setLoading(true);

    try {
      // Determine database name - use main preart if aggregated data exists, otherwise use site-specific database
      const siteDatabase = databases.find(db => db.name.startsWith(`art_${selectedSite}_`));
      const databaseName = siteDatabase ? siteDatabase.name : 'preart';
      
      const response = await api.post('/api/data/export', {
        databaseName: databaseName,
        siteCode: selectedSite,
        ...exportOptions
      });

      const result = response.data;
      
      if (result.success) {
        showMessage('success', `Export completed! File: ${result.filename}`);
        fetchExportFiles(); // Refresh export files list
      } else {
        showMessage('error', result.message || 'Export failed');
      }
    } catch (error) {
      showMessage('error', 'Export failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Export Site Data</CardTitle>
              <CardDescription>Export data from specific sites with customizable options</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Smart Export Info */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Smart Export:</strong> When exporting from aggregated data, the system automatically filters by site code. 
          This ensures you get only the data for the selected site, even from the main database.
        </AlertDescription>
      </Alert>
      
      {/* Site Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Site Selection</CardTitle>
          <CardDescription>Choose which site to export data from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose a site..." />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.code} value={site.code}>
                    {site.code} - {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSite && (
              <Button
                variant="outline"
                onClick={() => onPreview(selectedSite)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Configure what data to include in the export</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-900">Data Types</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includePatients"
                    checked={exportOptions.includePatients}
                    onCheckedChange={(checked) => setExportOptions({
                      ...exportOptions,
                      includePatients: checked
                    })}
                  />
                  <Label htmlFor="includePatients" className="text-sm">
                    Include Patient Data
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeVisits"
                    checked={exportOptions.includeVisits}
                    onCheckedChange={(checked) => setExportOptions({
                      ...exportOptions,
                      includeVisits: checked
                    })}
                  />
                  <Label htmlFor="includeVisits" className="text-sm">
                    Include Visit Data
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeLookups"
                    checked={exportOptions.includeLookups}
                    onCheckedChange={(checked) => setExportOptions({
                      ...exportOptions,
                      includeLookups: checked
                    })}
                  />
                  <Label htmlFor="includeLookups" className="text-sm">
                    Include Lookup Tables
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-900">Export Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeMetadata"
                    checked={exportOptions.includeMetadata}
                    onCheckedChange={(checked) => setExportOptions({
                      ...exportOptions,
                      includeMetadata: checked
                    })}
                  />
                  <Label htmlFor="includeMetadata" className="text-sm">
                    Include Metadata
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compression"
                    checked={exportOptions.compression}
                    onCheckedChange={(checked) => setExportOptions({
                      ...exportOptions,
                      compression: checked
                    })}
                  />
                  <Label htmlFor="compression" className="text-sm">
                    Compress Export
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Date Range Filter</CardTitle>
          <CardDescription>Optionally filter data by date range (leave empty to export all data)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={exportOptions.dateRange.start}
                onChange={(e) => setExportOptions({
                  ...exportOptions,
                  dateRange: { ...exportOptions.dateRange, start: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={exportOptions.dateRange.end}
                onChange={(e) => setExportOptions({
                  ...exportOptions,
                  dateRange: { ...exportOptions.dateRange, end: e.target.value }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Format */}
      <Card>
        <CardHeader>
          <CardTitle>Export Format</CardTitle>
          <CardDescription>Choose the format for your exported data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'sql', label: 'SQL File', description: 'Standard SQL dump file' },
              { value: 'csv', label: 'CSV Files', description: 'Comma-separated values' },
              { value: 'json', label: 'JSON File', description: 'JavaScript Object Notation' }
            ].map((format) => (
              <Button
                key={format.value}
                variant={exportOptions.format === format.value ? "default" : "outline"}
                className={`p-4 h-auto text-left justify-start ${
                  exportOptions.format === format.value ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setExportOptions({
                  ...exportOptions,
                  format: format.value
                })}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{format.label}</span>
                  <span className="text-xs text-muted-foreground mt-1">{format.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleExport}
            disabled={!selectedSite || loading}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-3" />
                Export Site Data
              </>
            )}
          </Button>
          
          {!selectedSite && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select a site to export data from
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportTab;