import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Alert, AlertDescription, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, Skeleton } from "@/components/ui";
import React, { useState, useEffect } from 'react'
import api from "../../../../../services/api"
import { 
  RefreshCw, 
  Users, 
  Eye,
  Edit,
  MoreVertical,
  Download,
  Plus,
  MapPin,
  Building2,
  AlertCircle,
  CheckCircle,
  SortAsc,
  SortDesc,
  Menu,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  User
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui"
import { useSite } from "../../../../../contexts/SiteContext"

function PatientList({ 
  searchTerm, 
  setSearchTerm, 
  selectPatient, 
  onNewPatient,
  selectedSite
}) {
  // Track if we're currently filtering by site
  const [isFilteringBySite, setIsFilteringBySite] = useState(false)
  // Track if user has explicitly chosen to filter by site
  const [userSelectedSite, setUserSelectedSite] = useState(null)
  // Internal state for data management
  const [patients, setPatients] = useState([])
  const [totalPatients, setTotalPatients] = useState(0)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25) // Show 25 patients per page by default for better performance
  const { isMultiSite } = useSite()
  // State for available sites
  const [availableSites, setAvailableSites] = useState([])
  const [sortBy, setSortBy] = useState('clinicId')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filters, setFilters] = useState({
    gender: 'all',
    status: 'all',
    siteCode: 'all',
    ageRange: 'all',
    referral: 'all',
    artNumber: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  
  // Debug: Force refresh to clear cache issues
  console.log('PatientList component loaded - version 2.0')
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Load patients data with pagination and filtering
  const loadPatientsList = async (page = currentPage, limit = itemsPerPage) => {
    try {
      setLoading(true)
      setError(null)
      
      // Build API URL with pagination and filtering
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      })
      
      // Add search term
      if (searchTerm?.trim()) {
        params.append('search', searchTerm.trim())
      }
      
      // Add site filter if user has explicitly selected a site
      if (userSelectedSite?.name) {
        params.append('site', userSelectedSite.name)
        setIsFilteringBySite(true)
      } else {
        setIsFilteringBySite(false)
      }
      
      // Add other filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value)
        }
      })
      
      const response = await api.get(`/api/patients/child?${params.toString()}`)
      setPatients(response.data.patients || [])
      setTotalPatients(response.data.total || 0)
    } catch (err) {
      console.error('Error loading patients:', err)
      
      if (err.response?.status === 401) {
        setError('Please log in to view patient data')
      } else if (err.response?.status === 403) {
        setError('Access denied. Please check your permissions')
      } else if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to server. Please check if the backend is running')
      } else {
        setError(err.response?.data?.message || 'Failed to load patients')
      }
    } finally {
      setLoading(false)
    }
  }

  // Load available sites
  const loadAvailableSites = async () => {
    try {
      const response = await api.get('/api/lookups/sites')
      setAvailableSites(response.data || [])
    } catch (err) {
      console.error('Error loading sites:', err)
    }
  }

  // Load data on component mount and when dependencies change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPatientsList()
    }, 300) // 300ms debounce for search and filters

    return () => clearTimeout(timeoutId)
  }, [currentPage, itemsPerPage, searchTerm, userSelectedSite, filters.gender, filters.status, filters.siteCode, filters.ageRange, filters.referral, filters.artNumber, sortBy, sortOrder])

  // Load sites once on mount
  useEffect(() => {
    loadAvailableSites()
  }, [])

  // Handle refresh
  const handleRefresh = async () => {
    await loadPatientsList()
    setLastRefresh(new Date())
  }

  // No client-side filtering needed - server handles pagination and filtering
  const filteredPatients = patients

  // No client-side sorting needed - server handles sorting
  const sortedPatients = filteredPatients

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  // Server-side pagination
  const totalPages = itemsPerPage ? Math.ceil(totalPatients / itemsPerPage) : 1

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage === "all" ? null : parseInt(newItemsPerPage))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getGenderBadgeVariant = (sex) => {
    switch (String(sex || '').toLowerCase()) {
      case 'male': return 'default'
      case 'female': return 'secondary'
      default: return 'outline'
    }
  }

  const getGenderLabel = (sex) => {
    switch (String(sex || '').toLowerCase()) {
      case 'male': return 'Male'
      case 'female': return 'Female'
      default: return 'Unknown'
    }
  }

  const getPatientStatusBadgeVariant = (status) => {
    switch (status) {
      case -1: return 'default'    // New
      case 0: return 'secondary'   // Old (Return In)
      case 1: return 'outline'     // Old (Return Out)
      default: return 'default'
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  // Handle site filter change
  const handleSiteFilterChange = (siteCode) => {
    updateFilter('siteCode', siteCode)
    if (siteCode === 'all') {
      setUserSelectedSite(null)
    } else {
      // Find the site by code from available sites
      const site = availableSites.find(s => s.code === siteCode)
      setUserSelectedSite(site)
    }
  }

  // Skeleton Components
  const TableSkeleton = () => (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="grid grid-cols-9 gap-4 px-6 py-4 animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-12" />
          <div className="h-6 bg-gray-200 rounded w-16" />
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-6 bg-gray-200 rounded w-12" />
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )

  const CardSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="border animate-pulse">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-24" />
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const SortableHeader = ({ field, children, className = "" }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center space-x-1 hover:text-blue-600 transition-colors font-medium ${className}`}
    >
      <span>{children}</span>
      {sortBy === field ? (
        sortOrder === 'asc' ? (
          <SortAsc className="w-3 h-3 text-blue-600" />
        ) : (
          <SortDesc className="w-3 h-3 text-blue-600" />
        )
      ) : (
        <ChevronDown className="w-3 h-3 text-gray-400" />
      )}
    </button>
  )

  // Helper functions to update individual filters
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(f => f !== 'all' && f !== '').length + (searchTerm ? 1 : 0)

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm('')
    setFilters({
      gender: 'all',
      status: 'all',
      siteCode: 'all',
      ageRange: 'all',
      referral: 'all',
      artNumber: ''
    })
    setUserSelectedSite(null)
  }


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Responsive */}
      <div className="flex flex-col space-y-4">
        {/* Top row - Title and primary actions */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Child Patient Registry</h2>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span>Manage and view child patient records</span>
               {isFilteringBySite && userSelectedSite && (
                 <>
                   <span>•</span>
                   <div className="flex items-center space-x-1 text-blue-600">
                     <MapPin className="w-3 h-3" />
                     <span className="font-medium">{userSelectedSite.name}</span>
                     <Badge variant="secondary" className="text-xs">{userSelectedSite.code}</Badge>
                   </div>
                 </>
               )}
              </div>
            </div>
          </div>
          
          {/* Primary actions - responsive */}
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm" 
              className="shadow-sm"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={onNewPatient} size="sm" className="shadow-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">New Patient</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile subtitle and stats */}
        <div className="sm:hidden">
          <p className="text-sm text-gray-500 mb-2">Manage and view child patient records</p>
           {isFilteringBySite && userSelectedSite && (
             <div className="flex items-center space-x-1 text-blue-600 text-sm">
               <MapPin className="w-3 h-3" />
               <span className="font-medium">{userSelectedSite.name}</span>
               <Badge variant="secondary" className="text-xs">{userSelectedSite.code}</Badge>
             </div>
           )}
        </div>

        {/* Stats row - responsive */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium">
              {loading ? 'Loading...' : `${totalPatients} patients`}
            </Badge>
            {isFilteringBySite && (
              <Badge variant="secondary" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
                Filtered
              </Badge>
            )}
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="px-2 py-1 text-xs">
                {activeFiltersCount} filters
              </Badge>
            )}
          </div>
          <div className="text-xs text-gray-500 hidden sm:block">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Site Filter Status - Compact for mobile */}
      {isMultiSite && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
               <span className="text-xs sm:text-sm font-medium text-blue-900 truncate">
                 {isFilteringBySite && userSelectedSite ? `Showing patients from ${userSelectedSite.name}` : 'Showing patients from all sites'}
               </span>
            </div>
            <div className="text-xs text-blue-700 sm:hidden">
              {lastRefresh.toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters - Mobile optimized */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* Filter Controls */}
            <div className="flex gap-2 sm:gap-3 items-center">
              {/* Desktop Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden sm:flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              
              {/* Mobile Filter Sheet */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="sm:hidden flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    {activeFiltersCount > 0 && (
                      <Badge variant="destructive" className="px-1.5 py-0.5 text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Filter Patients</SheetTitle>
                    <SheetDescription>
                      Apply filters to narrow down the patient list
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="grid grid-cols-1 gap-4 mt-6 overflow-y-auto max-h-[60vh]">
                    {/* Mobile filter controls - single column */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Gender</label>
                      <Select value={filters.gender} onValueChange={(value) => updateFilter('gender', value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Genders</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                      <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="transferred">Transferred</SelectItem>
                          <SelectItem value="deceased">Deceased</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Age Range</label>
                      <Select value={filters.ageRange} onValueChange={(value) => updateFilter('ageRange', value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ages</SelectItem>
                          <SelectItem value="0-5">0-5 years</SelectItem>
                          <SelectItem value="6-12">6-12 years</SelectItem>
                          <SelectItem value="13-17">13-17 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">ART Number</label>
                      <Input
                        placeholder="Search ART number..."
                        value={filters.artNumber}
                        onChange={(e) => updateFilter('artNumber', e.target.value)}
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Site</label>
                      <Select value={filters.siteCode} onValueChange={handleSiteFilterChange}>
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sites</SelectItem>
                          {availableSites.map(site => (
                            <SelectItem key={site.code} value={site.code}>
                              {site.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Referral Status</label>
                      <Select value={filters.referral} onValueChange={(value) => updateFilter('referral', value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Referrals</SelectItem>
                          <SelectItem value="referred">Referred</SelectItem>
                          <SelectItem value="not_referred">Not Referred</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6 pt-4 border-t">
                    <Button variant="outline" onClick={clearAllFilters} className="flex-1">
                      Clear All
                    </Button>
                    <Button onClick={() => setMobileFiltersOpen(false)} className="flex-1">
                      Apply Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              
              {/* Items per page selector */}
              <Select value={itemsPerPage ? itemsPerPage.toString() : "all"} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-16 sm:w-20 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="250">250</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                  <SelectItem value="1000">1K</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Advanced Filters Panel */}
      {showFilters && (
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {/* Gender Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Gender</label>
                <Select value={filters.gender} onValueChange={(value) => updateFilter('gender', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                    <SelectItem value="deceased">Deceased</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Site Code Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Site Code</label>
                <Select value={filters.siteCode} onValueChange={handleSiteFilterChange}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    {availableSites.map(site => (
                      <SelectItem key={site.code} value={site.code}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Age Range Filter (Child-specific) */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Age Range</label>
                <Select value={filters.ageRange} onValueChange={(value) => updateFilter('ageRange', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="0-5">0-5 years</SelectItem>
                    <SelectItem value="6-12">6-12 years</SelectItem>
                    <SelectItem value="13-17">13-17 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ART Number Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">ART Number</label>
                <Input
                  placeholder="Search ART number..."
                  value={filters.artNumber}
                  onChange={(e) => updateFilter('artNumber', e.target.value)}
                  className="bg-white"
                />
              </div>

              {/* Referral Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Referral Status</label>
                <Select value={filters.referral} onValueChange={(value) => updateFilter('referral', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Referrals</SelectItem>
                    <SelectItem value="referred">Referred</SelectItem>
                    <SelectItem value="not_referred">Not Referred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {filteredPatients.length} of {patients.length} patients
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card className="border-0 shadow-lg">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="grid grid-cols-9 gap-4 px-6 py-4 text-sm font-semibold text-gray-700">
              <SortableHeader field="clinicId">Clinic ID</SortableHeader>
              <SortableHeader field="siteName">Site</SortableHeader>
              <SortableHeader field="dateFirst">First Visit</SortableHeader>
              <SortableHeader field="age">Age</SortableHeader>
              <SortableHeader field="sex">Gender</SortableHeader>
              <SortableHeader field="patientStatus">Status</SortableHeader>
              <SortableHeader field="referred">Referred</SortableHeader>
              <div>Transfer</div>
              <div className="text-center">Actions</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {loading ? (
              <TableSkeleton />
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-red-500">
                <div className="p-4 bg-red-100 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Error loading patients</h3>
                <p className="text-sm text-red-400">{error}</p>
                <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : sortedPatients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No patients found</h3>
                <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              sortedPatients.map((patient, index) => (
                <div
                  key={patient.id || index}
                  className="grid grid-cols-9 gap-4 px-6 py-4 hover:bg-blue-50/50 transition-colors duration-200 group cursor-pointer"
                  onClick={() => selectPatient(patient)}
                >
                  <div className="font-semibold text-blue-900 group-hover:text-blue-700 flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {patient.clinicId || 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-blue-500" />
                    <span className="text-sm font-medium text-blue-700">
                      {patient.siteName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                    {formatDate(patient.dateFirst)}
                  </div>
                  <div className="text-gray-700 font-medium">
                    {patient.age ? `${patient.age} yrs` : 'N/A'}
                  </div>
                  <div>
                    <Badge variant={getGenderBadgeVariant(patient.sex)} className="text-xs font-medium">
                      {getGenderLabel(patient.sex)}
                    </Badge>
                  </div>
                  <div>
                    <Badge 
                      variant={getPatientStatusBadgeVariant(patient.patientStatusValue)} 
                      className="text-xs font-medium"
                    >
                      {patient.patientStatus || 'Unknown'}
                    </Badge>
                  </div>
                  <div className="text-gray-600">
                    {patient.referred || 'N/A'}
                  </div>
                  <div>
                    <Badge 
                      variant={patient.transferIn ? 'default' : 'secondary'} 
                      className="text-xs font-medium"
                    >
                      {patient.transferIn ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => selectPatient(patient)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Patient
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
        <div className="lg:hidden p-4 space-y-3">
          {loading ? (
            <CardSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <AlertCircle className="w-12 h-12 mb-3 text-red-300" />
              <p className="font-medium mb-1">Error loading patients</p>
              <p className="text-sm text-red-400 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          ) : sortedPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Users className="w-12 h-12 mb-3 text-gray-300" />
              <p className="font-medium mb-1">No patients found</p>
              <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
            </div>
          ) : (
            sortedPatients.map((patient, index) => (
              <Card 
                key={patient.id || index}
                className="border cursor-pointer hover:shadow-md transition-shadow duration-200"
                onClick={() => selectPatient(patient)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-blue-900">{patient.clinicId || 'N/A'}</h3>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(patient.dateFirst)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => selectPatient(patient)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Age:</span>
                      <span className="ml-2 font-medium">{patient.age ? `${patient.age} yrs` : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Gender:</span>
                      <Badge variant={getGenderBadgeVariant(patient.sex)} className="ml-2 text-xs">
                        {getGenderLabel(patient.sex)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <Badge variant={getPatientStatusBadgeVariant(patient.patientStatusValue)} className="ml-2 text-xs">
                        {patient.patientStatus || 'Unknown'}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-500">Referred:</span>
                      <span className="ml-2">{patient.referred || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Site:</span>
                      <div className="flex items-center ml-2">
                        <MapPin className="w-3 h-3 mr-1 text-blue-500" />
                        <span className="text-sm font-medium text-blue-700">
                          {patient.siteName || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Transfer:</span>
                      <Badge variant={patient.transferIn ? 'default' : 'secondary'} className="ml-2 text-xs">
                        {patient.transferIn ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {sortedPatients.length > 0 && (
          <div className="border-t bg-gray-50 px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                {itemsPerPage ? 
                  `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, totalPatients)} of ${totalPatients} patients` :
                  `Showing all ${totalPatients} patients`
                }
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default PatientList