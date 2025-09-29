import React from 'react';
import { Database } from 'lucide-react';
import DataImportExport from './components/DataImportExport';
import DatabaseCleanup from './components/DatabaseCleanup';

const DataManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Management</h1>
              <p className="text-gray-600 mt-2">Import SQL files and export site data</p>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Database Cleanup Component */}
        <DatabaseCleanup />
        
        {/* Data Import/Export Component */}
        <div className="mt-6">
          <DataImportExport />
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
