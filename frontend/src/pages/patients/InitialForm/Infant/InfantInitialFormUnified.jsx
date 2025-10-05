import React from 'react'
import UnifiedInitialForm from '../../../../components/patient-forms/UnifiedInitialForm'
import { infantPatientConfig } from '../../../../components/patient-forms/configs/infantPatientConfig'
import InfantPatientInformation from '../../../../features/patients/infant/components/components/PatientInformation'
import InfantMedicalTreatmentHistory from '../../../../features/patients/infant/components/components/MedicalTreatmentHistory'

/**
 * Infant Initial Form - Unified Version
 * Uses the unified structure with infant-specific configuration
 */
function InfantInitialFormUnified() {
  return (
    <UnifiedInitialForm
      patientType="infant"
      apiEndpoint="/apiv1/patients/infant"
      formFields={infantPatientConfig}
      validationRules={infantPatientConfig.validationRules}
      PatientInformationComponent={InfantPatientInformation}
      MedicalTreatmentHistoryComponent={InfantMedicalTreatmentHistory}
    />
  )
}

export default InfantInitialFormUnified
