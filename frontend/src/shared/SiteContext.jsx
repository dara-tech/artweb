import React, { createContext, useContext, useState, useEffect } from 'react'
import { siteApi } from '../services/siteApi'

const SiteContext = createContext()

export const useSite = () => {
  const context = useContext(SiteContext)
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider')
  }
  return context
}

export const SiteProvider = ({ children }) => {
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMultiSite, setIsMultiSite] = useState(false)

  // Load sites on mount, but only if we have a token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadSites()
    } else {
      setLoading(false)
    }
  }, [])

  const loadSites = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if we have a token before making the API call
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }
      
      const response = await siteApi.getAllSites()
      const allSites = response.sites || response
      
      // Filter out inactive sites (status = 0)
      const siteData = allSites.filter(site => site.status === 1)
      
      setSites(siteData)
      setIsMultiSite(siteData.length > 1)
      
      // Clear any cached site selection that might have old site names
      const savedSite = localStorage.getItem('selectedSite')
      if (savedSite) {
        try {
          const parsedSite = JSON.parse(savedSite)
          // Check if the saved site name matches any current site name
          const siteExists = siteData.find(site => site.name === parsedSite.name)
          if (!siteExists) {
            // Clear the cached selection if it doesn't match current data
            localStorage.removeItem('selectedSite')
            setSelectedSite(null)
          }
        } catch (e) {
          localStorage.removeItem('selectedSite')
          setSelectedSite(null)
        }
      }
      
      // Auto-select first site if only one, or restore from localStorage
      if (siteData.length === 1) {
        setSelectedSite(siteData[0])
        localStorage.setItem('selectedSite', JSON.stringify(siteData[0]))
      } else if (siteData.length > 1) {
        const savedSite = localStorage.getItem('selectedSite')
        if (savedSite) {
          try {
            const parsedSite = JSON.parse(savedSite)
            // Verify the saved site still exists
            const siteExists = siteData.find(site => site.code === parsedSite.code)
            if (siteExists) {
              setSelectedSite(parsedSite)
            } else {
              // Fallback to first site
              setSelectedSite(siteData[0])
              localStorage.setItem('selectedSite', JSON.stringify(siteData[0]))
            }
          } catch (e) {
            setSelectedSite(siteData[0])
            localStorage.setItem('selectedSite', JSON.stringify(siteData[0]))
          }
        } else {
          setSelectedSite(siteData[0])
          localStorage.setItem('selectedSite', JSON.stringify(siteData[0]))
        }
      }
    } catch (err) {
      console.error('Error loading sites:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectSite = (site) => {
    setSelectedSite(site)
    localStorage.setItem('selectedSite', JSON.stringify(site))
  }

  const clearSiteSelection = () => {
    setSelectedSite(null)
    localStorage.removeItem('selectedSite')
  }

  const refreshSites = () => {
    loadSites()
  }

  const loadSitesAfterAuth = () => {
    // This method can be called after successful authentication
    loadSites()
  }

  const clearSiteCache = () => {
    // Force clear all site-related cache
    localStorage.removeItem('selectedSite')
    setSelectedSite(null)
    setSites([])
    loadSites()
  }

  const getSiteName = () => {
    return selectedSite?.name || 'All Sites'
  }

  const getSiteCode = () => {
    return selectedSite?.code || null
  }

  const isSiteSelected = () => {
    return selectedSite !== null
  }

  const getFilteredSites = (status = 'all') => {
    if (status === 'active') {
      return sites.filter(site => site.status === 1 || site.status === '1')
    }
    return sites
  }

  const value = {
    sites,
    selectedSite,
    loading,
    error,
    isMultiSite,
    selectSite,
    clearSiteSelection,
    refreshSites,
    loadSitesAfterAuth,
    clearSiteCache,
    getSiteName,
    getSiteCode,
    isSiteSelected,
    getFilteredSites,
    loadSites
  }

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  )
}
