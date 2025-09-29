import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { SiteProvider } from './contexts/SiteContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdultPatientForm from './pages/patients/InitialForm/Adult/AdultInitialForm'
import ChildPatientForm from './pages/patients/InitialForm/Child/ChildInitialForm'
import InfantPatientForm from './pages/patients/InitialForm/Infant/InfantInitialForm'
import PatientList from './pages/patients/PatientList'
import AdultVisitForm from './pages/patients/VisitForm/Adult/AdultVisitForm'
import AdultVisitList from './pages/patients/VisitForm/Adult/AdultVisitList'
import ChildVisitForm from './pages/patients/VisitForm/Child/ChildVisitForm'
import ChildVisitList from './pages/patients/VisitForm/Child/ChildVisitList'
import InfantVisitForm from './pages/patients/VisitForm/Infant/InfantVisitForm'
import InfantVisitList from './pages/patients/VisitForm/Infant/InfantVisitList'
import BackupManagement from './pages/BackupManagement'
import DataManagement from './pages/DataManagement'
import IndicatorsReport from './pages/indicators/IndicatorsReport'
import IndicatorsDashboard from './pages/indicators/IndicatorsDashboard'
import AuditReports from './pages/audit/AuditReports'
import AdvancedLayout from './components/layout/AdvancedLayout'

function App() {
  const { user, loading } = useAuth()

  console.log('App render - user:', user, 'loading:', loading)

  if (loading) {
    console.log('Showing loading screen')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    console.log('No user, showing login')
    return <Login />
  }

  console.log('User authenticated, showing dashboard')

  return (
    <SiteProvider>
      <AdvancedLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/adult" element={<AdultPatientForm />} />
          <Route path="/patients/adult/:id" element={<AdultPatientForm />} />
          <Route path="/patients/child" element={<ChildPatientForm />} />
          <Route path="/patients/child/:id" element={<ChildPatientForm />} />
          <Route path="/patients/infant" element={<InfantPatientForm />} />
          <Route path="/patients/infant/:id" element={<InfantPatientForm />} />
          <Route path="/visits/adult" element={<AdultVisitList />} />
          <Route path="/visits/adult/new" element={<AdultVisitForm />} />
          <Route path="/visits/adult/:clinicId" element={<AdultVisitForm />} />
          <Route path="/visits/adult/:clinicId/:visitId" element={<AdultVisitForm />} />
          <Route path="/visits/child" element={<ChildVisitList />} />
          <Route path="/visits/child/new" element={<ChildVisitForm />} />
          <Route path="/visits/child/:clinicId" element={<ChildVisitForm />} />
          <Route path="/visits/child/:clinicId/:visitId" element={<ChildVisitForm />} />
          <Route path="/visits/infant" element={<InfantVisitList />} />
          <Route path="/visits/infant/new" element={<InfantVisitForm />} />
          <Route path="/visits/infant/:clinicId" element={<InfantVisitForm />} />
          <Route path="/visits/infant/:clinicId/:visitId" element={<InfantVisitForm />} />
          <Route path="/backup" element={<BackupManagement />} />
          <Route path="/data-management" element={<DataManagement />} />
          <Route path="/indicators" element={<IndicatorsReport />} />
          <Route path="/indicators/dashboard" element={<IndicatorsDashboard />} />
          <Route path="/audit" element={<AuditReports />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AdvancedLayout>
    </SiteProvider>
  )
}

export default App