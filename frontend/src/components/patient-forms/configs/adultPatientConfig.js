/**
 * Adult Patient Configuration
 * Defines form fields, validation rules, and data mapping for adult patients
 */

export const adultPatientConfig = {
  // Initial form state
  initialState: {
    // Basic Information
    clinicId: '',
    dateFirstVisit: '',
    lostReturn: false,
    typeOfReturn: -1,
    returnClinicId: '',
    oldSiteName: '',
    patientName: '',
    
    // Demographics  
    dateOfBirth: '',
    age: '',
    sex: -1, // 0=Female, 1=Male
    education: -1,
    canRead: -1,
    canWrite: -1,
    nationality: '',
    
    // HIV Testing & Referral
    referred: -1, // 0=Self, 1=Community, 2=VCCT, 3=PMTCT, 4=TB, 5=Blood Bank, 6=Other
    referredOther: '',
    dateTestHIV: '',
    vcctSite: '',
    vcctId: '',
    previousClinicId: '',
    
    // Target Group and Transfer Information
    targetGroup: -1,
    refugeeStatus: -1,
    childrenClinicId: '',
    
    // ART Information
    artNumber: '',
    dateART: '',
    transferIn: -1, // 0=No, 1=Yes
    transferFrom: '',
    transferDate: '',
    
    // TB Past Medical History
    tbPast: -1, // 0=No, 1=Yes, 2=Unknown
    tptHistory: -1, // 0=No, 1=Completed, 2=On treatment
    tptRegimen: -1, // 0=3HP, 1=6H, 2=3RH
    tptDateStart: '',
    tptDateEnd: '',
    tbType: -1, // 0=Pulmonary, 1=Extra-pulmonary
    tbResult: -1, // 0=BK+, 1=BK-
    tbDateOnset: '',
    tbTreatment: -1, // 0=Cat1, 1=Cat2, 2=Cat3, 3=Cat4, 4=Unknown
    tbDateTreatment: '',
    tbDateComplete: '',
    
    // Other Medical History
    diabetes: false,
    hypertension: false,
    abnormal: false,
    renal: false,
    anemia: false,
    liver: false,
    hepatitis: false,
    other: false,
    otherIllness: '',
    
    // Allergies
    allergy: -1,
    allergyDetails: ''
  },

  // Treatment history initial state
  treatmentHistoryInitialState: {
    drugTreatments: Array(6).fill().map(() => ({
      drugDetails: '',
      clinic: '',
      startDate: '',
      stopDate: '',
      remarks: ''
    })),
    arvMedication: -1,
    arvDrugs: ['', '', ''],
    otherTreatments: Array(8).fill().map(() => ({
      drugDetails: '',
      clinic: '',
      startDate: '',
      stopDate: '',
      remarks: ''
    })),
    drugReactions: Array(3).fill().map(() => ({
      drug1: '',
      reaction1: '',
      date1: '',
      drug2: '',
      reaction2: '',
      date2: ''
    })),
    hasDrugReaction: -1
  },

  // Validation rules
  validationRules: {
    validate: (formData) => {
      if (!formData.clinicId.trim()) {
        return 'Please input Clinic ID'
      }
      if (!formData.dateFirstVisit) {
        return 'Please input Date First Visit'
      }
      if (parseInt(formData.age) < 15 || parseInt(formData.age) > 120) {
        return 'Invalid Patient Age! Must be 15+ years for adult patients'
      }
      if (formData.sex === -1) {
        return 'Please select Patient Sex!'
      }
      return null
    }
  },

  // Data mapping functions
  mapApiDataToFormData: (data) => ({
    // Basic Information
    clinicId: data.clinicId || '',
    dateFirstVisit: data.dateFirstVisit || '',
    lostReturn: data.lostReturn || false,
    typeOfReturn: data.typeOfReturn !== null && data.typeOfReturn !== undefined ? data.typeOfReturn : -1,
    returnClinicId: data.returnClinicId || '',
    oldSiteName: data.oldSiteName || '',
    
    // Demographics  
    dateOfBirth: data.dateOfBirth || '',
    age: data.age !== null && data.age !== undefined ? data.age : '',
    sex: data.sex !== null && data.sex !== undefined ? data.sex : -1,
    education: data.education !== null && data.education !== undefined ? data.education : -1,
    canRead: data.canRead !== null && data.canRead !== undefined ? data.canRead : -1,
    canWrite: data.canWrite !== null && data.canWrite !== undefined ? data.canWrite : -1,
    
    // HIV Testing & Referral
    referred: data.referred !== null && data.referred !== undefined ? data.referred : -1,
    referredOther: data.referredOther || '',
    dateTestHIV: data.dateTestHIV || '',
    vcctSite: data.vcctSite || '',
    vcctId: data.vcctId || '',
    previousClinicId: data.previousClinicId || '',
    
    // ART Information
    artNumber: data.artNumber || '',
    dateART: data.dateART || '',
    transferIn: data.transferIn !== null && data.transferIn !== undefined ? data.transferIn : -1,
    transferFrom: data.transferFrom || '',
    transferDate: data.transferDate || '',
    
    // Medical History
    tbPast: data.tbPast !== null && data.tbPast !== undefined ? data.tbPast : -1,
    tbType: data.tbType !== null && data.tbType !== undefined ? data.tbType : -1,
    tbResult: data.tbResult !== null && data.tbResult !== undefined ? data.tbResult : -1,
    tbDateOnset: data.tbDateOnset || '',
    tbTreatment: data.tbTreatment !== null && data.tbTreatment !== undefined ? data.tbTreatment : -1,
    tbDateTreatment: data.tbDateTreatment || '',
    tbResultTreatment: data.tbResultTreatment !== null && data.tbResultTreatment !== undefined ? data.tbResultTreatment : -1,
    tbDateResultTreatment: data.tbDateResultTreatment || '',
    
    // TPT Treatment
    inh: data.inh !== null && data.inh !== undefined ? data.inh : -1,
    tptDrug: data.tptDrug !== null && data.tptDrug !== undefined ? data.tptDrug : -1,
    tptDateStart: data.tptDateStart || '',
    tptDateEnd: data.tptDateEnd || '',
    
    // Other Medical History
    otherPast: data.otherPast !== null && data.otherPast !== undefined ? data.otherPast : -1,
    otherPastDetails: data.otherPastDetails || '',
    
    // Current Medications
    cotrimoxazole: data.cotrimoxazole !== null && data.cotrimoxazole !== undefined ? data.cotrimoxazole : -1,
    fluconazole: data.fluconazole !== null && data.fluconazole !== undefined ? data.fluconazole : -1,
    
    // Allergies
    allergy: data.allergy !== null && data.allergy !== undefined ? data.allergy : -1,
    allergyDetails: data.allergyDetails || ''
  }),

  // Input value processing
  processInputValue: (field, value) => {
    // Handle "none" value for dropdowns - convert to empty string or -1
    if (value === "none") {
      if (field === 'nationality' || field === 'targetGroup') {
        return -1
      } else {
        return ''
      }
    }
    return value
  },

  // Patient type specific configuration
  title: "Adult Patient",
  ageRanges: [
    { label: "15-24 years", value: "15-24" },
    { label: "25-34 years", value: "25-34" },
    { label: "35-44 years", value: "35-44" },
    { label: "45-54 years", value: "45-54" },
    { label: "55+ years", value: "55+" }
  ]
}
