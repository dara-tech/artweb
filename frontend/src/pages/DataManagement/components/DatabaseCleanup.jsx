import React, { useState } from 'react';
import { Trash2, Play, CheckCircle, XCircle, AlertCircle, Clock, Terminal } from 'lucide-react';
import api from "../../../services/api";

const DatabaseCleanup = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progressLog, setProgressLog] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [distribution, setDistribution] = useState(null);

  const getLogIcon = (type) => {
    switch (type) {
      case 'start':
        return '▶';
      case 'step':
        return '●';
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'start':
        return 'text-blue-400';
      case 'step':
        return 'text-yellow-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'info':
      default:
        return 'text-gray-400';
    }
  };

  const handleCleanAndAggregate = async () => {
    setIsRunning(true);
    setProgressLog([]);
    setIsCompleted(false);
    setError(null);
    setDistribution(null);

    try {
      const response = await api.post('/api/cleanup/clean-and-aggregate');
      
      if (response.data.success) {
        setProgressLog(response.data.progressLog || []);
        setDistribution(response.data.distribution);
        setIsCompleted(true);
      } else {
        setError(response.data.message || 'Cleanup failed');
        setProgressLog(response.data.progressLog || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      setProgressLog(err.response?.data?.progressLog || []);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCleanAllTables = async () => {
    if (!window.confirm('⚠️ WARNING: This will delete ALL data from ALL 85 tables!\n\nThis action cannot be undone. Only reference tables will be preserved.\n\nAre you absolutely sure you want to continue?')) {
      return;
    }

    setIsRunning(true);
    setProgressLog([]);
    setIsCompleted(false);
    setError(null);
    setDistribution(null);

    try {
      const response = await api.post('/api/cleanup/clean-all-tables');
      
      if (response.data.success) {
        setProgressLog(response.data.progressLog || []);
        setIsCompleted(true);
      } else {
        setError(response.data.message || 'Cleanup failed');
        setProgressLog(response.data.progressLog || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      setProgressLog(err.response?.data?.progressLog || []);
    } finally {
      setIsRunning(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Terminal className="h-5 w-5 text-gray-600" />
            <div>
              <h2 className="text-lg font-medium text-gray-900">Database Cleanup</h2>
              <p className="text-sm text-gray-600">Clean and aggregate data across 4 sites</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCleanAllTables}
              disabled={isRunning}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isRunning
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isRunning ? 'Running...' : 'Clean All'}
            </button>
            <button
              onClick={handleCleanAndAggregate}
              disabled={isRunning}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isRunning
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isRunning ? 'Running...' : 'Clean & Aggregate'}
            </button>
          </div>
        </div>
      </div>

      {/* Console */}
      {(progressLog.length > 0 || isRunning) && (
        <div className="bg-black text-green-400 font-mono text-sm">
          {/* Console Header */}
          <div className="border-b border-gray-800 px-4 py-2 bg-gray-900">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-xs">Database Cleanup Console</span>
              {isRunning && (
                <div className="flex items-center space-x-1 ml-auto">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Running</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Console Content */}
          <div className="p-4 max-h-80 overflow-y-auto">
            {progressLog.length === 0 && isRunning && (
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">●</span>
                <span>Initializing cleanup process...</span>
              </div>
            )}
            
            {progressLog.map((log, index) => (
              <div key={index} className="flex items-start space-x-2 py-0.5 hover:bg-gray-900 hover:bg-opacity-50">
                <span className="text-gray-500 text-xs font-mono mt-0.5 w-16 flex-shrink-0">
                  {formatTimestamp(log.timestamp)}
                </span>
                <span className={`${getLogColor(log.type)} flex-shrink-0 w-4`}>
                  {getLogIcon(log.type)}
                </span>
                <span className="flex-1 leading-relaxed">{log.message}</span>
              </div>
            ))}
            
            {isRunning && (
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-gray-500 text-xs font-mono w-16">
                  {formatTimestamp(new Date().toISOString())}
                </span>
                <span className="text-blue-400 animate-pulse">▶</span>
                <span className="text-gray-300">Processing...</span>
                <div className="flex space-x-1 ml-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Messages */}
      <div className="p-4 space-y-3">
        {error && (
          <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {isCompleted && !error && (
          <div className="flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Completed</p>
              <p className="text-sm text-green-700">Database cleanup completed successfully</p>
            </div>
          </div>
        )}

        {/* Distribution Results - Compact Grid */}
        {distribution && (
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Distribution Results</h3>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { title: 'Adult Patients', data: distribution.adultPatients, color: 'blue' },
                  { title: 'Child Patients', data: distribution.childPatients, color: 'green' },
                  { title: 'Infant Patients', data: distribution.infantPatients, color: 'purple' },
                  { title: 'Adult Visits', data: distribution.adultVisits, color: 'orange' },
                  { title: 'Child Visits', data: distribution.childVisits, color: 'teal' },
                  { title: 'Infant Visits', data: distribution.infantVisits, color: 'pink' }
                ].map((section, idx) => (
                  <div key={idx} className={`bg-${section.color}-50 rounded p-2 border border-${section.color}-200`}>
                    <h4 className={`text-xs font-medium text-${section.color}-900 mb-1`}>{section.title}</h4>
                    <div className="space-y-0.5">
                      {section.data.map((dist, index) => (
                        <div key={index} className={`text-xs text-${section.color}-700`}>
                          Site {dist.site_code}: {dist.count}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Warning</p>
            <p className="text-xs text-yellow-700 mt-1">
              Both operations cannot be undone. Clean All deletes everything, Clean & Aggregate reorganizes data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseCleanup;
