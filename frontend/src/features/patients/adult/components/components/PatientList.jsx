import { Button, Input, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Alert, AlertDescription, Skeleton } from "@/components/ui";
import React, { useState, useEffect } from 'react'
import api from "../../../../../services/api"
import { useSite } from "../../../../../contexts/SiteContext"

function PatientList({
  searchTerm,
  setSearchTerm,
  selectPatient,
  onNewPatient,
  selectedSite
}) {
  const [patients, setPatients] = useState([])
  const [totalPatients, setTotalPatients] = useState(0)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [availableSites, setAvailableSites] = useState([])
  const [userSelectedSite, setUserSelectedSite] = useState(null)
  const [nationalities, setNationalities] = useState([])
  const [targetGroups, setTargetGroups] = useState([])
  const [availableNationalities, setAvailableNationalities] = useState([])
  const { isMultiSite } = useSite()
  
  // Filter states
  const [dateRange, setDateRange] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ageRange, setAgeRange] = useState('all')
  const [nationalityFilter, setNationalityFilter] = useState('all')
  const [targetGroupFilter, setTargetGroupFilter] = useState('all')

  // Load lookup data
  const loadLookupData = async () => {
    try {
      const [nationalitiesRes, targetGroupsRes] = await Promise.all([
        api.get('/apiv1/lookups/nationalities'),
        api.get('/apiv1/lookups/target-groups')
      ])
      setNationalities(nationalitiesRes.data || [])
      setTargetGroups(targetGroupsRes.data || [])
    } catch (error) {
      console.error('Error loading lookup data:', error)
    }
  }

  // Extract unique nationalities from patient data
  const updateAvailableNationalities = (patientData) => {
    const uniqueNationalities = [...new Set(patientData
      .map(patient => patient.nationality)
      .filter(nationality => nationality !== null && nationality !== undefined && nationality !== '' && nationality !== -1 && nationality !== 0)
    )].map(nationalityId => {
      const nationality = nationalities.find(n => n.id == nationalityId)
      return nationality ? { id: nationalityId, name: nationality.name } : { id: nationalityId, name: `Nationality ${nationalityId}` }
    }).sort((a, b) => a.name.localeCompare(b.name))
    
    setAvailableNationalities(uniqueNationalities)
  }

  // Load patients
  const loadPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      })
      
      if (searchTerm?.trim()) {
        params.append('search', searchTerm.trim())
      }
      
      if (userSelectedSite?.name) {
        params.append('site', userSelectedSite.name)
      }
      
      // Add filter parameters
      if (dateRange && dateRange !== 'all') {
        params.append('dateRange', dateRange)
      }
      
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      
      if (ageRange && ageRange !== 'all') {
        params.append('ageRange', ageRange)
      }
      
      if (nationalityFilter && nationalityFilter !== 'all') {
        params.append('nationality', nationalityFilter)
      }
      
      if (targetGroupFilter && targetGroupFilter !== 'all') {
        params.append('targetGroup', targetGroupFilter)
      }
      
      const response = await api.get(`/apiv1/patients/adult?${params.toString()}`)
      const patientData = response.data.patients || []
      setPatients(patientData)
      setTotalPatients(response.data.total || 0)
      
      // Update available nationalities based on current data
      updateAvailableNationalities(patientData)
    } catch (error) {
      setError('Error loading adult patients')
      setPatients([])
      setTotalPatients(0)
    } finally {
      setLoading(false)
    }
  }

  // Load sites
  const loadSites = async () => {
    try {
      const response = await api.get('/apiv1/lookups/sites-registry')
      setAvailableSites(response.data || [])
    } catch (error) {
      console.error('Error loading sites:', error)
    }
  }

  useEffect(() => {
    loadLookupData()
    loadSites()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(loadPatients, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, userSelectedSite, currentPage, itemsPerPage, selectedSite, dateRange, statusFilter, ageRange, nationalityFilter, targetGroupFilter])

  const handleSiteChange = (siteCode) => {
    if (siteCode === 'all') {
      setUserSelectedSite(null)
    } else {
      const site = availableSites.find(s => s.code === siteCode)
      setUserSelectedSite(site)
    }
  }

  const getStatusBadge = (patient) => {
    const status = patient.status || 'Active'
    const isActive = status === 'Active'
    return (
      <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
        {status}
      </Badge>
    )
  }

  const getAgeDisplay = (patient) => {
    if (patient.age !== null && patient.age !== undefined) {
      return `${patient.age} years`
    }
    if (patient.dateOfBirth) {
      const birthDate = new Date(patient.dateOfBirth)
      const today = new Date()
      const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000))
      return `${age} years`
    }
    return 'N/A'
  }

  const getTargetGroupLabel = (targetGroup) => {
    if (targetGroup === null || targetGroup === undefined || targetGroup === '') return '';
    
    // Handle special case for 0 (General Population)
    if (targetGroup === 0) return 'General Population';
    
    // First try to find in loaded target groups
    const foundGroup = targetGroups.find(tg => tg.id == targetGroup);
    if (foundGroup) {
      return foundGroup.name;
    }
    
    // Fallback to hardcoded mapping
    const targetGroupMap = {
      1: 'FEW',      // Female Entertainment Workers
      2: 'MSM',      // Men who have Sex with Men
      3: 'TG',       // Transgender
      4: 'PWUD',     // People Who Use Drugs
      5: 'PWID',     // People Who Inject Drugs
      6: 'GP',       // General Population
      7: 'MEW',      // Men Entertainment Workers
      8: 'PPW'       // Pregnant/Parenting Women
    };
    return targetGroupMap[targetGroup] || `Group ${targetGroup}`;
  };

  const getNationalityLabel = (nationality) => {
    if (nationality === null || nationality === undefined || nationality === '') return '';
    
    // Handle special case for 0 (Not Specified) - don't show this
    if (nationality === 0) return '';
    
    // Find nationality in loaded data
    const foundNationality = nationalities.find(nat => nat.id == nationality);
    if (foundNationality) {
      return foundNationality.name;
    }
    
    return `Nationality ${nationality}`;
  };

  const totalPages = Math.ceil(totalPatients / itemsPerPage)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-foreground">Adult Patients</h2>
          <Badge variant="outline">{totalPatients.toLocaleString()}</Badge>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadPatients} variant="outline" size="sm" disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
          <Button onClick={onNewPatient} size="sm">
            New
          </Button>
        </div>
      </div>

      {/* Search and Site Filter */}
      <div className="flex gap-3">
        <div className="flex-1">
              <Input
            placeholder="Search adult patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        {isMultiSite && (
          <Select value={userSelectedSite?.code || 'all'} onValueChange={handleSiteChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Sites" />
                        </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
              {availableSites.map((site) => (
                      <SelectItem key={site.code} value={site.code}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                      </Select>
        )}
                  </div>

      {/* Standard Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Date Range Filter */}
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger>
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
            <SelectItem value="Dead">Dead</SelectItem>
            <SelectItem value="Transferred Out">Transferred Out</SelectItem>
          </SelectContent>
        </Select>

        {/* Age Range Filter */}
        <Select value={ageRange} onValueChange={setAgeRange}>
          <SelectTrigger>
            <SelectValue placeholder="Age Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ages</SelectItem>
            <SelectItem value="15-24">15-24 years</SelectItem>
            <SelectItem value="25-49">25-49 years</SelectItem>
            <SelectItem value="50+">50+ years</SelectItem>
          </SelectContent>
        </Select>

        {/* Nationality Filter */}
        <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Nationality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Nationalities</SelectItem>
            {availableNationalities.map((nationality) => (
              <SelectItem key={nationality.id} value={nationality.id.toString()}>
                {nationality.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Target Group Filter */}
        <Select value={targetGroupFilter} onValueChange={setTargetGroupFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Target Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            <SelectItem value="1">FEW</SelectItem>
            <SelectItem value="2">MSM</SelectItem>
            <SelectItem value="3">TG</SelectItem>
            <SelectItem value="4">PWUD</SelectItem>
            <SelectItem value="5">PWID</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button 
          variant="outline" 
          onClick={() => {
            setDateRange('all')
            setStatusFilter('all')
            setAgeRange('all')
            setNationalityFilter('all')
            setTargetGroupFilter('all')
          }}
          className="w-full"
        >
          Clear Filters
        </Button>
      </div>
                  
      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Patient List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/2" />
            </div>
                <Skeleton className="h-6 w-16" />
              </div>
              </div>
          ))}
              </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">No patients found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search' : 'No adult patients registered yet'}
          </p>
          <Button onClick={onNewPatient}>
            Add First Patient
          </Button>
              </div>
      ) : (
        <div className="space-y-2">
          {patients.map((patient, index) => (
            <div key={`${patient.clinicId}-${patient.site_code || patient.siteName || 'unknown'}-${index}`} className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      Patient {patient.clinicId}
                    </h3>
              </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Site: {patient.siteName || 'N/A'}</span>
                    <span className="font-medium text-foreground">ID: {patient.clinicId}</span>
                    <span>Age: {getAgeDisplay(patient)}</span>
                    {patient.artNumber && <span>ART: {patient.artNumber}</span>}
                  </div>
                  <div className="flex items-center space-x-4 text-sm mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      patient.sex === 'Male' ? 'status-active' : 'status-warning'
                    }`}>
                      {patient.sex || 'Unknown'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      patient.patientStatus === 'Active' ? 'status-active' :
                      patient.patientStatus === 'Dead' ? 'status-critical' :
                      patient.patientStatus === 'Lost' ? 'status-warning' :
                      patient.patientStatus === 'Transferred Out' ? 'status-inactive' :
                      'status-inactive'
                    }`}>
                      {patient.patientStatus || 'Unknown'}
                    </span>
                    {patient.targetGroup !== null && patient.targetGroup !== undefined && patient.targetGroup !== '' && (
                      <span className="px-2 py-1 rounded text-xs font-medium viral-load-undetectable">
                        {getTargetGroupLabel(patient.targetGroup)}
                      </span>
                    )}
                    {patient.nationality !== null && patient.nationality !== undefined && patient.nationality !== '' && patient.nationality !== -1 && patient.nationality !== 0 && getNationalityLabel(patient.nationality) && (
                      <span className="px-2 py-1 rounded text-xs font-medium cd4-low">
                        {getNationalityLabel(patient.nationality)}
                      </span>
                    )}
                  </div>
              </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectPatient(patient)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simple Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
            </div>
          </div>
        )}
    </div>
  )
}

export default PatientList