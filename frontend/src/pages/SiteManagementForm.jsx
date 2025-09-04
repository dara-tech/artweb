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
  Add as AddIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const siteSchema = yup.object({
  siteCode: yup.string()
    .required('Site code is required')
    .min(2, 'Site code must be at least 2 characters')
    .max(10, 'Site code must not exceed 10 characters'),
  siteName: yup.string()
    .required('Site name is required')
    .min(2, 'Site name must be at least 2 characters')
    .max(100, 'Site name must not exceed 100 characters'),
  siteType: yup.string()
    .required('Site type is required'),
  province: yup.string()
    .required('Province is required'),
  district: yup.string()
    .required('District is required'),
  commune: yup.string()
    .required('Commune is required'),
  village: yup.string(),
  address: yup.string()
    .required('Address is required'),
  phone: yup.string(),
  email: yup.string()
    .email('Invalid email format'),
  contactPerson: yup.string(),
  contactPhone: yup.string(),
  status: yup.number()
    .required('Status is required')
    .oneOf([0, 1], 'Status must be 0 or 1')
});

const SiteManagementForm = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(siteSchema),
    defaultValues: {
      siteCode: '',
      siteName: '',
      siteType: '',
      province: '',
      district: '',
      commune: '',
      village: '',
      address: '',
      phone: '',
      email: '',
      contactPerson: '',
      contactPhone: '',
      status: 1
    }
  });

  // Mock data for provinces and districts
  const provinces = [
    'Phnom Penh',
    'Kandal',
    'Kampong Cham',
    'Kampong Speu',
    'Takeo',
    'Kampot',
    'Kep',
    'Sihanoukville',
    'Koh Kong',
    'Pursat',
    'Battambang',
    'Pailin',
    'Banteay Meanchey',
    'Oddar Meanchey',
    'Preah Vihear',
    'Siem Reap',
    'Kampong Thom',
    'Kampong Chhnang',
    'Kratie',
    'Mondulkiri',
    'Ratanakiri',
    'Stung Treng',
    'Prey Veng',
    'Svay Rieng',
    'Tbong Khmum'
  ];

  const siteTypes = [
    'Hospital',
    'Health Center',
    'Health Post',
    'Clinic',
    'VCCT Site',
    'PMTCT Site',
    'TB Clinic',
    'Other'
  ];

  // Load sites on component mount
  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockSites = [
        {
          id: 1,
          siteCode: 'PP001',
          siteName: 'Phnom Penh Referral Hospital',
          siteType: 'Hospital',
          province: 'Phnom Penh',
          district: 'Chamkar Mon',
          commune: 'Tonle Bassac',
          village: 'Village 1',
          address: '123 Street 271, Phnom Penh',
          phone: '023-123-456',
          email: 'pp001@hospital.gov.kh',
          contactPerson: 'Dr. John Doe',
          contactPhone: '012-345-678',
          status: 1
        },
        {
          id: 2,
          siteCode: 'KD001',
          siteName: 'Kandal Health Center',
          siteType: 'Health Center',
          province: 'Kandal',
          district: 'Ta Khmau',
          commune: 'Ta Khmau',
          village: 'Village 2',
          address: '456 National Road 2, Ta Khmau',
          phone: '023-234-567',
          email: 'kd001@health.gov.kh',
          contactPerson: 'Dr. Jane Smith',
          contactPhone: '012-456-789',
          status: 1
        }
      ];
      setSites(mockSites);
    } catch (error) {
      setError('Failed to load sites');
      console.error('Error loading sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (isEdit && editingSite) {
        // Mock update - replace with actual API call
        const updatedSites = sites.map(site => 
          site.id === editingSite.id ? { ...site, ...data } : site
        );
        setSites(updatedSites);
        setSuccess('Site updated successfully');
      } else {
        // Mock create - replace with actual API call
        const newSite = {
          id: Date.now(), // Mock ID
          ...data
        };
        setSites([...sites, newSite]);
        setSuccess('Site created successfully');
      }

      handleClear();
    } catch (error) {
      setError('Failed to save site');
      console.error('Error saving site:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (site) => {
    setEditingSite(site);
    setIsEdit(true);
    setValue('siteCode', site.siteCode);
    setValue('siteName', site.siteName);
    setValue('siteType', site.siteType);
    setValue('province', site.province);
    setValue('district', site.district);
    setValue('commune', site.commune);
    setValue('village', site.village);
    setValue('address', site.address);
    setValue('phone', site.phone);
    setValue('email', site.email);
    setValue('contactPerson', site.contactPerson);
    setValue('contactPhone', site.contactPhone);
    setValue('status', site.status);
    setError(null);
    setSuccess(null);
  };

  const handleClear = () => {
    reset();
    setIsEdit(false);
    setEditingSite(null);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = (site) => {
    setSiteToDelete(site);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!siteToDelete) return;

    try {
      setLoading(true);
      // Mock delete - replace with actual API call
      const updatedSites = sites.filter(site => site.id !== siteToDelete.id);
      setSites(updatedSites);
      setSuccess('Site deleted successfully');
    } catch (error) {
      setError('Failed to delete site');
      console.error('Error deleting site:', error);
    } finally {
      setLoading(false);
      setDeleteDialog(false);
      setSiteToDelete(null);
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
        Site Management
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
        {/* Site Form */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {isEdit ? 'Edit Site' : 'Add New Site'}
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
                    name="siteCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Site Code"
                        fullWidth
                        error={!!errors.siteCode}
                        helperText={errors.siteCode?.message}
                        disabled={isEdit}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="siteName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Site Name"
                        fullWidth
                        error={!!errors.siteName}
                        helperText={errors.siteName?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="siteType"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.siteType}>
                        <InputLabel>Site Type</InputLabel>
                        <Select {...field} label="Site Type">
                          {siteTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="province"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.province}>
                        <InputLabel>Province</InputLabel>
                        <Select {...field} label="Province">
                          {provinces.map((province) => (
                            <MenuItem key={province} value={province}>
                              {province}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="district"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="District"
                        fullWidth
                        error={!!errors.district}
                        helperText={errors.district?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="commune"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Commune"
                        fullWidth
                        error={!!errors.commune}
                        helperText={errors.commune?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="village"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Village"
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address"
                        fullWidth
                        multiline
                        rows={2}
                        error={!!errors.address}
                        helperText={errors.address?.message}
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

                <Grid item xs={12} md={6}>
                  <Controller
                    name="contactPerson"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Contact Person"
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="contactPhone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Contact Phone"
                        fullWidth
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

        {/* Sites List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sites List
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Site Code</TableCell>
                    <TableCell>Site Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Province</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell>{site.siteCode}</TableCell>
                      <TableCell>{site.siteName}</TableCell>
                      <TableCell>{site.siteType}</TableCell>
                      <TableCell>{site.province}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(site.status)}
                          color={getStatusColor(site.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(site)}
                              disabled={loading}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(site)}
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

            {sites.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No sites found
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
            Are you sure you want to delete site "{siteToDelete?.siteName}"? 
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

export default SiteManagementForm;

