import React from 'react'
import UnifiedInitialForm from '../../../../components/patient-forms/UnifiedInitialForm'
import { adultPatientConfig } from '../../../../components/patient-forms/configs/adultPatientConfig'
import AdultPatientInformation from '../../../../features/patients/adult/components/components/PatientInformation'
import AdultMedicalTreatmentHistory from '../../../../features/patients/adult/components/components/MedicalTreatmentHistory'

/**
 * Adult Initial Form - Unified Version
 * Uses the unified structure with adult-specific configuration
 */
function AdultInitialFormUnified() {
  return (
    <UnifiedInitialForm
      patientType="adult"
      apiEndpoint="/apiv1/patients/adult"
      formFields={adultPatientConfig}
      validationRules={adultPatientConfig.validationRules}
      PatientInformationComponent={AdultPatientInformation}
      MedicalTreatmentHistoryComponent={AdultMedicalTreatmentHistory}
    />
  )
}

export default AdultInitialFormUnified
