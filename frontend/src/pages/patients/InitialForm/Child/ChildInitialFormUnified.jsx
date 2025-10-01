import React from 'react'
import UnifiedInitialForm from '../../../../components/patient-forms/UnifiedInitialForm'
import { childPatientConfig } from '../../../../components/patient-forms/configs/childPatientConfig'
import ChildPatientInformation from '../../../../features/patients/child/components/components/PatientInformation'
import ChildMedicalTreatmentHistory from '../../../../features/patients/child/components/components/MedicalTreatmentHistory'

/**
 * Child Initial Form - Unified Version
 * Uses the unified structure with child-specific configuration
 */
function ChildInitialFormUnified() {
  return (
    <UnifiedInitialForm
      patientType="child"
      apiEndpoint="/api/patients/child"
      formFields={childPatientConfig}
      validationRules={childPatientConfig.validationRules}
      PatientInformationComponent={ChildPatientInformation}
      MedicalTreatmentHistoryComponent={ChildMedicalTreatmentHistory}
    />
  )
}

export default ChildInitialFormUnified
