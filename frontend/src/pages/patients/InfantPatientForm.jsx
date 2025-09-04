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
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
  Tabs,
  Tab,
  Alert,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { patientAPI } from '../../services/api';

// Validation schema
const infantPatientSchema = yup.object({
  clinicId: yup.string().required('Clinic ID is required'),
  dateFirstVisit: yup.date().required('Date of first visit is required'),
  dateOfBirth: yup.date().required('Date of birth is required'),
  sex: yup.number().required('Sex is required'),
  addGuardian: yup.number(),
  group: yup.string(),
  house: yup.string(),
  street: yup.string(),
  village: yup.string(),
  commune: yup.string(),
  district: yup.string(),
  province: yup.string(),
  nameContact: yup.string(),
  addressContact: yup.string(),
  phone: yup.string(),
  fatherAge: yup.number(),
  fatherHIV: yup.number(),
  fatherStatus: yup.number(),
  motherAge: yup.number(),
  motherClinicId: yup.string(),
  motherART: yup.string(),
  hospitalName: yup.string(),
  motherStatus: yup.number(),
  placeDelivery: yup.string(),
  placeDeliveryOther: yup.string(),
  pmtct: yup.string(),
  dateDelivery: yup.date(),
  deliveryStatus: yup.number(),
  lengthBaby: yup.number(),
  weightBaby: yup.number(),
  knownHIV: yup.number(),
  received: yup.number(),
  syrup: yup.number(),
  cotrim: yup.number(),
  offIn: yup.number(),
  siteName: yup.string(),
  hivTest: yup.number(),
  motherHIV: yup.number(),
  motherLastVL: yup.string(),
  dateMotherLastVL: yup.date(),
  eoClinicId: yup.string()
});

const InfantPatientForm = ({ patientId, onSave, onCancel }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [villages, setVillages] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(infantPatientSchema),
    defaultValues: {
      clinicId: '',
      dateFirstVisit: null,
      dateOfBirth: null,
      sex: null,
      addGuardian: null,
      group: '',
      house: '',
      street: '',
      village: '',
      commune: '',
      district: '',
      province: '',
      nameContact: '',
      addressContact: '',
      phone: '',
      fatherAge: null,
      fatherHIV: null,
      fatherStatus: null,
      motherAge: null,
      motherClinicId: '',
      motherART: '',
      hospitalName: '',
      motherStatus: null,
      placeDelivery: '',
      placeDeliveryOther: '',
      pmtct: '',
      dateDelivery: null,
      deliveryStatus: null,
      lengthBaby: null,
      weightBaby: null,
      knownHIV: null,
      received: null,
      syrup: null,
      cotrim: null,
      offIn: null,
      siteName: '',
      hivTest: null,
      motherHIV: null,
      motherLastVL: '',
      dateMotherLastVL: null,
      eoClinicId: ''
    }
  });

  // Watch form values for conditional logic
  const watchedValues = watch();

  // Load patient data if editing
  useEffect(() => {
    if (patientId) {
      loadPatientData(patientId);
      setIsEdit(true);
    }
    loadProvinces();
  }, [patientId]);

  // Load provinces when component mounts
  const loadProvinces = async () => {
    try {
      // This would typically come from an API
      setProvinces([
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
      ]);
    } catch (error) {
      console.error('Error loading provinces:', error);
    }
  };

  const loadPatientData = async (id) => {
    try {
      setLoading(true);
      const response = await patientAPI.getById(id);
      const patient = response.data;
      
      // Map the patient data to form values
      reset({
        clinicId: patient.clinicId || '',
        dateFirstVisit: patient.dateFirstVisit ? dayjs(patient.dateFirstVisit) : null,
        dateOfBirth: patient.dateOfBirth ? dayjs(patient.dateOfBirth) : null,
        sex: patient.sex || null,
        addGuardian: patient.addGuardian || null,
        group: patient.group || '',
        house: patient.house || '',
        street: patient.street || '',
        village: patient.village || '',
        commune: patient.commune || '',
        district: patient.district || '',
        province: patient.province || '',
        nameContact: patient.nameContact || '',
        addressContact: patient.addressContact || '',
        phone: patient.phone || '',
        fatherAge: patient.fatherAge || null,
        fatherHIV: patient.fatherHIV || null,
        fatherStatus: patient.fatherStatus || null,
        motherAge: patient.motherAge || null,
        motherClinicId: patient.motherClinicId || '',
        motherART: patient.motherART || '',
        hospitalName: patient.hospitalName || '',
        motherStatus: patient.motherStatus || null,
        placeDelivery: patient.placeDelivery || '',
        placeDeliveryOther: patient.placeDeliveryOther || '',
        pmtct: patient.pmtct || '',
        dateDelivery: patient.dateDelivery ? dayjs(patient.dateDelivery) : null,
        deliveryStatus: patient.deliveryStatus || null,
        lengthBaby: patient.lengthBaby || null,
        weightBaby: patient.weightBaby || null,
        knownHIV: patient.knownHIV || null,
        received: patient.received || null,
        syrup: patient.syrup || null,
        cotrim: patient.cotrim || null,
        offIn: patient.offIn || null,
        siteName: patient.siteName || '',
        hivTest: patient.hivTest || null,
        motherHIV: patient.motherHIV || null,
        motherLastVL: patient.motherLastVL || '',
        dateMotherLastVL: patient.dateMotherLastVL ? dayjs(patient.dateMotherLastVL) : null,
        eoClinicId: patient.eoClinicId || ''
      });
    } catch (error) {
      setError('Failed to load patient data');
      console.error('Error loading patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Convert dayjs dates to ISO strings
      const formattedData = {
        ...data,
        dateFirstVisit: data.dateFirstVisit?.toISOString(),
        dateOfBirth: data.dateOfBirth?.toISOString(),
        dateDelivery: data.dateDelivery?.toISOString(),
        dateMotherLastVL: data.dateMotherLastVL?.toISOString()
      };

      if (isEdit) {
        await patientAPI.update(patientId, formattedData);
        setSuccess('Patient updated successfully');
      } else {
        await patientAPI.create(formattedData);
        setSuccess('Patient created successfully');
      }

      if (onSave) {
        onSave(formattedData);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save patient');
      console.error('Error saving patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    reset();
    setError(null);
    setSuccess(null);
    setIsEdit(false);
  };

  const handleDelete = async () => {
    if (!patientId) return;
    
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        setLoading(true);
        await patientAPI.delete(patientId);
        setSuccess('Patient deleted successfully');
        if (onCancel) {
          onCancel();
        }
      } catch (error) {
        setError('Failed to delete patient');
        console.error('Error deleting patient:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`infant-patient-tabpanel-${index}`}
      aria-labelledby={`infant-patient-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            {isEdit ? 'Edit Infant Patient' : 'New Infant Patient'}
          </Typography>
          <Box>
            <Tooltip title="Save">
              <IconButton
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                color="primary"
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear">
              <IconButton onClick={handleClear} disabled={loading}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
            {isEdit && (
              <Tooltip title="Delete">
                <IconButton onClick={handleDelete} disabled={loading} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

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

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Basic Information" />
            <Tab label="Address Information" />
            <Tab label="Family Information" />
            <Tab label="Delivery Information" />
            <Tab label="Treatment Information" />
          </Tabs>
        </Box>

        {/* Basic Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="clinicId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Clinic ID"
                    fullWidth
                    error={!!errors.clinicId}
                    helperText={errors.clinicId?.message}
                    disabled={isEdit}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="dateFirstVisit"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Date of First Visit"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dateFirstVisit,
                        helperText: errors.dateFirstVisit?.message
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Date of Birth"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dateOfBirth,
                        helperText: errors.dateOfBirth?.message
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.sex}>
                    <InputLabel>Sex</InputLabel>
                    <Select {...field} label="Sex">
                      <MenuItem value={0}>Female</MenuItem>
                      <MenuItem value={1}>Male</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="addGuardian"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Add Guardian</InputLabel>
                    <Select {...field} label="Add Guardian">
                      <MenuItem value={0}>Yes</MenuItem>
                      <MenuItem value={1}>No</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="group"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Group"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="nameContact"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contact Person Name"
                    fullWidth
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
                    label="Phone Number"
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Address Information Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="house"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="House Number"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Street"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="province"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
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
                  <FormControl fullWidth>
                    <InputLabel>District</InputLabel>
                    <Select {...field} label="District">
                      {districts.map((district) => (
                        <MenuItem key={district} value={district}>
                          {district}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="commune"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Commune</InputLabel>
                    <Select {...field} label="Commune">
                      {communes.map((commune) => (
                        <MenuItem key={commune} value={commune}>
                          {commune}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="village"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Village</InputLabel>
                    <Select {...field} label="Village">
                      {villages.map((village) => (
                        <MenuItem key={village} value={village}>
                          {village}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="addressContact"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contact Address"
                    fullWidth
                    multiline
                    rows={3}
                  />
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Family Information Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Father Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="fatherAge"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Father Age"
                    fullWidth
                    type="number"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="fatherHIV"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Father HIV Status</InputLabel>
                    <Select {...field} label="Father HIV Status">
                      <MenuItem value={0}>Positive</MenuItem>
                      <MenuItem value={1}>Negative</MenuItem>
                      <MenuItem value={2}>Unknown</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="fatherStatus"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Father Status</InputLabel>
                    <Select {...field} label="Father Status">
                      <MenuItem value={0}>Dead</MenuItem>
                      <MenuItem value={1}>Alive</MenuItem>
                      <MenuItem value={2}>Unknown</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Mother Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="motherAge"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mother Age"
                    fullWidth
                    type="number"
                    error={!!errors.motherAge}
                    helperText={errors.motherAge?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="motherHIV"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Mother HIV Status</InputLabel>
                    <Select {...field} label="Mother HIV Status">
                      <MenuItem value={0}>Positive</MenuItem>
                      <MenuItem value={1}>Negative</MenuItem>
                      <MenuItem value={2}>Unknown</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="motherStatus"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Mother Status</InputLabel>
                    <Select {...field} label="Mother Status">
                      <MenuItem value={0}>Dead</MenuItem>
                      <MenuItem value={1}>Alive</MenuItem>
                      <MenuItem value={2}>Unknown</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            {watchedValues.motherHIV === 0 && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="motherClinicId"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mother Clinic ID"
                        fullWidth
                        error={!!errors.motherClinicId}
                        helperText={errors.motherClinicId?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="motherART"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mother ART Number"
                        fullWidth
                        error={!!errors.motherART}
                        helperText={errors.motherART?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="motherLastVL"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mother Last VL"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dateMotherLastVL"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Date Mother Last VL"
                        slotProps={{
                          textField: {
                            fullWidth: true
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </TabPanel>

        {/* Delivery Information Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="hospitalName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Hospital Name"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="placeDelivery"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Place of Delivery</InputLabel>
                    <Select {...field} label="Place of Delivery">
                      <MenuItem value="Hospital">Hospital</MenuItem>
                      <MenuItem value="Health Center">Health Center</MenuItem>
                      <MenuItem value="Home">Home</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            {watchedValues.placeDelivery === 'Other' && (
              <Grid item xs={12} md={6}>
                <Controller
                  name="placeDeliveryOther"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Other Place of Delivery"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <Controller
                name="pmtct"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="PMTCT"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="dateDelivery"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Date of Delivery"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dateDelivery,
                        helperText: errors.dateDelivery?.message
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="deliveryStatus"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Delivery Status</InputLabel>
                    <Select {...field} label="Delivery Status">
                      <MenuItem value={0}>Normal</MenuItem>
                      <MenuItem value={1}>Caesarean</MenuItem>
                      <MenuItem value={2}>Assisted</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="lengthBaby"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Length of Baby (cm)"
                    fullWidth
                    type="number"
                    error={!!errors.lengthBaby}
                    helperText={errors.lengthBaby?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="weightBaby"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Weight of Baby (kg)"
                    fullWidth
                    type="number"
                    error={!!errors.weightBaby}
                    helperText={errors.weightBaby?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Treatment Information Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="knownHIV"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Known HIV</InputLabel>
                    <Select {...field} label="Known HIV">
                      <MenuItem value={0}>Yes</MenuItem>
                      <MenuItem value={1}>No</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="received"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Received Drug</InputLabel>
                    <Select {...field} label="Received Drug">
                      <MenuItem value={0}>Yes</MenuItem>
                      <MenuItem value={1}>No</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="syrup"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Syrup</InputLabel>
                    <Select {...field} label="Syrup">
                      <MenuItem value={0}>6 weeks</MenuItem>
                      <MenuItem value={1}>12 weeks</MenuItem>
                      <MenuItem value={2}>Unknown</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="cotrim"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Cotrimoxazole</InputLabel>
                    <Select {...field} label="Cotrimoxazole">
                      <MenuItem value={0}>Yes</MenuItem>
                      <MenuItem value={1}>No</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="offIn"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Transfer In/Out</InputLabel>
                    <Select {...field} label="Transfer In/Out">
                      <MenuItem value={0}>No</MenuItem>
                      <MenuItem value={1}>Yes</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            {watchedValues.offIn === 1 && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="siteName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Site Name"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="eoClinicId"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="EO Clinic ID"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6}>
              <Controller
                name="hivTest"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>HIV Test</InputLabel>
                    <Select {...field} label="HIV Test">
                      <MenuItem value={0}>Positive</MenuItem>
                      <MenuItem value={1}>Negative</MenuItem>
                      <MenuItem value={2}>Unknown</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            startIcon={<SaveIcon />}
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Save'}
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default InfantPatientForm;

