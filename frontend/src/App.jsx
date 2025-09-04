import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PatientList from './pages/patients/PatientList'
import PatientForm from './pages/patients/PatientForm'
import PatientDetail from './pages/patients/PatientDetail'
import AdultPatientForm from './pages/patients/AdultPatientForm'
import ChildPatientForm from './pages/patients/ChildPatientForm'
import InfantPatientForm from './pages/patients/InfantPatientForm'
import PatientStatusForm from './pages/patients/PatientStatusForm'
import Reports from './pages/Reports'
import UserManagement from './pages/UserManagement'
import UserManagementForm from './pages/UserManagementForm'
import SiteManagementForm from './pages/SiteManagementForm'
import DoctorManagementForm from './pages/DoctorManagementForm'
import Profile from './pages/Profile'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <div>Loading...</div>
      </Box>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/new" element={<PatientForm />} />
        <Route path="/patients/:id" element={<PatientDetail />} />
        <Route path="/patients/:id/edit" element={<PatientForm />} />
        <Route path="/patients/adult/new" element={<AdultPatientForm />} />
        <Route path="/patients/adult/:id/edit" element={<AdultPatientForm />} />
        <Route path="/patients/child/new" element={<ChildPatientForm />} />
        <Route path="/patients/child/:id/edit" element={<ChildPatientForm />} />
        <Route path="/patients/infant/new" element={<InfantPatientForm />} />
        <Route path="/patients/infant/:id/edit" element={<InfantPatientForm />} />
        <Route path="/patients/status/new" element={<PatientStatusForm />} />
        <Route path="/patients/status/:id/edit" element={<PatientStatusForm />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/users/manage" element={<UserManagementForm />} />
        <Route path="/sites/manage" element={<SiteManagementForm />} />
        <Route path="/doctors/manage" element={<DoctorManagementForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
