import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocalHospital as LocalHospitalIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const doctorSchema = yup.object({
  doctorCode: yup.string()
    .required('Doctor code is required')
    .min(2, 'Doctor code must be at least 2 characters')
    .max(10, 'Doctor code must not exceed 10 characters'),
  firstName: yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  specialization: yup.string()
    .required('Specialization is required'),
  qualification: yup.string()
    .required('Qualification is required'),
  licenseNumber: yup.string()
    .required('License number is required'),
  phone: yup.string(),
  email: yup.string()
    .email('Invalid email format'),
  siteCode: yup.string()
    .required('Site code is required'),
  status: yup.number()
    .required('Status is required')
    .oneOf([0, 1], 'Status must be 0 or 1')
});

const DoctorManagementForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(doctorSchema),
    defaultValues: {
      doctorCode: '',
      firstName: '',
      lastName: '',
      specialization: '',
      qualification: '',
      licenseNumber: '',
      phone: '',
      email: '',
      siteCode: '',
      status: 1
    }
  });

  const specializations = [
    'Internal Medicine',
    'Pediatrics',
    'Obstetrics & Gynecology',
    'Surgery',
    'Infectious Diseases',
    'HIV/AIDS Specialist',
    'TB Specialist',
    'General Practice',
    'Emergency Medicine',
    'Psychiatry',
    'Dermatology',
    'Ophthalmology',
    'ENT',
    'Orthopedics',
    'Cardiology',
    'Neurology',
    'Oncology',
    'Other'
  ];

  const qualifications = [
    'MD (Doctor of Medicine)',
    'MBBS (Bachelor of Medicine, Bachelor of Surgery)',
    'DO (Doctor of Osteopathic Medicine)',
    'Specialist Certificate',
    'Fellowship',
    'PhD in Medicine',
    'Other'
  ];

  // Load doctors on component mount
  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockDoctors = [
        {
          id: 1,
          doctorCode: 'DOC001',
          firstName: 'John',
          lastName: 'Doe',
          specialization: 'Internal Medicine',
          qualification: 'MD (Doctor of Medicine)',
          licenseNumber: 'LIC001',
          phone: '012-345-678',
          email: 'john.doe@hospital.gov.kh',
          siteCode: 'PP001',
          status: 1
        },
        {
          id: 2,
          doctorCode: 'DOC002',
          firstName: 'Jane',
          lastName: 'Smith',
          specialization: 'Pediatrics',
          qualification: 'MBBS (Bachelor of Medicine, Bachelor of Surgery)',
          licenseNumber: 'LIC002',
          phone: '012-456-789',
          email: 'jane.smith@hospital.gov.kh',
          siteCode: 'KD001',
          status: 1
        }
      ];
      setDoctors(mockDoctors);
    } catch (error) {
      setError('Failed to load doctors');
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (isEdit && editingDoctor) {
        // Mock update - replace with actual API call
        const updatedDoctors = doctors.map(doctor => 
          doctor.id === editingDoctor.id ? { ...doctor, ...data } : doctor
        );
        setDoctors(updatedDoctors);
        setSuccess('Doctor updated successfully');
      } else {
        // Mock create - replace with actual API call
        const newDoctor = {
          id: Date.now(), // Mock ID
          ...data
        };
        setDoctors([...doctors, newDoctor]);
        setSuccess('Doctor created successfully');
      }

      handleClear();
    } catch (error) {
      setError('Failed to save doctor');
      console.error('Error saving doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setIsEdit(true);
    setValue('doctorCode', doctor.doctorCode);
    setValue('firstName', doctor.firstName);
    setValue('lastName', doctor.lastName);
    setValue('specialization', doctor.specialization);
    setValue('qualification', doctor.qualification);
    setValue('licenseNumber', doctor.licenseNumber);
    setValue('phone', doctor.phone);
    setValue('email', doctor.email);
    setValue('siteCode', doctor.siteCode);
    setValue('status', doctor.status);
    setError(null);
    setSuccess(null);
  };

  const handleClear = () => {
    reset();
    setIsEdit(false);
    setEditingDoctor(null);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = (doctor) => {
    setDoctorToDelete(doctor);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!doctorToDelete) return;

    try {
      setLoading(true);
      // Mock delete - replace with actual API call
      const updatedDoctors = doctors.filter(doctor => doctor.id !== doctorToDelete.id);
      setDoctors(updatedDoctors);
      setSuccess('Doctor deleted successfully');
    } catch (error) {
      setError('Failed to delete doctor');
      console.error('Error deleting doctor:', error);
    } finally {
      setLoading(false);
      setDeleteDialog(false);
      setDoctorToDelete(null);
    }
  };

  const getStatusColor = (status) => {
    return status === 1 ? 'success' : 'error';
  };

  const getStatusText = (status) => {
    return status === 1 ? 'Active' : 'Inactive';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Doctor Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Doctor Form */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {isEdit ? 'Edit Doctor' : 'Add New Doctor'}
              </Typography>
              <Box>
                <Tooltip title="Clear">
                  <IconButton onClick={handleClear} disabled={loading}>
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="doctorCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Doctor Code"
                        fullWidth
                        error={!!errors.doctorCode}
                        helperText={errors.doctorCode?.message}
                        disabled={isEdit}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="First Name"
                        fullWidth
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Last Name"
                        fullWidth
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="specialization"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.specialization}>
                        <InputLabel>Specialization</InputLabel>
                        <Select {...field} label="Specialization">
                          {specializations.map((spec) => (
                            <MenuItem key={spec} value={spec}>
                              {spec}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="qualification"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.qualification}>
                        <InputLabel>Qualification</InputLabel>
                        <Select {...field} label="Qualification">
                          {qualifications.map((qual) => (
                            <MenuItem key={qual} value={qual}>
                              {qual}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="licenseNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="License Number"
                        fullWidth
                        error={!!errors.licenseNumber}
                        helperText={errors.licenseNumber?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone"
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="siteCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Site Code"
                        fullWidth
                        error={!!errors.siteCode}
                        helperText={errors.siteCode?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.status}>
                        <InputLabel>Status</InputLabel>
                        <Select {...field} label="Status">
                          <MenuItem value={1}>Active</MenuItem>
                          <MenuItem value={0}>Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={<SaveIcon />}
                      fullWidth
                    >
                      {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Doctors List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Doctors List
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Doctor Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Specialization</TableCell>
                    <TableCell>Site Code</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>{doctor.doctorCode}</TableCell>
                      <TableCell>{doctor.firstName} {doctor.lastName}</TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>{doctor.siteCode}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(doctor.status)}
                          color={getStatusColor(doctor.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(doctor)}
                              disabled={loading}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(doctor)}
                              disabled={loading}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {doctors.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No doctors found
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete doctor "{doctorToDelete?.firstName} {doctorToDelete?.lastName}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorManagementForm;

