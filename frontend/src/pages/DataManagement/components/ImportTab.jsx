import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui";
import React, { useState } from 'react';
import { 
  Upload, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Settings,
  Shield,
  FileText,
  Clock,
  Zap,
  ArrowRight,
  Info,
  AlertTriangle,
  X
} from 'lucide-react';
import api from "../../../services/api";
const ImportTab = ({ 
  sites, 
  loading, 
  setLoading, 
  showMessage, 
  fetchImportHistory 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImportSite, setSelectedImportSite] = useState('');
  const [importMode, setImportMode] = useState('replace');
  const [createNewDatabase, setCreateNewDatabase] = useState(true);
  const [importOptions, setImportOptions] = useState({
    validateData: true,
    createBackup: false
  });
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState('idle');
  const [dragActive, setDragActive] = useState(false);
  const [showImportSettings, setShowImportSettings] = useState(false);

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
        showMessage('success', `File selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        showMessage('error', 'Please select a .sql or .h149 file');
      }
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.name.endsWith('.sql') || file.name.endsWith('.h149')) {
        if (file.size > 200 * 1024 * 1024) {
          showMessage('error', 'File size exceeds 200MB limit');
          return;
        }
        setSelectedFile(file);
        showMessage('success', `File selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        showMessage('error', 'Please select a .sql or .h149 file');
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      showMessage('error', 'Please select a file to import');
      return;
    }

    if (!selectedImportSite) {
      showMessage('error', 'Please select a target site for import');
      return;
    }

    setLoading(true);
    setImportStatus('uploading');
    setImportProgress(0);

    const formData = new FormData();
    formData.append('sqlFile', selectedFile);
    formData.append('importMode', importMode);
    formData.append('targetSiteCode', selectedImportSite);
    formData.append('importOptions', JSON.stringify(importOptions));
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
        showMessage('success', `Import completed! ${result.statistics.successful} statements executed successfully, ${result.statistics.errors} errors.`);
        setSelectedFile(null);
        setSelectedImportSite('');
        document.getElementById('fileInput').value = '';
        fetchImportHistory(); // Refresh import history
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Import SQL File</h3>
              <p className="text-sm text-gray-600">Upload and process SQL files with advanced options</p>
            </div>
          </div>
          <button
            onClick={() => setShowImportSettings(!showImportSettings)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-4 w-4 mr-2" />
            {showImportSettings ? 'Hide' : 'Show'} Settings
          </button>
        </div>
      </div>
      
      {/* Database Creation Option */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={createNewDatabase}
                  onChange={(e) => setCreateNewDatabase(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Create New Database for Import
                </span>
              </label>
              <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Recommended
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {createNewDatabase 
                ? 'A new database will be created for this import, ensuring data isolation and preventing conflicts.'
                : 'Data will be imported into the main database. This may cause conflicts with existing data.'
              }
            </p>
            {!createNewDatabase && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> Importing into the main database may overwrite existing data. Consider creating a new database for safer data management.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Site Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Zap className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900">Target Site</h4>
            <p className="text-sm text-gray-600">Select the destination site for your import</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Selection
            </label>
            <div className="space-y-2">
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
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800">
                  {createNewDatabase 
                    ? 'The site code will be used to name the new database (e.g., art_SITE001_20241201)'
                    : 'Data will be imported into the main database with site-specific filtering'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Mode Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Shield className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900">Import Mode</h4>
            <p className="text-sm text-gray-600">Choose how you want to process the SQL file</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { 
              value: 'replace', 
              label: 'Import to New Database', 
              icon: Database, 
              color: 'blue',
              description: 'Create new database and import all data',
              features: ['Safe data isolation', 'No conflicts', 'Full import']
            },
            { 
              value: 'validate', 
              label: 'Validate Only (Dry Run)', 
              icon: Shield, 
              color: 'purple',
              description: 'Check data validity without importing',
              features: ['No data changes', 'Validation only', 'Preview results']
            }
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => setImportMode(mode.value)}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-200 ${
                importMode === mode.value
                  ? `border-${mode.color}-500 bg-${mode.color}-50 shadow-lg`
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  importMode === mode.value ? `bg-${mode.color}-100` : 'bg-gray-100'
                }`}>
                  <mode.icon className={`h-6 w-6 ${
                    importMode === mode.value ? `text-${mode.color}-600` : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h5 className="font-semibold text-gray-900">{mode.label}</h5>
                    {importMode === mode.value && (
                      <div className={`px-2 py-1 text-xs font-medium rounded-full bg-${mode.color}-100 text-${mode.color}-800`}>
                        Selected
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{mode.description}</p>
                  <ul className="space-y-1">
                    {mode.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-xs text-gray-500">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Import Settings */}
      {showImportSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Advanced Import Options</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={importOptions.validateData}
                onChange={(e) => setImportOptions({
                  ...importOptions,
                  validateData: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Validate Data Integrity</span>
            </label>
            <p className="text-xs text-gray-500 ml-6">
              Check data validity before importing (recommended)
            </p>
          </div>
        </div>
      )}
      
      {/* File Upload */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FileText className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900">File Upload</h4>
            <p className="text-sm text-gray-600">Upload your SQL file to begin the import process</p>
          </div>
        </div>
        
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-blue-400 bg-blue-50 scale-[1.02]' 
              : selectedFile 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
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
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer flex flex-col items-center"
          >
            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="p-4 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedFile.name}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(selectedFile.lastModified).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedFile(null);
                    document.getElementById('fileInput').value = '';
                  }}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {dragActive ? 'Drop your file here' : 'Click to select or drag SQL file here'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports .sql and .h149 files up to 200MB
                </p>
                <div className="flex items-center space-x-6 text-xs text-gray-400">
                  <span>• SQL files</span>
                  <span>• H149 files</span>
                  <span>• Max 200MB</span>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Import Progress */}
      {importStatus !== 'idle' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${
              importStatus === 'success' ? 'bg-green-100' :
              importStatus === 'error' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              {importStatus === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : importStatus === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-600" />
              ) : (
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              )}
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                {importStatus === 'uploading' && 'Processing Import...'}
                {importStatus === 'success' && 'Import Completed!'}
                {importStatus === 'error' && 'Import Failed'}
              </h4>
              <p className="text-sm text-gray-600">
                {importStatus === 'uploading' && 'Uploading and processing your SQL file'}
                {importStatus === 'success' && 'Your data has been successfully imported'}
                {importStatus === 'error' && 'There was an error processing your import'}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-semibold text-gray-900">{Math.round(importProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ease-out ${
                  importStatus === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  importStatus === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                  'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
                style={{ width: `${importProgress}%` }}
              ></div>
            </div>
            {importStatus === 'uploading' && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                This may take a few minutes depending on file size
              </div>
            )}
          </div>
        </div>
      )}

      {/* Import Button */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <button
          onClick={handleImport}
          disabled={!selectedFile || !selectedImportSite || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-3 animate-spin" />
              Processing Import...
            </>
          ) : (
            <>
              <Database className="h-5 w-5 mr-3" />
              Start Import Process
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </button>
        
        {(!selectedFile || !selectedImportSite) && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                {!selectedFile && !selectedImportSite && 'Please select a file and target site to continue'}
                {!selectedFile && selectedImportSite && 'Please select a SQL file to import'}
                {selectedFile && !selectedImportSite && 'Please select a target site for the import'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportTab;
