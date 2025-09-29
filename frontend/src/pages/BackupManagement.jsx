import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Alert, AlertDescription } from "@/components/ui";
import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Trash2, 
  Database, 
  Upload, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Clock,
  HardDrive
} from 'lucide-react';
import api from "../services/api";

function BackupManagement() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [schedulerStatus, setSchedulerStatus] = useState(null);
  const [testResults, setTestResults] = useState(null);

  // Load backups and status
  const loadData = async () => {
    try {
      setLoading(true);
      const [backupsRes, statusRes, schedulerRes] = await Promise.all([
        api.get('/api/backup/list'),
        api.get('/api/backup/status'),
        api.get('/api/backup/scheduler/status')
      ]);
      
      setBackups(backupsRes.data.backups || []);
      setStatistics(statusRes.data.statistics || {});
      setSchedulerStatus(schedulerRes.data.status || {});
    } catch (error) {
      console.error('Error loading backup data:', error);
      setStatus({
        type: 'error',
        message: 'Failed to load backup data'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Create new backup
  const createBackup = async () => {
    try {
      setLoading(true);
      setStatus({ type: 'info', message: 'Creating backup...' });
      
      const response = await api.post('/api/backup/create');
      
      setStatus({
        type: 'success',
        message: `Backup created successfully: ${response.data.filename}`
      });
      
      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error creating backup:', error);
      setStatus({
        type: 'error',
        message: 'Failed to create backup'
      });
    } finally {
      setLoading(false);
    }
  };

  // Download backup
  const downloadBackup = async (filename) => {
    try {
      const response = await api.get(`/backup/download/${filename}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setStatus({
        type: 'success',
        message: `Downloaded backup: ${filename}`
      });
    } catch (error) {
      console.error('Error downloading backup:', error);
      setStatus({
        type: 'error',
        message: 'Failed to download backup'
      });
    }
  };

  // Restore backup
  const restoreBackup = async (filename) => {
    if (!window.confirm(`Are you sure you want to restore from backup "${filename}"? This will replace all current data!`)) {
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: 'info', message: 'Restoring backup... This may take a few minutes.' });
      
      const response = await api.post('/api/backup/restore', { filename });
      
      if (response.data.success) {
        setStatus({
          type: 'success',
          message: response.data.message || 'Database restored successfully! Please refresh the page.'
        });
        
        // Reload data
        await loadData();
      } else {
        setStatus({
          type: 'error',
          message: response.data.message || 'Failed to restore backup'
        });
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to restore backup';
      setStatus({
        type: 'error',
        message: `Restore failed: ${errorMessage}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete backup
  const deleteBackup = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete backup "${filename}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/backup/${filename}`);
      
      setStatus({
        type: 'success',
        message: `Deleted backup: ${filename}`
      });
      
      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error deleting backup:', error);
      setStatus({
        type: 'error',
        message: 'Failed to delete backup'
      });
    } finally {
      setLoading(false);
    }
  };

  // Restore from uploaded file
  const restoreFromUpload = async () => {
    if (!selectedFile) {
      setStatus({
        type: 'error',
        message: 'Please select a backup file first'
      });
      return;
    }

    if (!window.confirm(`Are you sure you want to restore from uploaded file "${selectedFile.name}"? This will replace all current data!`)) {
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: 'info', message: 'Uploading and restoring backup... This may take a few minutes.' });
      
      const formData = new FormData();
      formData.append('backupFile', selectedFile);
      
      const response = await api.post('/api/backup/restore-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        setStatus({
          type: 'success',
          message: response.data.message || 'Database restored successfully from uploaded file! Please refresh the page.'
        });
        
        // Clear selected file
        setSelectedFile(null);
        
        // Reload data
        await loadData();
      } else {
        setStatus({
          type: 'error',
          message: response.data.message || 'Failed to restore from uploaded file'
        });
      }
    } catch (error) {
      console.error('Error restoring from upload:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to restore from uploaded file';
      setStatus({
        type: 'error',
        message: `Upload restore failed: ${errorMessage}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Test old backup file
  const testOldBackup = async () => {
    if (!selectedFile) {
      setStatus({
        type: 'error',
        message: 'Please select a backup file to test'
      });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: 'info', message: 'Testing old backup file decryption...' });
      
      const formData = new FormData();
      formData.append('backupFile', selectedFile);
      
      const response = await api.post('/api/backup/upload-test-old', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setTestResults(response.data);
      
      if (response.data.success) {
        setStatus({
          type: 'success',
          message: response.data.message || 'Old backup file successfully decrypted!'
        });
      } else {
        setStatus({
          type: 'warning',
          message: response.data.message || 'Decryption failed - use old VB.NET system to decrypt'
        });
      }
    } catch (error) {
      console.error('Error testing old backup:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to test old backup file';
      setStatus({
        type: 'error',
        message: `Test failed: ${errorMessage}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Start backup scheduler
  const startScheduler = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/backup/scheduler/start');
      setStatus({
        type: 'success',
        message: 'Backup scheduler started successfully'
      });
      await loadData();
    } catch (error) {
      console.error('Error starting scheduler:', error);
      setStatus({
        type: 'error',
        message: 'Failed to start backup scheduler'
      });
    } finally {
      setLoading(false);
    }
  };

  // Stop backup scheduler
  const stopScheduler = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/backup/scheduler/stop');
      setStatus({
        type: 'success',
        message: 'Backup scheduler stopped successfully'
      });
      await loadData();
    } catch (error) {
      console.error('Error stopping scheduler:', error);
      setStatus({
        type: 'error',
        message: 'Failed to stop backup scheduler'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Backup Management</h1>
          <p className="text-gray-600">Manage database backups and restore data</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadData} 
            variant="outline" 
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={createBackup} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Database className="w-4 h-4 mr-2" />
            Create Backup
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {status && (
        <Alert className={status.type === 'error' ? 'border-red-200 bg-red-50' : 
                          status.type === 'success' ? 'border-green-200 bg-green-50' : 
                          'border-blue-200 bg-blue-50'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Database className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Backups</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalBackups}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <HardDrive className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Size</p>
                  <p className="text-2xl font-bold text-gray-900">{formatFileSize(statistics.totalSize)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Latest Backup</p>
                  <p className="text-sm text-gray-900">
                    {statistics.latestBackup ? 
                      formatDate(statistics.latestBackup.created) : 
                      'None'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-sm text-gray-900">
                    {statistics.totalBackups > 0 ? 'Protected' : 'No Backups'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backup Scheduler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Backup Scheduler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Automatic Backups</h3>
                <p className="text-sm text-gray-500">
                  {schedulerStatus?.isRunning ? 
                    'Scheduler is running - Daily (2 AM), Weekly (Sun 3 AM), Monthly (1st 4 AM)' :
                    'Scheduler is stopped'
                  }
                </p>
              </div>
              <div className="flex gap-2">
                {schedulerStatus?.isRunning ? (
                  <Button
                    onClick={stopScheduler}
                    disabled={loading}
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Stop Scheduler
                  </Button>
                ) : (
                  <Button
                    onClick={startScheduler}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Start Scheduler
                  </Button>
                )}
              </div>
            </div>
            
            {schedulerStatus?.scheduledJobs && schedulerStatus.scheduledJobs.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Active Schedules</h4>
                <div className="space-y-2">
                  {schedulerStatus.scheduledJobs.map((job, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      {job.charAt(0).toUpperCase() + job.slice(1)} backup schedule
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Backups List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Available Backups
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Loading backups...</span>
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No backups available</p>
              <p className="text-sm">Create your first backup to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">{backup.filename}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatFileSize(backup.size)}</span>
                          <span>Created: {formatDate(backup.created)}</span>
                          {index === 0 && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Latest
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadBackup(backup.filename)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => restoreBackup(backup.filename)}
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Restore
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteBackup(backup.filename)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Upload for Restore */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Restore from File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600 mb-2">Upload a backup file (.h149) to restore</p>
              <input
                type="file"
                accept=".h149"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Choose File
              </label>
              {selectedFile && (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500">
                    Selected: {selectedFile.name}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
            
            {selectedFile && (
              <div className="space-y-2">
                <Button
                  onClick={restoreFromUpload}
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Restore from Uploaded File
                </Button>
                
                <Button
                  onClick={testOldBackup}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Test Old System Backup
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Old Backup Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Filename:</strong> {testResults.filename}
                </div>
                <div>
                  <strong>File Size:</strong> {formatFileSize(testResults.fileSize)}
                </div>
                <div>
                  <strong>MySQL Signatures:</strong> {testResults.mysqlSignatures}
                </div>
                <div>
                  <strong>Header:</strong> {testResults.header?.substring(0, 32)}...
                </div>
              </div>
              
              <div>
                <strong>Decryption Attempts:</strong>
                <div className="mt-2 space-y-2">
                  {testResults.decryptionAttempts?.map((attempt, index) => (
                    <div key={index} className={`p-3 rounded border ${
                      attempt.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{attempt.method}</span>
                        <Badge variant={attempt.success ? 'default' : 'destructive'}>
                          {attempt.success ? 'Success' : 'Failed'}
                        </Badge>
                      </div>
                      {attempt.error && (
                        <div className="text-sm text-red-600 mt-1">
                          Error: {attempt.error}
                        </div>
                      )}
                      {attempt.preview && (
                        <div className="text-sm text-gray-600 mt-1">
                          <strong>Preview:</strong>
                          <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                            {attempt.preview}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {testResults.decryptedFile && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Decrypted file saved: {testResults.decryptedFile}
                  </AlertDescription>
                </Alert>
              )}
              
              {testResults.recommendation && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {testResults.recommendation}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BackupManagement;
