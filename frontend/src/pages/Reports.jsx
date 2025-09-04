import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useQuery } from 'react-query'
import { reportsAPI } from '../services/api'
import dayjs from 'dayjs'

function Reports() {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    type: '',
  })

  const { data: statistics, isLoading } = useQuery(
    ['reports-statistics', filters],
    () => reportsAPI.getStatistics({
      startDate: filters.startDate?.format('YYYY-MM-DD'),
      endDate: filters.endDate?.format('YYYY-MM-DD'),
    }),
    {
      enabled: true,
    }
  )

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      type: '',
    })
  }

  if (isLoading) {
    return <Typography>Loading reports...</Typography>
  }

  const stats = statistics?.data?.statistics || {}

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => handleFilterChange('startDate', date)}
              slotProps={{
                textField: { fullWidth: true, size: 'small' }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => handleFilterChange('endDate', date)}
              slotProps={{
                textField: { fullWidth: true, size: 'small' }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Patient Type</InputLabel>
              <Select
                value={filters.type}
                label="Patient Type"
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="adult">Adult</MenuItem>
                <MenuItem value="child">Child</MenuItem>
                <MenuItem value="infant">Infant</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              onClick={clearFilters}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Patients
              </Typography>
              <Typography variant="h4">
                {stats.totalPatients || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Adult Patients
              </Typography>
              <Typography variant="h4" color="primary">
                {stats.byType?.adult || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Child Patients
              </Typography>
              <Typography variant="h4" color="secondary">
                {stats.byType?.child || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Infant Patients
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.byType?.infant || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Patient Distribution by Sex
            </Typography>
            <Box display="flex" justifyContent="space-around" mt={2}>
              <Box textAlign="center">
                <Typography variant="h3" color="primary">
                  {stats.bySex?.male || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Male
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h3" color="secondary">
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
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Patient Status Overview
            </Typography>
            <Box display="flex" justifyContent="space-around" mt={2}>
              <Box textAlign="center">
                <Typography variant="h3" color="success.main">
                  {stats.byStatus?.active || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h3" color="error.main">
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

export default Reports
