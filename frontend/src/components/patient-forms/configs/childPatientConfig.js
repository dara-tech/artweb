/**
 * Child Patient Configuration
 * Defines form fields, validation rules, and data mapping for child patients
 */

export const childPatientConfig = {
  // Initial form state
  initialState: {
    clinicId: '',
    patientName: '',
    dateFirstVisit: '',
    lClinicId: '',
    clinicIdOld: '',
    serviceSiteName: '',
    dateOfBirth: '',
    age: '',
    sex: -1,
    nationality: 'none',
    referred: -1,
    otherReferred: '',
    eClinicId: '',
    dateTest: '',
    typeTest: -1,
    vcctCode: 'none',
    vcctId: '',
    offIn: -1,
    siteName: '',
    dateART: '',
    artNumber: '',
    feeding: -1,
    tbPast: -1,
    typeTB: -1,
    resultTB: -1,
    dateOnset: '',
    tbTreat: -1,
    dateTreat: '',
    resultTreat: -1,
    dateResultTreat: '',
    inh: -1,
    tptDrug: -1,
    dateStartTPT: '',
    dateEndTPT: '',
    otherPast: -1,
    cotrim: -1,
    fluco: -1,
    allergy: -1,
    siteNameOld: '',
    reLost: false
  },

  // Treatment history initial state
  treatmentHistoryInitialState: {
    drugTreatments: Array(7).fill().map(() => ({
      drugDetails: '',
      clinic: '',
      startDate: '',
      stopDate: '',
      remarks: ''
    })),
    arvMedication: -1,
    arvDrugs: ['', '', ''],
    cotrimoxazole: -1,
    fluconazole: -1,
    drugReactions: Array(3).fill().map(() => ({
      drug1: '',
      reaction1: '',
      drug2: '',
      reaction2: ''
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
      if (parseInt(formData.age) < 0 || parseInt(formData.age) > 14) {
        return 'Invalid Patient Age! Must be 0-14 years for child patients'
      }
      if (formData.sex === -1) {
        return 'Please select Patient Sex!'
      }
      if (formData.offIn === 1 && !formData.artNumber.trim()) {
        return 'Please input ART Number for transfer in patients!'
      }
      return null
    }
  },

  // Data mapping functions
  mapApiDataToFormData: (data) => ({
    clinicId: data.clinicId || '',
    patientName: data.patientName || '',
    dateFirstVisit: data.dateFirstVisit || '',
    lClinicId: data.lClinicId || '',
    clinicIdOld: data.clinicIdOld || '',
    serviceSiteName: data.serviceSiteName || '',
    dateOfBirth: data.dateOfBirth || '',
    age: data.age !== null && data.age !== undefined ? data.age : '',
    sex: data.sex !== null && data.sex !== undefined ? data.sex : -1,
    nationality: data.nationality?.toString() || 'none',
    referred: data.referred !== null && data.referred !== undefined ? data.referred : -1,
    otherReferred: data.otherReferred || '',
    eClinicId: data.eClinicId || '',
    dateTest: data.dateTest || '',
    typeTest: data.typeTest !== null && data.typeTest !== undefined ? data.typeTest : -1,
    vcctCode: data.vcctCode || 'none',
    vcctId: data.vcctId || '',
    offIn: data.offIn !== null && data.offIn !== undefined ? data.offIn : -1,
    siteName: data.siteName || '',
    dateART: data.dateART || '',
    artNumber: data.artNumber || '',
    feeding: data.feeding !== null && data.feeding !== undefined ? data.feeding : -1,
    tbPast: data.tbPast !== null && data.tbPast !== undefined ? data.tbPast : -1,
    typeTB: data.typeTB !== null && data.typeTB !== undefined ? data.typeTB : -1,
    resultTB: data.resultTB !== null && data.resultTB !== undefined ? data.resultTB : -1,
    dateOnset: data.dateOnset || '',
    tbTreat: data.tbTreat !== null && data.tbTreat !== undefined ? data.tbTreat : -1,
    dateTreat: data.dateTreat || '',
    resultTreat: data.resultTreat !== null && data.resultTreat !== undefined ? data.resultTreat : -1,
    dateResultTreat: data.dateResultTreat || '',
    inh: data.inh !== null && data.inh !== undefined ? data.inh : -1,
    tptDrug: data.tptDrug !== null && data.tptDrug !== undefined ? data.tptDrug : -1,
    dateStartTPT: data.dateStartTPT || '',
    dateEndTPT: data.dateEndTPT || '',
    otherPast: data.otherPast !== null && data.otherPast !== undefined ? data.otherPast : -1,
    cotrim: data.cotrim !== null && data.cotrim !== undefined ? data.cotrim : -1,
    fluco: data.fluco !== null && data.fluco !== undefined ? data.fluco : -1,
    allergy: data.allergy !== null && data.allergy !== undefined ? data.allergy : -1,
    siteNameOld: data.siteNameOld || '',
    reLost: data.reLost || false
  }),

  // Input value processing
  processInputValue: (field, value) => {
    return value
  },

  // Patient type specific configuration
  title: "Child Patient",
  ageRanges: [
    { label: "0-2 years", value: "0-2" },
    { label: "3-5 years", value: "3-5" },
    { label: "6-8 years", value: "6-8" },
    { label: "9-11 years", value: "9-11" },
    { label: "12-14 years", value: "12-14" }
  ]
}
