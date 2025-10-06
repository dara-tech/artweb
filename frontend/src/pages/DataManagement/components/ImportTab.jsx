import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from 'react';
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Database
} from 'lucide-react';
import importApi from "../../../services/importApi";

const ImportTab = ({ 
  sites, 
  loading, 
  setLoading, 
  showMessage
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImportSite, setSelectedImportSite] = useState('');
  const [createNewDatabase, setCreateNewDatabase] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState('idle');
  const [importMessage, setImportMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [extractedSiteInfo, setExtractedSiteInfo] = useState(null);
  
  // New site form fields
  const [newSiteCode, setNewSiteCode] = useState('');
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteProvince, setNewSiteProvince] = useState('');
  const [newSiteDistrict, setNewSiteDistrict] = useState('');
  const [newSiteFileName, setNewSiteFileName] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.sql') || file.name.endsWith('.h149')) {
        setSelectedFile(file);
      } else {
        showMessage('error', 'Please select a valid SQL file (.sql or .h149)');
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/sql' || file.name.endsWith('.sql') || file.name.endsWith('.h149')) {
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
        showMessage('error', 'Please select a valid SQL file (.sql or .h149)');
      }
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!selectedFile) {
      errors.push('Please select a SQL file to import');
    }
    
    if (!createNewDatabase && !selectedImportSite) {
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
      showMessage('error', validationErrors.join(', '));
      return;
    }

    setLoading(true);
    setImportStatus('importing');
    setImportProgress(0);
    setImportMessage('Starting import process...');

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
      formData.append('targetSite', selectedImportSite);
    }

    try {
      const result = await importApi.importSqlFile(formData, (progress) => {
        setImportProgress(progress);
      });
      
      if (result.success) {
        setImportStatus('success');
        setImportMessage(`Import completed! ${result.statistics?.successful || 0} statements executed successfully.`);
        showMessage('success', `Import completed! ${result.statistics?.successful || 0} statements executed successfully.`);
        
        // Show extracted site info if available
        if (result.extractedSiteInfo) {
          setExtractedSiteInfo({
            detected: true,
            message: 'Site information was successfully extracted from tblsitename table',
            success: true
          });
        }
        
        // Reset form
        setSelectedFile(null);
        setSelectedImportSite('');
        setNewSiteCode('');
        setNewSiteName('');
        setNewSiteProvince('');
        setNewSiteDistrict('');
        setNewSiteFileName('');
        setCreateNewDatabase(false);
        setValidationErrors([]);
        setExtractedSiteInfo(null);
        document.getElementById('fileInput').value = '';
      } else {
        setImportStatus('error');
        showMessage('error', result.message || 'Import failed');
      }
    } catch (error) {
      setImportStatus('error');
      showMessage('error', 'Import failed: ' + error.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setImportStatus('idle');
        setImportProgress(0);
      }, 3000);
    }
  };

  return (
    <div className="p-6 ">
      {/* File Upload Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-foreground mb-4">Upload SQL File</h3>
        
        {/* Drag and Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary-light'
              : selectedFile
              ? 'border-success bg-success-light'
              : 'border-border hover:border-primary'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            id="fileInput"
            type="file"
            accept=".sql,.h149"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {selectedFile ? (
            <div className="space-y-2">
              <CheckCircle className="h-12 w-12 text-success mx-auto" />
              <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-xs text-destructive hover:text-destructive-hover"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-foreground">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">SQL files only</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Target Configuration */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-foreground mb-4">Target Configuration</h3>
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="target"
                checked={!createNewDatabase}
                onChange={() => setCreateNewDatabase(false)}
                className="text-primary"
              />
              <span className="text-foreground">Import to existing site</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="target"
                checked={createNewDatabase}
                onChange={() => setCreateNewDatabase(true)}
                className="text-primary"
              />
              <span className="text-foreground">Create new site</span>
            </label>
          </div>

          {!createNewDatabase && (
            <div className="space-y-2">
              <Label>Select Site</Label>
              <Select value={selectedImportSite} onValueChange={setSelectedImportSite} disabled={loading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose target site..." />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {sites && sites.length > 0 ? (
                    sites.map((site) => (
                      <SelectItem key={site.code} value={site.code}>
                        {site.code} - {site.fileName || site.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-sites" disabled>
                      No sites available
                    </SelectItem>
                  )}
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
        </div>
      </div>

      {/* Extracted Site Info */}
      {extractedSiteInfo && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-blue-700">{extractedSiteInfo.message}</p>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h4 className="text-sm font-medium text-destructive">Please fix the following errors:</h4>
          </div>
          <ul className="text-sm text-destructive space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Import Button */}
      <div className="flex justify-end">
        <button
          onClick={handleImport}
          disabled={!selectedFile || (!createNewDatabase && !selectedImportSite) || (createNewDatabase && (!newSiteCode || !newSiteName || !newSiteProvince || !newSiteDistrict || !newSiteFileName)) || loading}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            !selectedFile || (!createNewDatabase && !selectedImportSite) || (createNewDatabase && (!newSiteCode || !newSiteName || !newSiteProvince || !newSiteDistrict || !newSiteFileName)) || loading
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Importing...</span>
            </div>
          ) : (
            'Import Data'
          )}
        </button>
      </div>
      
      {/* Progress Display */}
      {importStatus !== 'idle' && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {importStatus === 'importing' ? 'Importing...' : 
               importStatus === 'success' ? 'Import Complete' : 'Import Failed'}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(importProgress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                importStatus === 'success' ? 'status-active' : 
                importStatus === 'error' ? 'status-critical' : 'status-active'
              }`}
              style={{ width: `${importProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportTab;