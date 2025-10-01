import { Button,} from "@/components/ui";
import React from 'react'
import { useAuth } from '../../shared/AuthContext'
import { useNavigate } from 'react-router-dom'

function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-foreground">PreART System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.fullName}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Button 
              variant="ghost" 
              className="py-4 px-3 text-sm font-medium"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="py-4 px-3 text-sm font-medium"
              onClick={() => navigate('/patients')}
            >
              Patients
            </Button>
            <Button 
              variant="ghost" 
              className="py-4 px-3 text-sm font-medium"
              onClick={() => navigate('/patients/adult')}
            >
              Adult Patients
            </Button>
            <Button 
              variant="ghost" 
              className="py-4 px-3 text-sm font-medium"
              onClick={() => navigate('/patients/child')}
            >
              Child Patients
            </Button>
            <Button 
              variant="ghost" 
              className="py-4 px-3 text-sm font-medium"
              onClick={() => navigate('/patients/infant')}
            >
              Infant Patients
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
