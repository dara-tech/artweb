import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Alert, AlertDescription } from '@/components/ui';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui'
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  FileText, 
  Edit, 
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  ChevronDown,
  X
} from "lucide-react";
import api from "../../../../services/api";

function ChildVisitList() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalVisits, setTotalVisits] = useState(0);
  const [sortBy, setSortBy] = useState('visitDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [localSortBy, setLocalSortBy] = useState('visitDate');
  const [localSortOrder, setLocalSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ageRangeFilter, setAgeRangeFilter] = useState('all');
  const [siteFilter, setSiteFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [nationalityFilter, setNationalityFilter] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    loadVisits();
  }, [currentPage, itemsPerPage, searchTerm, sortBy, sortOrder, statusFilter, ageRangeFilter, siteFilter, dateRangeFilter, nationalityFilter]);

  const loadVisits = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        sortBy,
        sortOrder,
        statusFilter: statusFilter !== 'all' ? statusFilter : undefined,
        ageRange: ageRangeFilter !== 'all' ? ageRangeFilter : undefined,
        site: siteFilter !== 'all' ? siteFilter : undefined,
        dateRange: dateRangeFilter !== 'all' ? dateRangeFilter : undefined,
        nationality: nationalityFilter !== 'all' ? nationalityFilter : undefined,
      };
      
      console.log('API Request Params:', params);
      
      const response = await api.get('/api/visits/child', { params });
      
      setVisits(response.data.visits || []);
      setTotalVisits(response.data.total || 0);
    } catch (error) {
      console.error('Error loading visits:', error);
      setError('Error loading visits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalVisits / itemsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setAgeRangeFilter('all');
    setSiteFilter('all');
    setDateRangeFilter('all');
    setNationalityFilter('all');
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === '1900-01-01') return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getSexDisplay = (sex) => {
    if (sex === 0 || sex === '0') return 'Female';
    if (sex === 1 || sex === '1') return 'Male';
    return 'N/A';
  };

  const getVisitStatusBadge = (status) => {
    const statusMap = {
      0: { label: 'Regular', variant: 'default' },
      1: { label: 'First Visit', variant: 'secondary' },
      2: { label: 'Follow-up', variant: 'outline' },
      3: { label: 'Emergency', variant: 'destructive' }
    };
    const statusInfo = statusMap[status] || { label: 'Unknown', variant: 'secondary' };
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getPatientStatusDisplay = (visit) => {
    const status = visit.patientStatus;
    const statusDate = visit.patientStatusDate;
    const statusCause = visit.statusCause;
    const statusPlace = visit.statusPlace;
    const statusOtherPlace = visit.statusOtherPlace;
    
    const statusMap = {
      '-1': { label: 'Active', variant: 'default', icon: '✓', color: 'green' },
      '0': { label: 'Lost', variant: 'destructive', icon: '⚠', color: 'red' },
      '1': { label: 'Dead', variant: 'destructive', icon: '✕', color: 'red' },
      '3': { label: 'T-Out To', variant: 'outline', icon: '→', color: 'blue' },
      'Active': { label: 'Active', variant: 'default', icon: '✓', color: 'green' },
      'Lost': { label: 'Lost', variant: 'destructive', icon: '⚠', color: 'red' },
      'Dead': { label: 'Dead', variant: 'destructive', icon: '✕', color: 'red' },
      'Transferred Out': { label: 'T-Out To', variant: 'outline', icon: '→', color: 'blue' }
    };
    
    const statusKey = String(status);
    
    // Handle Active status with special green styling
    if (!status || status === 'Active' || status === 'active' || status === -1 || status === '-1') {
      return (
        <div className="flex flex-col items-center space-y-1">
          <Badge variant="default" className="text-xs px-3 py-1 bg-green-100 text-green-800 border-green-200 font-semibold">
            <span className="mr-1">✓</span> Active
          </Badge>
          <div className="text-xs text-green-600 font-medium">Under Care</div>
        </div>
      );
    }
    
    const statusInfo = statusMap[statusKey] || { label: `Status ${status}`, variant: 'secondary', icon: '?', color: 'gray' };
    
    let additionalInfo = '';
    let iconColor = '';
    
    if (statusInfo.label === 'Lost' && statusDate) {
      additionalInfo = `Since ${new Date(statusDate).toLocaleDateString()}`;
      iconColor = 'text-red-500';
    } else if (statusInfo.label === 'T-Out To' && statusCause) {
      additionalInfo = statusCause;
      iconColor = 'text-blue-500';
    } else if (statusInfo.label === 'T-Out To' && statusPlace !== null && statusPlace !== undefined) {
      let placeText = '';
      switch (statusPlace) {
        case 0:
          placeText = 'Home';
          break;
        case 1:
          placeText = 'Hospital';
          break;
        case 2:
          placeText = statusOtherPlace || 'Other';
          break;
        default:
          placeText = 'Unknown';
      }
      additionalInfo = placeText;
      iconColor = 'text-blue-500';
    } else if (statusInfo.label === 'Dead' && statusDate) {
      additionalInfo = `On ${new Date(statusDate).toLocaleDateString()}`;
      iconColor = 'text-red-500';
    } else {
      additionalInfo = 'No details';
      iconColor = 'text-gray-500';
    }
    
    const badgeColorClass = statusInfo.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                           statusInfo.color === 'red' ? 'bg-red-100 text-red-800 border-red-200' :
                           statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                           'bg-gray-100 text-gray-800 border-gray-200';
    
    return (
      <div className="flex flex-col items-center space-y-1">
        <Badge variant={statusInfo.variant} className={`text-xs px-3 py-1 font-semibold ${badgeColorClass}`}>
          <span className={`mr-1 ${iconColor}`}>{statusInfo.icon}</span>
          {statusInfo.label}
        </Badge>
        <div className={`text-xs font-medium text-center max-w-24 ${iconColor}`}>
          {additionalInfo}
        </div>
      </div>
    );
  };

  const getPatientStatusText = (visit) => {
    const status = visit.patientStatus;
    const statusDate = visit.patientStatusDate;
    const statusPlace = visit.statusPlace;
    const statusOtherPlace = visit.statusOtherPlace;
    
    // Show "Active" for patients without status issues, otherwise show the status
    if (!status || status === 'Active' || status === 'active' || status === -1 || status === '-1') return 'Active';
    
    const statusMap = {
      '0': 'Lost',
      '1': 'Dead', 
      '3': 'Transferred Out',
      'Lost': 'Lost',
      'Dead': 'Dead',
      'Transferred Out': 'Transferred Out'
    };
    
    // Convert status to string for consistent lookup
    const statusKey = String(status);
    const baseStatus = statusMap[statusKey] || `Status ${status}`;
    
    // Add additional information based on status
    if (baseStatus === 'Lost' && statusDate) {
      return `${baseStatus} (${new Date(statusDate).toLocaleDateString()})`;
    } else if (baseStatus === 'Transferred Out' && statusPlace) {
      const place = statusPlace === 3 ? statusOtherPlace : 
                   statusPlace === 0 ? 'Home' : 
                   statusPlace === 1 ? 'Hospital' : 'Unknown';
      return `${baseStatus} (${place})`;
    }
    
    // For Dead status, the backend now provides the actual cause description
    return baseStatus;
  };

  // Local sorting for client-side operations (status filtering now handled on backend)
  const sortedVisits = useMemo(() => {
    if (!visits.length) return [];
    
    return [...visits].sort((a, b) => {
      let aVal = a[localSortBy] || '';
      let bVal = b[localSortBy] || '';
      
      // Handle different data types
      if (localSortBy === 'age' || localSortBy === 'hivViral' || localSortBy === 'whoStage') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else if (localSortBy === 'visitDate' || localSortBy === 'nextAppointment') {
        aVal = new Date(aVal).getTime() || 0;
        bVal = new Date(bVal).getTime() || 0;
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      } else {
        // Convert to string for comparison if not already strings
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }
      
      if (localSortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [visits, localSortBy, localSortOrder]);

  const handleLocalSort = (field) => {
    if (localSortBy === field) {
      setLocalSortOrder(localSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setLocalSortBy(field);
      setLocalSortOrder('asc');
    }
  };

  const SortableHeader = ({ field, children, className = "" }) => (
    <button
      onClick={() => handleLocalSort(field)}
      className={`flex items-center space-x-1 hover:text-blue-600 transition-colors font-semibold text-gray-700 ${className}`}
    >
      <span>{children}</span>
      {localSortBy === field && (
        <ChevronDown className={`w-3 h-3 transition-transform ${localSortOrder === 'desc' ? 'rotate-180' : ''}`} />
      )}
    </button>
  );

  // Skeleton Components
  const TableSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-9 gap-4 px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
          <div className="flex justify-center">
            <div className="h-6 bg-gray-200 rounded w-12 animate-pulse" />
          </div>
          <div className="flex justify-center">
            <div className="h-4 bg-gray-200 rounded w-10 animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="flex justify-center">
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )

  const CardSkeleton = () => (
    <div className="grid gap-4 p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const Pagination = () => {
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalVisits)} of {totalVisits} visits</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-0 rounded-xl shadow-sm p-6 border-l-4 border-l-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
              Child Visits
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Child patient visit management • {totalVisits.toLocaleString()} total visits
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={loadVisits}
              variant="outline"
              className="flex items-center gap-2 h-9 px-4 text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </Button>
            <Button
              onClick={() => navigate('/visits/child/new')}
              className="flex items-center gap-2 h-9 px-4 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              New Visit
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search visits..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 h-9"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 h-9"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="h-9 text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 mt-3">
            {['all', 'active', 'lost', 'dead', 'transferred out'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="h-7 px-3 text-xs capitalize"
              >
                {status === 'all' ? 'All' : status}
              </Button>
            ))}
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 pt-4 border-t">
              <Select value={ageRangeFilter} onValueChange={setAgeRangeFilter}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Age Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="0-17">0-17</SelectItem>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55+">55+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={siteFilter} onValueChange={setSiteFilter}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="2101">2101</SelectItem>
                  <SelectItem value="2102">2102</SelectItem>
                  <SelectItem value="2103">2103</SelectItem>
                  <SelectItem value="2104">2104</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Results Count */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t text-sm text-gray-600">
            <span>{visits.length} of {totalVisits} visits</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-20 h-7">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Visits List */}
      {loading ? (
        <Card className="border-0 shadow-lg overflow-hidden">
          {/* Desktop Table Skeleton */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <div className="grid grid-cols-9 gap-4 px-6 py-4 text-sm font-semibold text-gray-700">
                <div>Clinic ID</div>
                <div>Date</div>
                <div>ART Number</div>
                <div>Age</div>
                <div>Sex</div>
                <div>Viral Load</div>
                <div>Next Appointment</div>
                <div>Status</div>
                <div className="text-center">Actions</div>
              </div>
            </div>
            <TableSkeleton />
          </div>

          {/* Mobile Cards Skeleton */}
          <div className="lg:hidden">
            <CardSkeleton />
          </div>
        </Card>
      ) : visits.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No visits found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'No visits match your search criteria.' : 'No visits have been recorded yet.'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => navigate('/visits/child/new')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create First Visit
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Data Table */}
          <Card className="border-0 shadow-lg overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <div className="grid grid-cols-9 gap-4 px-6 py-4 text-sm font-semibold text-gray-700">
                  <SortableHeader field="clinicId">Clinic ID</SortableHeader>
                  <SortableHeader field="visitDate">Date</SortableHeader>
                  <SortableHeader field="artNumber">ART Number</SortableHeader>
                  <SortableHeader field="age">Age</SortableHeader>
                  <SortableHeader field="sex">Sex</SortableHeader>
                  <SortableHeader field="hivViral">Viral Load</SortableHeader>
                  <SortableHeader field="nextAppointment">Next Appointment</SortableHeader>
                  <SortableHeader field="patientStatus">Status</SortableHeader>
                  <div className="text-center">Actions</div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {sortedVisits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No visits found</h3>
                    <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  sortedVisits.map((visit, index) => (
                    <div
                      key={`${visit.clinicId}-${visit.visitId}-${visit.visitDate}-${index}`}
                      className="grid grid-cols-9 gap-4 px-6 py-4 hover:bg-blue-50/50 transition-colors duration-200 group"
                    >
                      <div className="font-mono text-sm text-slate-600">
                        {String(visit.clinicId).padStart(6, '0')}
                      </div>
                      <div className="text-sm text-slate-700">
                        {formatDate(visit.visitDate)}
                      </div>
                      <div className="font-mono text-sm text-slate-600">
                        {visit.artNumber || 'N/A'}
                      </div>
                      <div className="text-sm text-slate-700">
                        {visit.age ? `${visit.age} years` : 'N/A'}
                      </div>
                      <div className="flex justify-center">
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          {getSexDisplay(visit.sex)}
                        </Badge>
                      </div>
                      <div className="text-sm text-center">
                        <span className={visit.hivViral && visit.hivViral !== -1 ? 'text-red-600 font-semibold' : 'text-slate-500'}>
                          {visit.hivViral && visit.hivViral !== -1 ? visit.hivViral : 'N/A'}
                        </span>
                      </div>
                      <div className="text-sm text-slate-700">
                        {visit.nextAppointment && visit.nextAppointment !== '1900-01-01' ? formatDate(visit.nextAppointment) : 'N/A'}
                      </div>
                      <div className="flex justify-center">
                        {getPatientStatusDisplay(visit)}
                      </div>
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/visits/child/${visit.clinicId}/${visit.visitId}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/visits/child/${visit.clinicId}/${visit.visitId}/edit`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Visit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Export Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <div className="grid gap-4 p-4">
                {sortedVisits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No visits found</h3>
                    <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  sortedVisits.map((visit, index) => (
                    <Card key={`${visit.clinicId}-${visit.visitId}-${visit.visitDate}-${index}`} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Visit #{visit.visitId}
                          </h3>
                          <div className="flex gap-1">
                            {getVisitStatusBadge(visit.visitStatus)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Clinic ID:</span>
                            <span className="font-mono text-sm">{String(visit.clinicId).padStart(6, '0')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Date:</span>
                            <span>{formatDate(visit.visitDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">ART:</span>
                            <span className="font-mono text-sm">{visit.artNumber || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-600">Sex:</span>
                            <Badge variant="outline" className="text-xs px-2 py-1">
                              {getSexDisplay(visit.sex)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-600">Viral Load:</span>
                            <span className={`font-semibold ${visit.hivViral && visit.hivViral !== -1 ? 'text-red-600' : 'text-slate-500'}`}>
                              {visit.hivViral && visit.hivViral !== -1 ? visit.hivViral : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-600">Next Appointment:</span>
                            <span className="font-semibold">{visit.nextAppointment && visit.nextAppointment !== '1900-01-01' ? formatDate(visit.nextAppointment) : 'N/A'}</span>
                          </div>
                          {visit.patientStatus && visit.patientStatus !== 'Active' && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-600">Status:</span>
                              {getPatientStatusDisplay(visit)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/visits/child/${visit.clinicId}/${visit.visitId}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/visits/child/${visit.clinicId}/${visit.visitId}/edit`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </Card>

          {/* Pagination */}
          <Pagination />
        </>
      )}
    </div>
  );
}

export default ChildVisitList;