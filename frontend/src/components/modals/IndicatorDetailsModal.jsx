import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Button, Input, Badge, Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox, Skeleton } from "@/components/ui";
import { 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Download,
  RefreshCw,
  AlertTriangle,
  FileText,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { formatDateForTable } from '@/utils/dateFormatter';
import { getCorrectPatientType, getDemographicBreakdown } from '@/utils/ageCalculator';

const IndicatorDetailsModal = ({
  isOpen,
  onClose,
  selectedIndicator,
  indicatorDetails = [],
  pagination,
  detailsLoading = false,
  searchLoading = false,
  searchTerm = '',
  onSearchChange,
  onSearch,
  onClearSearch,
  onPageChange,
  currentFilters = {},
  error = null
}) => {
  // Provide default pagination object with safe access
  const safePagination = pagination && typeof pagination === 'object' ? pagination : { page: 1, totalPages: 1, totalCount: 0, hasPrev: false, hasNext: false };
  const [viewMode, setViewMode] = useState('table') // 'table' or 'card'
  const [sortField, setSortField] = useState('clinicid')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedRecords, setSelectedRecords] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const itemsPerPageOptions = [10, 20, 50, 100]

  if (!isOpen) return null;

  // Debug logging - only when modal opens with data
  if (isOpen && indicatorDetails.length > 0) {
    console.log('🔍 Modal loaded with', indicatorDetails.length, 'records');
    console.log('📊 Modal pagination:', pagination);
    console.log('📊 Safe pagination:', safePagination);
    console.log('📊 Total count from safePagination:', safePagination?.totalCount);
    console.log('📊 Sample record:', indicatorDetails[0]);
    console.log('📊 Available fields:', Object.keys(indicatorDetails[0] || {}));
  }

  // Skeleton loading component for table rows
  const SkeletonRow = () => (
    <TableRow>
      {Array.from({ length: 8 }, (_, index) => (
        <TableCell key={index} className="text-xs px-2 py-2">
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );

  // Get column configuration based on indicator type
  const getColumnConfig = (indicatorName) => {
    const baseColumns = [
      { key: 'clinicid', label: 'Clinic ID', type: 'text' },
      { key: 'sex_display', label: 'Sex', type: 'badge' },
      { key: 'patient_type', label: 'Type', type: 'badge' },
      { key: 'age', label: 'Age', type: 'number' },
      { key: 'DaBirth', label: 'Birth Date', type: 'date' },
      { key: 'DafirstVisit', label: 'First Visit', type: 'date' }
    ];

    const artColumns = [
      { key: 'ART', label: 'ART Number', type: 'text' },
      { key: 'DaArt', label: 'ART Start', type: 'date' },
      { key: 'Startartstatus', label: 'ART Duration', type: 'badge' }
    ];

    const vlColumns = [
      { key: 'LastVLDate', label: 'Last VL Date', type: 'date' },
      { key: 'LastVLLoad', label: 'Last VL Load', type: 'number' },
      { key: 'StatusVL', label: 'VL Status', type: 'badge' }
    ];

    const tptColumns = [
      { key: 'Tptdrugname', label: 'TPT Drug', type: 'text' },
      { key: 'dateStart', label: 'TPT Start', type: 'date' },
      { key: 'tptstatus', label: 'TPT Status', type: 'badge' }
    ];

    const specializedColumns = [
      { key: 'return_type', label: 'Return Type', type: 'text' },
      { key: 'art_number', label: 'ART Number', type: 'text' },
      { key: 'death_date', label: 'Death Date', type: 'date' },
      { key: 'MMDStatus', label: 'MMD Status', type: 'badge' },
      { key: 'TLDStatus', label: 'TLD Status', type: 'badge' }
    ];

    let columns = [...baseColumns];

    // Add columns based on indicator type
    if (indicatorName?.includes('MMD') || indicatorName?.includes('TLD') || 
        indicatorName?.includes('Eligible MMD')) {
      columns = [...columns, ...artColumns];
    }
    
    // Special case for Active ART indicators - exclude ART Duration for indicator 1
    if (indicatorName?.includes('Active ART')) {
      if (indicatorName?.includes('1. Active ART patients in previous quarter')) {
        // For indicator 1, use ART columns without ART Duration
        const artColumnsWithoutDuration = artColumns.filter(col => col.key !== 'Startartstatus');
        columns = [...columns, ...artColumnsWithoutDuration];
      } else {
        // For other Active ART indicators, use full ART columns
        columns = [...columns, ...artColumns];
      }
    }

    if (indicatorName?.includes('VL') || indicatorName?.includes('suppression')) {
      columns = [...columns, ...vlColumns];
      
      // Add VL-specific columns for eligible VL test indicator
      if (indicatorName?.includes('Eligible for VL test')) {
        columns = [...columns, 
          { key: 'MonthsOnART', label: 'Months on ART', type: 'number' },
          { key: 'MonthsSinceLastVL', label: 'Months Since Last VL', type: 'number' }
        ];
      }
    }

    if (indicatorName?.includes('TPT')) {
      columns = [...columns, ...tptColumns];
    }

    if (indicatorName?.includes('Lost and Return')) {
      columns = [...columns, 
        { key: 'return_type', label: 'Return Type', type: 'text' },
        { key: 'art_number', label: 'ART Number', type: 'text' }
      ];
    }

    if (indicatorName?.includes('Dead')) {
      columns = [...columns, 
        { key: 'death_date', label: 'Death Date', type: 'date' }
      ];
    }

    if (indicatorName?.includes('MMD')) {
      columns = [...columns, 
        { key: 'MMDStatus', label: 'MMD Status', type: 'badge' }
      ];
    }

    if (indicatorName?.includes('TLD')) {
      columns = [...columns, 
        { key: 'TLDStatus', label: 'TLD Status', type: 'badge' }
      ];
    }

    return columns;
  };

  const columnConfig = getColumnConfig(selectedIndicator?.Indicator);

  // Add corrected patient type field and convert sex to display text
  const processedRecords = indicatorDetails.map(record => ({
    ...record,
    corrected_patient_type: getCorrectPatientType(record),
    // Handle both old and new field names
    sex_display: record.sex_display || (record.Sex === 1 ? 'Male' : record.Sex === 0 ? 'Female' : 'Unknown'),
    patient_type: record.patient_type || getCorrectPatientType(record)
  }));

  // Sorting functionality
  const sortedRecords = [...processedRecords].sort((a, b) => {
    const aValue = a[sortField] || ''
    const bValue = b[sortField] || ''
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectRecord = (recordId) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    )
  }

  const handleSelectAll = () => {
    if (selectedRecords.length === processedRecords.length) {
      setSelectedRecords([])
    } else {
      setSelectedRecords(processedRecords.map(r => r.clinicid))
    }
  }

  const exportRecords = async () => {
    if (indicatorDetails.length === 0) return;
    
    // Show loading state
    const button = document.querySelector('[data-export-button]');
    const originalContent = button?.innerHTML;
    if (button) {
      button.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-1"></div>Loading...';
      button.disabled = true;
    }
    
    try {
      // Use the existing API endpoint with a high limit to get all records
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      
      // Map indicator names to their corresponding SQL file names (same as in dashboard)
      const indicatorMap = {
        '1. Active ART patients in previous quarter': '01_active_art_previous',
        '2. Active Pre-ART patients in previous quarter': '02_active_pre_art_previous',
        '3. Newly Enrolled': '03_newly_enrolled',
        '4. Re-tested positive': '04_retested_positive',
        '5. Newly Initiated': '05_newly_initiated',
        '5.1.1. New ART started: Same day': '05.1.1_art_same_day',
        '5.1.2. New ART started: 1-7 days': '05.1.2_art_1_7_days',
        '5.1.3. New ART started: >7 days': '05.1.3_art_over_7_days',
        '5.2. New ART started with TLD': '05.2_art_with_tld',
        '6. Transfer-in patients': '06_transfer_in',
        '7. Lost and Return': '07_lost_and_return',
        '8.1. Dead': '08.1_dead',
        '8.2. Lost to follow up (LTFU)': '08.2_lost_to_followup',
        '8.3. Transfer-out': '08.3_transfer_out',
        '9. Active Pre-ART': '09_active_pre_art',
        '10. Active ART patients in this quarter': '10_active_art_current',
        '10.1. Eligible MMD': '10.1_eligible_mmd',
        '10.2. MMD': '10.2_mmd',
        '10.3. TLD': '10.3_tld',
        '10.4. TPT Start': '10.4_tpt_start',
        '10.5. TPT Complete': '10.5_tpt_complete',
        '10.6. Eligible for VL test': '10.6_eligible_vl_test',
        '10.7. VL tested in 12M': '10.7_vl_tested_12m',
        '10.8. VL suppression': '10.8_vl_suppression'
      };

      const indicatorKey = indicatorMap[selectedIndicator?.Indicator] || selectedIndicator?.Indicator;
      
      const params = new URLSearchParams({
        limit: safePagination?.totalCount || 10000,
        page: 1,
        search: searchTerm || ''
      });
      
      const response = await fetch(`${API_BASE_URL}/indicators-optimized/${indicatorKey}/details?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch all records');
      }
      
      const data = await response.json();
      const allRecords = data.data || indicatorDetails;
      
      // Use dynamic headers based on column config
      const headers = columnConfig.map(col => col.label);
      
      // Convert data to CSV format
      const csvContent = [
        headers.join(','),
        ...allRecords.map(record => 
          columnConfig.map(col => {
            const value = record[col.key] || (col.altKey ? record[col.altKey] : null);
            let displayValue = value || 'N/A';
            
            if (col.type === 'date' && value) {
              displayValue = new Date(value).toLocaleDateString();
            }
            
            // Escape CSV values properly
            return `"${String(displayValue).replace(/"/g, '""')}"`;
          }).join(','))
      ].join('\n');
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedIndicator?.Indicator?.replace(/[^a-zA-Z0-9]/g, '_')}-all-records.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Export failed:', error);
      // Fallback to current page data
      const headers = columnConfig.map(col => col.label);
      
      const csvContent = [
        headers.join(','),
        ...processedRecords.map(record => 
          columnConfig.map(col => {
            const value = record[col.key] || (col.altKey ? record[col.altKey] : null);
            let displayValue = value || 'N/A';
            
            if (col.type === 'date' && value) {
              displayValue = new Date(value).toLocaleDateString();
            }
            
            // Escape CSV values properly
            return `"${String(displayValue).replace(/"/g, '""')}"`;
          }).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedIndicator?.Indicator?.replace(/[^a-zA-Z0-9]/g, '_')}-records.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      // Restore button state
      if (button) {
        button.innerHTML = originalContent || '<Download className="h-4 w-4 mr-1" />CSV';
        button.disabled = false;
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-3xl lg:max-w-5xl h-[95vh] max-h-[95vh] p-0 flex flex-col">
        <DialogHeader className="p-4 pb-3 border-b flex-shrink-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <div className="p-1.5 bg-blue-600 rounded-lg flex-shrink-0 mt-0.5">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                {detailsLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  <>
                    <DialogTitle className="text-base sm:text-xl font-semibold text-foreground leading-tight">
                      {selectedIndicator?.Indicator}
                      {currentFilters.gender && currentFilters.ageGroup && (
                        <span className="block text-sm font-normal text-primary mt-1">
                          {currentFilters.gender === 'male' ? 'Male' : 'Female'} patients aged {currentFilters.ageGroup === '0-14' ? '0-14' : '15+'} years
                        </span>
                      )}
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-base text-muted-foreground mt-1">
                      {processedRecords.length.toLocaleString()} of {(safePagination?.totalCount || 0).toLocaleString()} records
                      {currentFilters.gender && currentFilters.ageGroup && (
                        <span className="block text-xs text-primary">
                          Filtered by: {currentFilters.gender} • {currentFilters.ageGroup}
                        </span>
                      )}
                    </DialogDescription>
                  </>
                )}
              </div>
            </div>
           
          </div>{/* Search and Controls */}
              <div className="flex flex-row items-center gap-2">
                <div className="relative flex-1">
                  {searchLoading ? (
                    <RefreshCw className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                  ) : (
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  )}
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 h-10"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        onSearch(1, searchTerm);
                      }
                    }}
                    disabled={detailsLoading || searchLoading}
                  />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {detailsLoading ? (
                    <>
                      <Skeleton className="w-16 h-9" />
                      <Skeleton className="w-20 h-9" />
                    </>
                  ) : (
                    <>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                        <SelectTrigger className="w-16 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {itemsPerPageOptions.map(option => (
                            <SelectItem key={option} value={option.toString()}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={exportRecords} 
                        variant="outline"
                        size="sm"
                        className="h-9 whitespace-nowrap"
                        data-export-button
                        disabled={indicatorDetails.length === 0}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        CSV
                      </Button>
                    </>
                  )}
                </div>
              </div>
        </DialogHeader> 

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <div className="p-4 ">
             

              {/* Records Table */}
              <div className="border overflow-hidden">
                {detailsLoading || searchLoading ? (
                  <div className="overflow-auto scrollbar-hide">
                    <Table>
                      <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow className="bg-muted">
                          {Array.from({ length: 8 }, (_, index) => (
                            <TableHead 
                              key={index}
                              className="text-xs px-2 py-3 whitespace-nowrap"
                            >
                              <Skeleton className="h-4 w-16" />
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: itemsPerPage }, (_, index) => (
                          <SkeletonRow key={index} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-destructive mb-2">Error Loading Data</h3>
                    <p className="text-destructive mb-4">
                      {error}
                    </p>
                    <Button 
                      onClick={() => onSearch(1, searchTerm)}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                ) : processedRecords.length === 0 ? (
                  <div className="p-8 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No Records Found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No records match your search criteria.' : 'No records found for this indicator.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-auto scrollbar-hide" style={{ maxHeight: 'calc(95vh - 300px)' }}>
                    <Table>
                      <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow className="bg-primary/10 border-b-2 border-primary/30">
                          {columnConfig.map((column, index) => (
                            <TableHead 
                              key={index}
                              className={`cursor-pointer hover:bg-primary/20 text-xs px-2 py-3 whitespace-nowrap text-primary font-medium ${index < columnConfig.length - 1 ? 'border-r border-primary/30' : ''}`}
                              onClick={() => handleSort(column.key)}
                            >
                              <div className="flex items-center space-x-1">
                                <span className="truncate max-w-[80px]">{column.label}</span>
                                {sortField === column.key && (
                                  sortDirection === 'asc' ? <SortAsc className="h-3 w-3 flex-shrink-0" /> : <SortDesc className="h-3 w-3 flex-shrink-0" />
                                )}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedRecords.map((record, index) => (
                          <TableRow key={index} className="hover:bg-muted/50 border-b border-border">
                            {columnConfig.map((column, colIndex) => {
                              const value = record[column.key] || (column.altKey ? record[column.altKey] : null);
                              let displayValue = value || 'N/A';
                              
                              if (column.type === 'date' && value) {
                                displayValue = formatDateForTable(value);
                              }
                              
                              return (
                                <TableCell key={colIndex} className={`text-xs px-2 py-2 max-w-[100px] ${colIndex < columnConfig.length - 1 ? 'border-r border-border' : ''}`}>
                                  {column.type === 'badge' ? (
                                    <Badge 
                                      variant="outline"
                                      className={`text-xs px-1 py-0 ${
                                        column.key === 'sex_display' 
                                          ? displayValue === 'Male' 
                                            ? 'badge-male' 
                                            : 'badge-female'
                                          : column.key === 'patient_type'
                                          ? displayValue === 'Adult' 
                                            ? 'badge-adult'
                                            : displayValue === 'Child'
                                            ? 'badge-child'
                                            : 'badge-infant'
                                          : column.key === 'Startartstatus'
                                          ? displayValue === 'New' 
                                            ? 'badge-primary'
                                            : displayValue === 'Continuing'
                                            ? 'badge-secondary'
                                            : 'badge-muted'
                                          : column.key === 'StatusVL'
                                          ? displayValue === 'DO VL' 
                                            ? 'badge-warning'
                                            : displayValue === 'VL-Suppression'
                                            ? 'badge-success'
                                            : displayValue === 'Not-Suppression'
                                            ? 'badge-destructive'
                                            : 'badge-muted'
                                          : column.key === 'tptstatus'
                                          ? displayValue === 'TPT Complete' 
                                            ? 'badge-success'
                                            : displayValue === 'Not complete'
                                            ? 'badge-warning'
                                            : 'badge-muted'
                                          : 'badge-muted'
                                      }`}
                                    >
                                      <span className="truncate">{displayValue}</span>
                                    </Badge>
                                  ) : column.key === 'clinicid' ? (
                                    <div className="flex items-center space-x-1">
                                      <span className="font-medium truncate text-primary">{displayValue}</span>
                                    </div>
                                  ) : column.key === 'age' ? (
                                    <span className="truncate block font-medium text-foreground" title={displayValue}>{displayValue}</span>
                                  ) : column.type === 'date' ? (
                                    <span className="truncate block text-muted-foreground" title={displayValue}>{displayValue}</span>
                                  ) : (
                                    <span className="truncate block" title={displayValue}>{displayValue}</span>
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>

           {/* Pagination - Fixed at bottom */}
           {(safePagination?.totalPages || 0) > 1 && !detailsLoading && (
             <div className="border-t bg-card p-4 flex-shrink-0">
               <div className="flex items-center justify-between">
                 <div className="text-xs text-muted-foreground">
                   Page {safePagination?.page || 1} of {safePagination?.totalPages || 1}
                 </div>
                 <div className="flex items-center space-x-1">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => onPageChange((safePagination?.page || 1) - 1)}
                     disabled={!safePagination?.hasPrev || detailsLoading}
                     className="h-8 w-8 p-0"
                   >
                     <ChevronLeft className="h-4 w-4" />
                   </Button>
                   
                   {/* Mobile: Show only current page and adjacent pages */}
                   <div className="flex items-center space-x-1 sm:hidden">
                     {[(safePagination?.page || 1) - 1, safePagination?.page || 1, (safePagination?.page || 1) + 1]
                       .filter(page => page >= 1 && page <= (safePagination?.totalPages || 1))
                       .map(pageNum => (
                         <Button
                           key={pageNum}
                           variant={(safePagination?.page || 1) === pageNum ? "default" : "outline"}
                           size="sm"
                           onClick={() => onPageChange(pageNum)}
                           disabled={detailsLoading}
                           className="w-8 h-8 p-0 text-xs"
                         >
                           {pageNum}
                         </Button>
                       ))
                     }
                   </div>
 
                   {/* Desktop: Show more pages */}
                   <div className="hidden sm:flex items-center space-x-1">
                     {Array.from({ length: Math.min(5, safePagination?.totalPages || 1) }, (_, i) => {
                       const pageNum = Math.max(1, Math.min((safePagination?.totalPages || 1) - 4, (safePagination?.page || 1) - 2)) + i;
                       if (pageNum > (safePagination?.totalPages || 1)) return null;
                       
                       return (
                         <Button
                           key={pageNum}
                           variant={(safePagination?.page || 1) === pageNum ? "default" : "outline"}
                           size="sm"
                           onClick={() => onPageChange(pageNum)}
                           disabled={detailsLoading}
                           className="w-8 h-8 p-0"
                         >
                           {pageNum}
                         </Button>
                       );
                     })}
                   </div>
                   
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => onPageChange((safePagination?.page || 1) + 1)}
                     disabled={!safePagination?.hasNext || detailsLoading}
                     className="h-8 w-8 p-0"
                   >
                     <ChevronRight className="h-4 w-4" />
                   </Button>
                 </div>
               </div>
             </div>
           )}
           
           {/* Skeleton pagination during loading */}
           {detailsLoading && (
             <div className="border-t bg-card p-4 flex-shrink-0">
               <div className="flex items-center justify-between">
                 <Skeleton className="h-4 w-24" />
                 <div className="flex items-center space-x-1">
                   <Skeleton className="h-8 w-8" />
                   <Skeleton className="h-8 w-8" />
                   <Skeleton className="h-8 w-8" />
                   <Skeleton className="h-8 w-8" />
                 </div>
               </div>
             </div>
           )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IndicatorDetailsModal;
