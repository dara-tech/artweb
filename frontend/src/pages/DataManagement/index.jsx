import React from 'react';
import { Upload } from 'lucide-react';
import DataImportExport from './components/DataImportExport';

const DataManagement = () => {
  return (
    <div className="min-h-screen">
      <div className="p-6">
        <DataImportExport />
      </div>
    </div>
  );
};

export default DataManagement;
