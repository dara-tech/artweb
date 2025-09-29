import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox, Progress, Badge, Alert, AlertDescription, Separator, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui";
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  BarChart3, 
  AlertTriangle, 
  Loader2,
  Database,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  ArrowRight,
  Info,
  Eye,
  RefreshCw,
  Terminal,
  FileText,
  Users,
  Activity
} from 'lucide-react';
import api from "../../../services/api";

const AggregateTab = ({ 
  sites, 
  databases, 
  loading, 
  setLoading, 
  showMessage, 
  fetchImportHistory 
}) => {
  const [aggregationMode, setAggregationMode] = useState('none');
  const [selectedSitesForAggregation, setSelectedSitesForAggregation] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [aggregationLogs, setAggregationLogs] = useState([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [aggregationProgress, setAggregationProgress] = useState(0);
  const [aggregationStatus, setAggregationStatus] = useState('idle');
  const [currentSite, setCurrentSite] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [processedRecords, setProcessedRecords] = useState(0);
  const [currentTable, setCurrentTable] = useState('');
  const [siteProgress, setSiteProgress] = useState({});
  const socketRef = useRef(null);

  // WebSocket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:3001');
    
    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket');
      socketRef.current.emit('join-aggregation');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    // Listen for real-time aggregation progress
    socketRef.current.on('aggregation-progress', (data) => {
      console.log('Received progress:', data);
      
      // Update progress state
      setAggregationProgress(data.progress);
      setCurrentSite(data.currentSite || '');
      setCurrentTable(data.currentTable || '');
      setTotalRecords(data.totalRecords || 0);
      setProcessedRecords(data.processedRecords || 0);
      
      // Add log entry
      addTerminalLog(data.message, data.type === 'complete' ? 'success' : 
                    data.type === 'site-complete' ? 'success' :
                    data.type === 'table-complete' ? 'success' :
                    data.type === 'site-start' ? 'step' : 'info');
      
      // Update status
      if (data.type === 'complete') {
        setAggregationStatus('completed');
        setLoading(false);
      } else if (data.type === 'start') {
        setAggregationStatus('running');
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-aggregation');
        socketRef.current.disconnect();
      }
    };
  }, []);

  const addTerminalLog = (message, type = 'info', data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: timestamp, // Store as string, not Date object
      message,
      type,
      data
    };
    setAggregationLogs(prev => [...prev, logEntry]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      const terminalBody = document.querySelector('.terminal-body');
      if (terminalBody) {
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    }, 100);
  };


  const handlePreviewAggregation = async () => {
    if (selectedSitesForAggregation.length < 1) {
      showMessage('error', 'Please select at least 1 site for preview');
      return;
    }

    if (aggregationMode === 'none') {
      showMessage('error', 'Please select an aggregation mode');
      return;
    }

    setIsPreviewLoading(true);
    setAggregationLogs([]);
    
    try {
      // Convert site codes to database names
      const databaseNames = selectedSitesForAggregation.map(siteCode => {
        const db = databases.find(db => db.name.startsWith(`art_${siteCode}_`));
        return db ? db.name : null;
      }).filter(Boolean);

      if (databaseNames.length < 2) {
        showMessage('error', 'Not enough sites with imported data found');
        setIsPreviewLoading(false);
        return;
      }

      const conflictResolution = document.querySelector('input[name="conflictResolution"]:checked')?.value || 'ignore';

      // Add preview logs
      setAggregationLogs(prev => [...prev, {
        id: Date.now(),
        type: 'info',
        message: 'Starting aggregation preview...',
        timestamp: new Date().toLocaleTimeString()
      }]);

      const response = await api.post('/api/data/aggregate/preview', {
        databaseNames: databaseNames,
        mode: aggregationMode,
        targetDatabase: 'preart',
        conflictResolution: conflictResolution
      });

      const result = response.data;
      
      if (result.success) {
        setPreviewData(result.preview);
        setShowPreview(true);
        setAggregationLogs(prev => [...prev, {
          id: Date.now() + 1,
          type: 'success',
          message: `Preview completed! Found ${result.preview.totalRecords} records to aggregate.`,
          timestamp: new Date().toLocaleTimeString()
        }]);
      } else {
        setAggregationLogs(prev => [...prev, {
          id: Date.now() + 1,
          type: 'error',
          message: result.message || 'Preview failed',
          timestamp: new Date().toLocaleTimeString()
        }]);
        showMessage('error', result.message || 'Preview failed');
      }
    } catch (error) {
      setAggregationLogs(prev => [...prev, {
        id: Date.now() + 1,
        type: 'error',
        message: 'Preview failed: ' + error.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
      showMessage('error', 'Preview failed: ' + error.message);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleAggregateData = async () => {
    if (selectedSitesForAggregation.length < 1) {
      showMessage('error', 'Please select at least 1 site for aggregation');
      return;
    }

    if (aggregationMode === 'none') {
      showMessage('error', 'Please select an aggregation mode');
      return;
    }

    setLoading(true);
    setAggregationStatus('running');
    setAggregationProgress(0);
    setAggregationLogs([]);
    setTotalRecords(0);
    setProcessedRecords(0);
    setSiteProgress({});
    
    try {
      // Convert site codes to database names
      const databaseNames = selectedSitesForAggregation.map(siteCode => {
        const db = databases.find(db => db.name.startsWith(`art_${siteCode}_`));
        return db ? db.name : null;
      }).filter(Boolean);

      if (databaseNames.length < 1) {
        showMessage('error', 'No sites with imported data found');
        setLoading(false);
        setAggregationStatus('idle');
        return;
      }

      const conflictResolution = document.querySelector('input[name="conflictResolution"]:checked')?.value || 'ignore';

      // Add initial logs
      addTerminalLog('🚀 Starting data aggregation...', 'start');
      addTerminalLog(`📊 Mode: ${aggregationMode}`, 'info');
      addTerminalLog(`🎯 Target: preart database`, 'info');
      addTerminalLog(`⚙️  Conflict Resolution: ${conflictResolution}`, 'info');
      addTerminalLog(`📁 Databases: ${databaseNames.join(', ')}`, 'info');
      addTerminalLog('', 'separator');

      // Make API call - real-time progress will come via WebSocket
      const response = await api.post('/api/data/aggregate', {
        databaseNames: databaseNames,
        mode: aggregationMode,
        targetDatabase: 'preart',
        conflictResolution: conflictResolution
      });

      const result = response.data;
      
      if (result.success) {
        // Final success message will be handled by WebSocket
        showMessage('success', `Data aggregation completed! ${result.statistics?.totalRecords || 0} records processed.`);
        fetchImportHistory();
      } else {
        setAggregationStatus('error');
        addTerminalLog(`❌ Aggregation failed: ${result.message}`, 'error');
        showMessage('error', result.message || 'Aggregation failed');
        setLoading(false);
      }

    } catch (error) {
      setAggregationStatus('error');
      addTerminalLog(`❌ Aggregation failed: ${error.message}`, 'error');
      showMessage('error', 'Aggregation failed: ' + error.message);
      setLoading(false);
    }
  };

  // Filter sites that have imported databases
  const sitesWithImportedData = sites.filter(site => {
    return databases.some(db => db.name.startsWith(`art_${site.code}_`));
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Data Aggregation</CardTitle>
              <CardDescription>Combine data from multiple sites into a single consolidated dataset</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
        
      {/* Warning about existing data */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Warning:</strong> Aggregating data will combine records from multiple sites into the main database. 
          This operation cannot be undone. Make sure you have a backup before proceeding.
        </AlertDescription>
      </Alert>

      {/* Aggregation Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Aggregation Mode</CardTitle>
          <CardDescription>Choose the type of data aggregation to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'none', label: 'Select Mode', description: 'Choose aggregation mode' },
                { value: 'consolidate', label: 'Consolidate', description: 'Combine all data into main database' }
              ].map((mode) => (
                <Button
                  key={mode.value}
                  variant={aggregationMode === mode.value ? "default" : "outline"}
                  className={`p-4 h-auto text-left justify-start ${
                    aggregationMode === mode.value ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setAggregationMode(mode.value)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{mode.label}</span>
                    <span className="text-xs text-muted-foreground mt-1">{mode.description}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Sites for Aggregation</CardTitle>
          <CardDescription>Choose which sites to include in the aggregation process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sitesWithImportedData.map((site) => {
                const isSelected = selectedSitesForAggregation.includes(site.code);
                return (
                  <div
                    key={site.code}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSitesForAggregation(prev => 
                          prev.filter(code => code !== site.code)
                        );
                      } else {
                        setSelectedSitesForAggregation(prev => [...prev, site.code]);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => {}}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{site.name}</div>
                        <div className="text-xs text-muted-foreground">{site.code}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              Selected: {selectedSitesForAggregation.length} sites
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Conflict Resolution */}
      <Card>
        <CardHeader>
          <CardTitle>Conflict Resolution</CardTitle>
          <CardDescription>How to handle data conflicts during aggregation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="ignore"
                name="conflictResolution"
                value="ignore"
                defaultChecked
                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
              />
              <Label htmlFor="ignore" className="text-sm">
                Ignore Conflicts (Keep existing data)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="overwrite"
                name="conflictResolution"
                value="overwrite"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
              />
              <Label htmlFor="overwrite" className="text-sm">
                Overwrite Conflicts (Use new data)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="merge"
                name="conflictResolution"
                value="merge"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
              />
              <Label htmlFor="merge" className="text-sm">
                Merge Conflicts (Combine data)
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <Button
              onClick={handlePreviewAggregation}
              disabled={selectedSitesForAggregation.length < 1 || aggregationMode === 'none' || isPreviewLoading}
              variant="outline"
              className="flex-1"
            >
              {isPreviewLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Previewing...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Aggregation
                </>
              )}
            </Button>
            
            <Button
              onClick={handleAggregateData}
              disabled={selectedSitesForAggregation.length < 1 || aggregationMode === 'none' || loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Aggregating...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Start Aggregation
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Aggregation Progress */}
      {aggregationStatus !== 'idle' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-lg ${
                aggregationStatus === 'completed' ? 'bg-green-100' :
                aggregationStatus === 'error' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {aggregationStatus === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : aggregationStatus === 'error' ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
                )}
              </div>
              <div>
                <h4 className="text-lg font-medium">
                  {aggregationStatus === 'running' && 'Aggregating Data...'}
                  {aggregationStatus === 'completed' && 'Aggregation Completed!'}
                  {aggregationStatus === 'error' && 'Aggregation Failed'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {aggregationStatus === 'running' && 'Processing data from selected sites'}
                  {aggregationStatus === 'completed' && 'All data has been successfully aggregated'}
                  {aggregationStatus === 'error' && 'There was an error during aggregation'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-semibold">{Math.round(aggregationProgress)}%</span>
              </div>
              <Progress value={aggregationProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Terminal Logs */}
      {aggregationLogs.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Terminal className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <CardTitle>Aggregation Terminal</CardTitle>
                  <CardDescription>Real-time progress and detailed logs</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {aggregationStatus === 'running' && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Processing...</span>
                  </div>
                )}
                <Badge variant="outline" className="font-mono">
                  {aggregationLogs.length} logs
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Terminal Header */}
            <div className="bg-gray-900 rounded-t-lg px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-gray-300 text-sm font-mono">artweb-aggregation</span>
                </div>
                <div className="text-gray-500 text-xs font-mono">
                  {aggregationStatus === 'running' ? 'RUNNING' : 
                   aggregationStatus === 'completed' ? 'COMPLETED' : 
                   aggregationStatus === 'error' ? 'ERROR' : 'IDLE'}
                </div>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="terminal-body bg-gray-900 rounded-b-lg p-4 max-h-80 overflow-y-auto font-mono text-sm">
              {/* Current Status Bar */}
              {aggregationStatus === 'running' && (
                <div className="mb-4 p-3 bg-gray-800 rounded border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 font-semibold">Current Operation</span>
                    <span className="text-gray-400 text-xs">{Math.round(aggregationProgress)}%</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    {currentSite && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">Site:</span>
                        <span className="text-yellow-400">{currentSite}</span>
                      </div>
                    )}
                    {currentTable && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">Table:</span>
                        <span className="text-green-400">{currentTable}</span>
                      </div>
                    )}
                    {processedRecords > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">Records:</span>
                        <span className="text-cyan-400">{processedRecords.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Logs */}
              <div className="space-y-1">
                {aggregationLogs.map((log, index) => (
                  <div key={log.id} className={`flex items-start space-x-3 py-1 hover:bg-gray-800 hover:bg-opacity-50 rounded px-2 ${
                    log.type === 'separator' ? 'border-t border-gray-700 my-2' : ''
                  }`}>
                    {log.type !== 'separator' && (
                      <>
                        <div className="flex-shrink-0 mt-0.5">
                          <span className={`text-xs font-bold ${
                            log.type === 'start' ? 'text-blue-400' :
                            log.type === 'success' ? 'text-green-400' :
                            log.type === 'error' ? 'text-red-400' :
                            log.type === 'step' ? 'text-yellow-400' :
                            'text-gray-400'
                          }`}>
                            {log.type === 'start' ? '▶' :
                             log.type === 'success' ? '✓' :
                             log.type === 'error' ? '✗' :
                             log.type === 'step' ? '●' :
                             'ℹ'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className={`${
                              log.type === 'success' ? 'text-green-300' :
                              log.type === 'error' ? 'text-red-300' :
                              log.type === 'step' ? 'text-yellow-300' :
                              log.type === 'start' ? 'text-blue-300' :
                              'text-gray-300'
                            }`}>
                              {log.message}
                            </span>
                            <span className="text-gray-500 text-xs flex-shrink-0">
                              [{typeof log.timestamp === 'string' ? log.timestamp : log.timestamp.toLocaleTimeString()}]
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Live Cursor */}
              {aggregationStatus === 'running' && (
                <div className="flex items-center space-x-2 mt-2 text-gray-400">
                  <span className="text-green-400">$</span>
                  <span className="animate-pulse">_</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle>Aggregation Preview</DialogTitle>
                <DialogDescription>Preview of data to be aggregated</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {previewData && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Total Records</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{previewData.totalRecords}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Sites</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-1">{previewData.siteCount}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Tables</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900 mt-1">{previewData.tableCount}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Conflicts</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900 mt-1">{previewData.conflictCount || 0}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Site Breakdown</h4>
                <div className="space-y-2">
                  {previewData.sites?.map((site, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-white rounded border">
                      <span className="font-medium">{site.name}</span>
                      <span className="text-sm text-muted-foreground">{site.recordCount} records</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowPreview(false);
                    handleAggregateData();
                  }}
                >
                  Proceed with Aggregation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AggregateTab;