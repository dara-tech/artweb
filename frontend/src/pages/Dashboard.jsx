import React from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
} from '@mui/material'
import {
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'
import { useQuery } from 'react-query'
import { reportsAPI } from '../services/api'

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {value}
          </Typography>
        </Box>
        <Box color={`${color}.main`}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
)

function Dashboard() {
  const { data: statistics, isLoading } = useQuery(
    'dashboard-statistics',
    () => reportsAPI.getStatistics(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Loading dashboard...</Typography>
      </Box>
    )
  }

  const stats = statistics?.data?.statistics || {}

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients || 0}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Adult Patients"
            value={stats.byType?.adult || 0}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Child Patients"
            value={stats.byType?.child || 0}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Infant Patients"
            value={stats.byType?.infant || 0}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="warning"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Patient Distribution by Sex
            </Typography>
            <Box display="flex" justifyContent="space-around" mt={2}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {stats.bySex?.male || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Male
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" color="secondary">
                  {stats.bySex?.female || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Female
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Patient Status
            </Typography>
            <Box display="flex" justifyContent="space-around" mt={2}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {stats.byStatus?.active || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" color="error.main">
                  {stats.byStatus?.inactive || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Inactive
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
