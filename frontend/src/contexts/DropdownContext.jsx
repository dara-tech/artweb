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
        api.get('/apiv1/lookups/sites'),
        api.get('/apiv1/lookups/vcct-sites'),
        api.get('/apiv1/lookups/drugs'),
        api.get('/apiv1/lookups/clinics'),
        api.get('/apiv1/lookups/reasons'),
        api.get('/apiv1/lookups/allergies'),
        api.get('/apiv1/lookups/nationalities'),
        api.get('/apiv1/lookups/target-groups'),
        api.get('/apiv1/lookups/provinces'),
        api.get('/apiv1/lookups/hospitals'),
        api.get('/apiv1/lookups/drug-treatments')
      ])

      setDropdownData({
        sites: (sites.data || []).filter(site => site.status === 1),
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
