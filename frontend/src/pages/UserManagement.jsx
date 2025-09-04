import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { userAPI } from '../services/api'

function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'clerk',
  })
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery('users', userAPI.getUsers)

  const createMutation = useMutation(userAPI.createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
      handleCloseDialog()
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to create user')
    }
  })

  const updateMutation = useMutation(
    ({ id, data }) => userAPI.updateUser(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        handleCloseDialog()
      },
      onError: (error) => {
        setError(error.response?.data?.message || 'Failed to update user')
      }
    }
  )

  const deleteMutation = useMutation(userAPI.deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    }
  })

  const users = data?.data?.users || []

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 150,
    },
    {
      field: 'fullName',
      headerName: 'Full Name',
      width: 200,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'admin' ? 'error' : 'primary'}
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value === 1 ? 'Active' : 'Inactive'}
          color={params.value === 1 ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString() : 'Never'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleEditUser(params.row)}
            title="Edit User"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteUser(params.row.id)}
            title="Delete User"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  const handleAddUser = () => {
    setSelectedUser(null)
    setFormData({
      username: '',
      password: '',
      fullName: '',
      role: 'clerk',
    })
    setError('')
    setDialogOpen(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setFormData({
      username: user.username,
      password: '',
      fullName: user.fullName,
      role: user.role,
    })
    setError('')
    setDialogOpen(true)
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(userId)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedUser(null)
    setFormData({
      username: '',
      password: '',
      fullName: '',
      role: 'clerk',
    })
    setError('')
  }

  const handleSubmit = () => {
    setError('')
    
    if (selectedUser) {
      // Update user
      const updateData = {
        fullName: formData.fullName,
        role: formData.role,
        status: 1,
      }
      if (formData.password) {
        updateData.password = formData.password
      }
      updateMutation.mutate({ id: selectedUser.id, data: updateData })
    } else {
      // Create user
      createMutation.mutate(formData)
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          Add New User
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={isLoading}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              margin="normal"
              disabled={!!selectedUser}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
              helperText={selectedUser ? "Leave blank to keep current password" : "Password must be at least 6 characters"}
            />
            <TextField
              fullWidth
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="clerk">Clerk</MenuItem>
                <MenuItem value="nurse">Nurse</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {selectedUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserManagement
