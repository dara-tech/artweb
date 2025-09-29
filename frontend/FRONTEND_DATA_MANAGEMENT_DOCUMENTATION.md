# 🎨 Frontend Data Management System

**Version:** 1.0  
**Last Updated:** January 15, 2024  
**Status:** ✅ OPERATIONAL

---

## 📋 **Overview**

The Frontend Data Management System provides a comprehensive user interface for importing SQL files and exporting site data in the ART (Antiretroviral Therapy) system. Built with React and modern UI components, it offers an intuitive drag-and-drop interface with real-time progress tracking and status updates.

---

## 🚀 **Features**

### **1. Import Functionality**
- **Drag & Drop Upload**: Intuitive file upload with visual feedback
- **File Validation**: Supports `.sql` and `.h149` files up to 100MB
- **Progress Tracking**: Real-time progress bar with status updates
- **Error Handling**: Comprehensive error reporting and recovery
- **File Preview**: Shows selected file details before import

### **2. Export Functionality**
- **Site Selection**: Dropdown with all available ART sites
- **Site Preview**: Quick preview of site data before export
- **Export Options**: Configurable data inclusion (patients, visits, lookups)
- **Progress Tracking**: Real-time export progress and status
- **File Management**: Automatic file naming with timestamps

### **3. File Management**
- **Export Files List**: View all available export files
- **Download Management**: One-click download functionality
- **File Information**: Display file size, creation date, and metadata
- **Refresh Capability**: Real-time file list updates

---

## 🏗️ **Component Architecture**

### **Main Components**

#### **1. DataManagement.jsx**
- **Purpose**: Main page component and layout
- **Location**: `/src/pages/DataManagement.jsx`
- **Features**:
  - Page header with title and description
  - Container layout for the data management interface
  - Integration with the main application routing

#### **2. DataImportExport.jsx**
- **Purpose**: Core functionality component
- **Location**: `/src/components/DataImportExport.jsx`
- **Features**:
  - Tabbed interface (Import, Export, Files)
  - File upload with drag-and-drop support
  - Site selection and preview functionality
  - Export configuration options
  - File management and download

### **Component Structure**
```
DataManagement/
├── DataManagement.jsx (Main Page)
└── DataImportExport.jsx (Core Component)
    ├── Import Tab
    │   ├── File Upload Area
    │   ├── Progress Tracking
    │   └── Import Button
    ├── Export Tab
    │   ├── Site Selection
    │   ├── Export Options
    │   └── Export Button
    └── Files Tab
        ├── File List Table
        └── Download Actions
```

---

## 🎯 **User Interface**

### **1. Import Tab**
```jsx
// File Upload Area
<div className="border-2 border-dashed rounded-lg p-8 text-center">
  <input type="file" accept=".sql,.h149" />
  <label>Click to select or drag SQL file here</label>
</div>

// Progress Tracking
<div className="w-full bg-gray-200 rounded-full h-2">
  <div className="h-2 rounded-full bg-blue-500" style={{width: '75%'}} />
</div>
```

### **2. Export Tab**
```jsx
// Site Selection
<select value={selectedSite} onChange={handleSiteChange}>
  <option value="">Choose a site...</option>
  {sites.map(site => (
    <option key={site.Sid} value={site.Sid}>
      {site.Sid} - {site.SiteName}
    </option>
  ))}
</select>

// Export Options
<div className="space-y-3">
  <label>
    <input type="checkbox" checked={includePatients} />
    Include Patient Data
  </label>
  <label>
    <input type="checkbox" checked={includeVisits} />
    Include Visit Data
  </label>
  <label>
    <input type="checkbox" checked={includeLookups} />
    Include Lookup Tables
  </label>
</div>
```

### **3. Files Tab**
```jsx
// File List Table
<table className="min-w-full divide-y divide-gray-300">
  <thead>
    <tr>
      <th>Filename</th>
      <th>Size</th>
      <th>Created</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {files.map(file => (
      <tr key={file.filename}>
        <td>{file.filename}</td>
        <td>{formatFileSize(file.size)}</td>
        <td>{formatDate(file.created)}</td>
        <td>
          <button onClick={() => downloadFile(file.filename)}>
            <Download className="h-4 w-4" />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## 🔧 **API Integration**

### **Import API**
```javascript
// File Upload
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('importMode', 'replace');

const response = await fetch('/api/data/import', {
  method: 'POST',
  body: formData
});
```

### **Export API**
```javascript
// Site Data Export
const response = await fetch('/api/data/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    siteCode: selectedSite,
    includePatients: true,
    includeVisits: true,
    includeLookups: false
  })
});
```

### **File Management API**
```javascript
// Get Export Files
const response = await fetch('/api/data/exports');
const files = await response.json();

// Download File
const response = await fetch(`/api/data/exports/${filename}`);
const blob = await response.blob();
```

---

## 🎨 **Styling & Design**

### **Design System**
- **Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Colors**: Blue primary, Green success, Red error
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid system

### **Responsive Design**
- **Mobile**: Collapsible sidebar, stacked layout
- **Tablet**: Optimized spacing and touch targets
- **Desktop**: Full sidebar, multi-column layout

### **Visual Feedback**
- **Loading States**: Spinner animations and progress bars
- **Success States**: Green checkmarks and success messages
- **Error States**: Red alerts and error messages
- **Hover Effects**: Subtle color changes and transitions

---

## 📱 **User Experience**

### **1. Import Workflow**
1. **File Selection**: Drag & drop or click to select SQL file
2. **File Validation**: Automatic validation of file type and size
3. **Import Process**: Real-time progress tracking
4. **Completion**: Success/error feedback with detailed results

### **2. Export Workflow**
1. **Site Selection**: Choose site from dropdown list
2. **Preview Data**: Optional preview of site data
3. **Configure Options**: Select data types to include
4. **Export Process**: Real-time progress tracking
5. **File Management**: Download or manage exported files

### **3. File Management**
1. **View Files**: List all available export files
2. **File Details**: Size, creation date, and metadata
3. **Download**: One-click download functionality
4. **Refresh**: Update file list in real-time

---

## 🔒 **Error Handling**

### **File Upload Errors**
```javascript
// File Type Validation
if (!file.name.endsWith('.sql') && !file.name.endsWith('.h149')) {
  showMessage('error', 'Please select a .sql or .h149 file');
}

// File Size Validation
if (file.size > 100 * 1024 * 1024) {
  showMessage('error', 'File size exceeds 100MB limit');
}
```

### **API Error Handling**
```javascript
try {
  const response = await fetch('/api/data/import', options);
  const result = await response.json();
  
  if (result.success) {
    showMessage('success', 'Import completed successfully!');
  } else {
    showMessage('error', result.message || 'Import failed');
  }
} catch (error) {
  showMessage('error', 'Import failed: ' + error.message);
}
```

### **User Feedback**
- **Success Messages**: Green background with checkmark icon
- **Error Messages**: Red background with alert icon
- **Loading States**: Spinner with progress percentage
- **Validation Errors**: Inline error messages

---

## 🚀 **Getting Started**

### **1. Prerequisites**
- Node.js 16+ and npm
- React 18+
- Tailwind CSS
- Lucide React icons

### **2. Installation**
```bash
cd frontend
npm install
```

### **3. Development**
```bash
npm run dev
```

### **4. Access**
- **Frontend**: http://localhost:5173
- **Data Management**: http://localhost:5173/data-management

---

## 📊 **Performance**

### **Optimizations**
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Debouncing**: Input validation debounced
- **File Chunking**: Large files processed in chunks

### **Bundle Size**
- **Main Bundle**: ~150KB gzipped
- **Icons**: Tree-shaken, only used icons included
- **Styles**: Tailwind CSS purged for production

---

## 🧪 **Testing**

### **Component Testing**
```javascript
// Example test for file upload
import { render, fireEvent } from '@testing-library/react';
import DataImportExport from './DataImportExport';

test('handles file selection', () => {
  const { getByLabelText } = render(<DataImportExport />);
  const fileInput = getByLabelText(/select file/i);
  
  const file = new File(['test'], 'test.sql', { type: 'text/plain' });
  fireEvent.change(fileInput, { target: { files: [file] } });
  
  expect(fileInput.files[0]).toBe(file);
});
```

### **Integration Testing**
- **API Integration**: Mock API responses
- **File Upload**: Test file validation and upload
- **Export Process**: Test site selection and export
- **Error Handling**: Test error scenarios

---

## 🔮 **Future Enhancements**

### **Planned Features**
- **Batch Import**: Multiple file upload support
- **Import History**: Track import operations
- **Advanced Filters**: Filter export files by date/site
- **Scheduled Exports**: Automated export scheduling
- **Data Validation**: Pre-import data validation
- **Export Templates**: Save export configurations

### **Performance Improvements**
- **Web Workers**: Background file processing
- **Streaming**: Large file streaming support
- **Caching**: Client-side file caching
- **Compression**: File compression for exports

---

## 📞 **Support**

For technical support or questions about the Frontend Data Management System, please refer to the main system documentation or contact the development team.

**System Status:** ✅ OPERATIONAL  
**Last Tested:** January 15, 2024  
**Frontend URL:** http://localhost:5173/data-management  
**Backend API:** http://localhost:3001/api/data
