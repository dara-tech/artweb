import api from './api'

export const provinceApi = {
  // Get all provinces
  getAllProvinces: async () => {
    const response = await api.get('/apiv1/site-operations/provinces')
    return response.data
  },

  // Get sites by province
  getSitesByProvince: async (provinceName) => {
    const response = await api.get('/apiv1/site-operations/sites')
    const allSites = response.data.sites || response.data
    return {
      sites: allSites.filter(site => site.province === provinceName)
    }
  }
}

export default provinceApi
