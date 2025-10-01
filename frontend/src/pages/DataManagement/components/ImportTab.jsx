import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui";
import React, { useState } from 'react';
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2
} from 'lucide-react';
import api from "../../../services/api";

const ImportTab = ({ 
  sites, 
  loading, 
  setLoading, 
  showMessage
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImportSite, setSelectedImportSite] = useState('');
  const [createNewDatabase, setCreateNewDatabase] = useState(true);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState('idle');
  const [dragActive, setDragActive] = useState(false);

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
      if (file.name.endsWith('.sql') || file.name.endsWith('.h149')) {
        setSelectedFile(file);
      } else {
        showMessage('error', 'Please select a valid SQL file (.sql or .h149)');
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !selectedImportSite) {
      showMessage('error', 'Please select a file and target site');
      return;
    }

    setLoading(true);
    setImportStatus('importing');
    setImportProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('siteCode', selectedImportSite);
    formData.append('createNewDatabase', createNewDatabase);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const response = await api.post('/api/data/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      clearInterval(progressInterval);
      setImportProgress(100);

      const result = response.data;
      
      if (result.success) {
        setImportStatus('success');
        showMessage('success', `Import completed! ${result.statistics?.successful || 0} statements executed successfully.`);
        setSelectedFile(null);
        setSelectedImportSite('');
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
      
      {/* Site Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-foreground mb-4">Target Site</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select destination site
            </label>
            <Select value={selectedImportSite} onValueChange={setSelectedImportSite}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose target site..." />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {sites && sites.length > 0 ? (
                  sites.map((site) => (
                    <SelectItem key={site.code} value={site.code}>
                      {site.code} - {site.name}
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
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="createNewDatabase"
              checked={createNewDatabase}
              onChange={(e) => setCreateNewDatabase(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <label htmlFor="createNewDatabase" className="text-sm text-foreground">
              Create new database for this import
            </label>
          </div>
        </div>
      </div>

      {/* Import Button */}
      <div className="flex justify-end">
        <button
          onClick={handleImport}
          disabled={!selectedFile || !selectedImportSite || loading}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            !selectedFile || !selectedImportSite || loading
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