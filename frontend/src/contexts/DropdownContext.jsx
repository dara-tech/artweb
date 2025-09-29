import React, { createContext, useContext, useState, useEffect } from 'react'
import api from './services/api'

const DropdownContext = createContext()

export const useDropdowns = () => {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error('useDropdowns must be used within a DropdownProvider')
  }
  return context
}

export const DropdownProvider = ({ children }) => {
  const [dropdownData, setDropdownData] = useState({
    sites: [],
    vcctSites: [],
    drugs: [],
    clinics: [],
    reasons: [],
    allergies: [],
    nationalities: [],
    targetGroups: [],
    provinces: [],
    hospitals: [],
    drugTreatments: []
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetch, setLastFetch] = useState(null)
  
  // Cache data for 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000

  const loadDropdownData = async (forceRefresh = false) => {
    // Check if we have cached data and it's still fresh
    if (!forceRefresh && lastFetch && (Date.now() - lastFetch) < CACHE_DURATION) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const [
        sites, vcctSites, drugs, clinics, reasons, 
        allergies, nationalities, targetGroups, 
        provinces, hospitals, drugTreatments
      ] = await Promise.all([
        api.get('/api/lookups/sites'),
        api.get('/api/lookups/vcct-sites'),
        api.get('/api/lookups/drugs'),
        api.get('/api/lookups/clinics'),
        api.get('/api/lookups/reasons'),
        api.get('/api/lookups/allergies'),
        api.get('/api/lookups/nationalities'),
        api.get('/api/lookups/target-groups'),
        api.get('/api/lookups/provinces'),
        api.get('/api/lookups/hospitals'),
        api.get('/api/lookups/drug-treatments')
      ])

      setDropdownData({
        sites: sites.data || [],
        vcctSites: vcctSites.data || [],
        drugs: drugs.data || [],
        clinics: clinics.data || [],
        reasons: reasons.data || [],
        allergies: allergies.data || [],
        nationalities: nationalities.data || [],
        targetGroups: targetGroups.data || [],
        provinces: provinces.data || [],
        hospitals: hospitals.data || [],
        drugTreatments: drugTreatments.data || []
      })
      
      setLastFetch(Date.now())
    } catch (err) {
      console.error('Error loading dropdown data:', err)
      setError(err.message || 'Failed to load dropdown data')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    loadDropdownData(true)
  }

  useEffect(() => {
    loadDropdownData()
  }, [])

  const value = {
    dropdownData,
    loading,
    error,
    refreshData,
    loadDropdownData
  }

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  )
}
