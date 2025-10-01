/**
 * Infant Patient Configuration
 * Defines form fields, validation rules, and data mapping for infant patients
 */

export const infantPatientConfig = {
  // Initial form state
  initialState: {
    // Basic Information
    clinicId: '',
    dateFirstVisit: '',
    dateOfBirth: '',
    sex: -1,
    addGuardian: '',
    group: '',
    
    // Address Information
    house: '',
    street: '',
    village: '',
    commune: '',
    district: '',
    province: '',
    
    // Contact Information
    nameContact: '',
    addressContact: '',
    phone: '',
    
    // Family Information
    fAge: '',
    fHIV: -1,
    fStatus: -1,
    mAge: '',
    mClinicId: '',
    mArt: -1,
    hospitalName: '',
    mStatus: -1,
    
    // Delivery Information
    catPlaceDelivery: -1,
    placeDelivery: '',
    pmtct: -1,
    dateDelivery: '',
    deliveryStatus: -1,
    lenBaby: '',
    wBaby: '',
    
    // HIV Information
    knownHIV: -1,
    received: -1,
    syrup: -1,
    cotrim: -1,
    offIn: -1,
    siteName: '',
    hivTest: -1,
    mHIV: -1,
    mLastVl: '',
    dateMLastVl: '',
    eoClinicId: ''
  },

  // Treatment history initial state
  treatmentHistoryInitialState: {
    drugTreatments: [{
      drugDetails: '',
      clinic: '',
      startDate: '',
      stopDate: '',
      remarks: ''
    }]
  },

  // Validation rules
  validationRules: {
    validate: (formData) => {
      if (!formData.dateOfBirth) {
        return 'Date of Birth is required'
      }
      if (formData.sex === -1) {
        return 'Sex is required'
      }
      if (!formData.clinicId) {
        return 'Clinic ID is required'
      }
      return null
    }
  },

  // Data mapping functions
  mapApiDataToFormData: (data) => ({
    // Basic Information
    clinicId: data.clinicId || '',
    dateFirstVisit: data.dateFirstVisit || '',
    dateOfBirth: data.dateOfBirth || '',
    sex: data.sex !== null && data.sex !== undefined ? data.sex : -1,
    addGuardian: data.addGuardian || '',
    group: data.group || '',
    
    // Address Information
    house: data.house || '',
    street: data.street || '',
    village: data.village || '',
    commune: data.commune || '',
    district: data.district || '',
    province: data.province || '',
    
    // Contact Information
    nameContact: data.nameContact || '',
    addressContact: data.addressContact || '',
    phone: data.phone || '',
    
    // Family Information
    fAge: data.fAge || '',
    fHIV: data.fHIV !== null && data.fHIV !== undefined ? data.fHIV : -1,
    fStatus: data.fStatus !== null && data.fStatus !== undefined ? data.fStatus : -1,
    mAge: data.mAge || '',
    mClinicId: data.mClinicId || '',
    mArt: data.mArt !== null && data.mArt !== undefined ? data.mArt : -1,
    hospitalName: data.hospitalName || '',
    mStatus: data.mStatus !== null && data.mStatus !== undefined ? data.mStatus : -1,
    
    // Delivery Information
    catPlaceDelivery: data.catPlaceDelivery !== null && data.catPlaceDelivery !== undefined ? data.catPlaceDelivery : -1,
    placeDelivery: data.placeDelivery || '',
    pmtct: data.pmtct !== null && data.pmtct !== undefined ? data.pmtct : -1,
    dateDelivery: data.dateDelivery || '',
    deliveryStatus: data.deliveryStatus !== null && data.deliveryStatus !== undefined ? data.deliveryStatus : -1,
    lenBaby: data.lenBaby || '',
    wBaby: data.wBaby || '',
    
    // HIV Information
    knownHIV: data.knownHIV !== null && data.knownHIV !== undefined ? data.knownHIV : -1,
    received: data.received !== null && data.received !== undefined ? data.received : -1,
    syrup: data.syrup !== null && data.syrup !== undefined ? data.syrup : -1,
    cotrim: data.cotrim !== null && data.cotrim !== undefined ? data.cotrim : -1,
    offIn: data.offIn !== null && data.offIn !== undefined ? data.offIn : -1,
    siteName: data.siteName || '',
    hivTest: data.hivTest !== null && data.hivTest !== undefined ? data.hivTest : -1,
    mHIV: data.mHIV !== null && data.mHIV !== undefined ? data.mHIV : -1,
    mLastVl: data.mLastVl || '',
    dateMLastVl: data.dateMLastVl || '',
    eoClinicId: data.eoClinicId || ''
  }),

  // Input value processing
  processInputValue: (field, value) => {
    // Convert "none" from dropdowns to appropriate values
    if (value === "none") {
      if (field === 'sex' || field === 'fHIV' || field === 'fStatus' || field === 'mArt' || field === 'mStatus' || 
          field === 'catPlaceDelivery' || field === 'pmtct' || field === 'deliveryStatus' || field === 'knownHIV' || 
          field === 'received' || field === 'syrup' || field === 'cotrim' || field === 'offIn' || field === 'hivTest' || field === 'mHIV') {
        return -1
      } else {
        return ""
      }
    }
    return value
  },

  // Patient type specific configuration
  title: "Infant Patient",
  ageRanges: [
    { label: "0-6 months", value: "0-6" },
    { label: "7-12 months", value: "7-12" },
    { label: "13-18 months", value: "13-18" },
    { label: "19-24 months", value: "19-24" }
  ]
}
