import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Database, CheckCircle, AlertCircle, X, FileText, Loader2 } from 'lucide-react';
import siteApi from '../services/siteApi';
import importApi from '../services/importApi';

const ImportData = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetSite, setTargetSite] = useState('');
  const [createNewDatabase, setCreateNewDatabase] = useState(false);
  const [newSiteCode, setNewSiteCode] = useState('');
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteProvince, setNewSiteProvince] = useState('');
  const [newSiteDistrict, setNewSiteDistrict] = useState('');
  const [newSiteFileName, setNewSiteFileName] = useState('');
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState('idle'); // idle, importing, success, error
  const [importMessage, setImportMessage] = useState('');
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [extractedSiteInfo, setExtractedSiteInfo] = useState(null);
  
  const fileInputRef = useRef(null);

  // Load sites on component mount
  React.useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      setLoading(true);
      const response = await siteApi.getAllSites();
      const sitesData = response.sites || response.data || response;
      setSites(sitesData || []);
    } catch (error) {
      console.error('Error loading sites:', error);
      setImportStatus('error');
      setImportMessage('Failed to load sites');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/sql' || file.name.endsWith('.sql')) {
        setSelectedFile(file);
        setValidationErrors([]);
        setImportStatus('idle');
        setExtractedSiteInfo(null);
        
        // Check if file contains tblsitename table
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const hasTblSiteName = /CREATE TABLE.*tblsitename/i.test(content) || 
                                /INSERT INTO.*tblsitename/i.test(content);
          
          if (hasTblSiteName) {
            setExtractedSiteInfo({
              detected: true,
              message: 'Site information will be automatically extracted from tblsitename table'
            });
          }
        };
        reader.readAsText(file);
      } else {
        setValidationErrors(['Please select a valid SQL file (.sql)']);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.type === 'application/sql' || file.name.endsWith('.sql')) {
        setSelectedFile(file);
        setValidationErrors([]);
        setImportStatus('idle');
        setExtractedSiteInfo(null);
        
        // Check if file contains tblsitename table
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const hasTblSiteName = /CREATE TABLE.*tblsitename/i.test(content) || 
                                /INSERT INTO.*tblsitename/i.test(content);
          
          if (hasTblSiteName) {
            setExtractedSiteInfo({
              detected: true,
              message: 'Site information will be automatically extracted from tblsitename table'
            });
          }
        };
        reader.readAsText(file);
      } else {
        setValidationErrors(['Please select a valid SQL file (.sql)']);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setExtractedSiteInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!selectedFile) {
      errors.push('Please select a SQL file to import');
    }
    
    if (!createNewDatabase && !targetSite) {
      errors.push('Please select a target site or choose to create a new database');
    }
    
    if (createNewDatabase) {
      if (!newSiteCode.trim()) {
        errors.push('Site code is required for new database');
      }
      if (!newSiteName.trim()) {
        errors.push('Site name is required for new database');
      }
      if (!newSiteProvince.trim()) {
        errors.push('Province is required for new database');
      }
      if (!newSiteDistrict.trim()) {
        errors.push('District is required for new database');
      }
      if (!newSiteFileName.trim()) {
        errors.push('File name is required for new database');
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleImport = async () => {
    if (!validateForm()) {
      return;
    }

    setImportStatus('importing');
    setImportProgress(0);
    setImportMessage('Starting import process...');

    try {
      const formData = new FormData();
      formData.append('sqlFile', selectedFile);
      
      if (createNewDatabase) {
        formData.append('createNewDatabase', 'true');
        formData.append('siteCode', newSiteCode);
        formData.append('siteName', newSiteName);
        formData.append('province', newSiteProvince);
        formData.append('district', newSiteDistrict);
        formData.append('fileName', newSiteFileName);
      } else {
        formData.append('targetSite', targetSite);
      }

      const response = await importApi.importSqlFile(formData, (progress) => {
        setImportProgress(progress);
      });

      if (response.success) {
        setImportStatus('success');
        setImportMessage(response.message || 'Data imported successfully!');
        setImportProgress(100);
        
        // Show extracted site info if available
        if (response.extractedSiteInfo) {
          setExtractedSiteInfo({
            detected: true,
            message: 'Site information was successfully extracted from tblsitename table',
            success: true
          });
        }
        
        // Reset form
        setSelectedFile(null);
        setTargetSite('');
        setCreateNewDatabase(false);
        setNewSiteCode('');
        setNewSiteName('');
        setNewSiteProvince('');
        setNewSiteDistrict('');
        setNewSiteFileName('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Reload sites to show the new one
        await loadSites();
      } else {
        setImportStatus('error');
        setImportMessage(response.message || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus('error');
      setImportMessage(error.message || 'Import failed');
    }
  };

  const getStatusIcon = () => {
    switch (importStatus) {
      case 'importing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Import Data</h1>
        <p className="text-gray-600">Upload SQL files to import data into your system</p>
      </div>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload SQL File</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".sql"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {selectedFile ? (
              <div className="space-y-2">
                <FileText className="h-8 w-8 mx-auto text-gray-600" />
                <div className="flex items-center justify-center gap-2">
                  <span className="font-medium">{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <p className="font-medium">Drop SQL file here or click to browse</p>
                <p className="text-sm text-gray-500">Maximum file size: 500MB</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Target Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Target Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="target"
                checked={!createNewDatabase}
                onChange={() => setCreateNewDatabase(false)}
                className="text-blue-600"
              />
              <span>Import to existing site</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="target"
                checked={createNewDatabase}
                onChange={() => setCreateNewDatabase(true)}
                className="text-blue-600"
              />
              <span>Create new site</span>
            </label>
          </div>

          {!createNewDatabase && (
            <div className="space-y-2">
              <Label>Select Site</Label>
              <Select value={targetSite} onValueChange={setTargetSite} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose target site..." />
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
          )}

          {createNewDatabase && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site Code</Label>
                <Input
                  value={newSiteCode}
                  onChange={(e) => setNewSiteCode(e.target.value)}
                  placeholder="e.g., 0201"
                />
              </div>
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  placeholder="Health Center Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Province</Label>
                <Input
                  value={newSiteProvince}
                  onChange={(e) => setNewSiteProvince(e.target.value)}
                  placeholder="Province"
                />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input
                  value={newSiteDistrict}
                  onChange={(e) => setNewSiteDistrict(e.target.value)}
                  placeholder="District"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>File Name</Label>
                <Input
                  value={newSiteFileName}
                  onChange={(e) => setNewSiteFileName(e.target.value)}
                  placeholder="site_data_2024.sql"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Messages */}
      {extractedSiteInfo && (
        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>{extractedSiteInfo.message}</AlertDescription>
        </Alert>
      )}

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {importStatus !== 'idle' && (
        <Alert>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <AlertDescription>{importMessage}</AlertDescription>
          </div>
          {importStatus === 'importing' && (
            <div className="mt-3 space-y-1">
              <Progress value={importProgress} className="w-full" />
              <p className="text-sm text-gray-600">{importProgress}% complete</p>
            </div>
          )}
        </Alert>
      )}

      {/* Import Button */}
      <Button
        onClick={handleImport}
        disabled={importStatus === 'importing' || !selectedFile}
        className="w-full"
      >
        {importStatus === 'importing' ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <Database className="h-4 w-4 mr-2" />
            Import Data
          </>
        )}
      </Button>
    </div>
  );
};

export default ImportData;
