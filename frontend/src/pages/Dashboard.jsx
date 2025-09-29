import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { Users, UserPlus, FileText, Activity } from 'lucide-react'
import api from '../services/api'

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalAdults: 0,
    totalChildren: 0,
    totalInfants: 0,
    recentPatients: []
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Load patient counts directly from patient APIs
      const [adultsResponse, childrenResponse, infantsResponse] = await Promise.all([
        api.get('/api/patients/adult?limit=1'),
        api.get('/api/patients/child?limit=1'),
        api.get('/api/patients/infant?limit=1')
      ])

      setStats({
        totalAdults: adultsResponse.data.total || 0,
        totalChildren: childrenResponse.data.total || 0,
        totalInfants: infantsResponse.data.total || 0,
        recentPatients: adultsResponse.data.patients || []
      })
    } catch (error) {
      console.error('Error loading stats:', error)
      // Fallback to just adult patients if others fail
      try {
        const adults = await api.get('/api/patients/adult?limit=1')
        setStats({
          totalAdults: adults.data.total || 0,
          totalChildren: 0,
          totalInfants: 0,
          recentPatients: adults.data.patients || []
        })
      } catch (fallbackError) {
        console.error('Error loading fallback stats:', fallbackError)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">PreART Medical Management System</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adult Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAdults}</div>
            <p className="text-xs text-muted-foreground">Total registered adults</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Child Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChildren}</div>
            <p className="text-xs text-muted-foreground">Total registered children</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Infant Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInfants}</div>
            <p className="text-xs text-muted-foreground">Total registered infants</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            className="h-24 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate('/patients/adult')}
          >
            <UserPlus className="h-6 w-6" />
            <span>New Adult Patient</span>
          </Button>
          
          <Button 
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate('/patients/child')}
          >
            <UserPlus className="h-6 w-6" />
            <span>New Child Patient</span>
          </Button>
          
          <Button 
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate('/patients/infant')}
          >
            <UserPlus className="h-6 w-6" />
            <span>New Infant Patient</span>
          </Button>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            <p>PreART Medical Management System</p>
            <p>Web-based version of the VB.NET PreART system</p>
            <p>All data is synchronized with the existing database</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
