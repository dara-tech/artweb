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
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { patientAPI } from '../../services/api';

// Validation schema
const patientStatusSchema = yup.object({
  clinicId: yup.string().required('Clinic ID is required'),
  dateStatus: yup.date().required('Date of status is required'),
  status: yup.string().required('Status is required'),
  reason: yup.string(),
  note: yup.string(),
  // ARV Treatment
  arvRegimen: yup.string(),
  arvStartDate: yup.date(),
  arvStopDate: yup.date(),
  arvStopReason: yup.string(),
  // CD4 Count
  cd4Count: yup.number(),
  cd4Date: yup.date(),
  // Viral Load
  viralLoad: yup.number(),
  viralLoadDate: yup.date(),
  // TB Information
  tbStatus: yup.string(),
  tbStartDate: yup.date(),
  tbEndDate: yup.date(),
  tbResult: yup.string(),
  // Opportunistic Infections
  oiStatus: yup.string(),
  oiType: yup.string(),
  oiStartDate: yup.date(),
  oiEndDate: yup.date(),
  // Weight and Height
  weight: yup.number(),
  height: yup.number(),
  bmi: yup.number(),
  // Pregnancy Information
  pregnancyStatus: yup.string(),
  pregnancyDate: yup.date(),
  // Adherence
  adherence: yup.string(),
  adherenceDate: yup.date()
});

const PatientStatusForm = ({ patientId, onSave, onCancel }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [patient, setPatient] = useState(null);
  const [searchClinicId, setSearchClinicId] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(patientStatusSchema),
    defaultValues: {
      clinicId: '',
      dateStatus: null,
      status: '',
      reason: '',
      note: '',
      arvRegimen: '',
      arvStartDate: null,
      arvStopDate: null,
      arvStopReason: '',
      cd4Count: null,
      cd4Date: null,
      viralLoad: null,
      viralLoadDate: null,
      tbStatus: '',
      tbStartDate: null,
      tbEndDate: null,
      tbResult: '',
      oiStatus: '',
      oiType: '',
      oiStartDate: null,
      oiEndDate: null,
      weight: null,
      height: null,
      bmi: null,
      pregnancyStatus: '',
      pregnancyDate: null,
      adherence: '',
      adherenceDate: null
    }
  });

  // Watch form values for conditional logic
  const watchedValues = watch();

  // Load patient data if editing
  useEffect(() => {
    if (patientId) {
      loadPatientStatusData(patientId);
      setIsEdit(true);
    }
  }, [patientId]);

  const searchPatient = async () => {
    if (!searchClinicId.trim()) return;
    
    try {
      setLoading(true);
      const response = await patientAPI.getByClinicId(searchClinicId);
      setPatient(response.data);
      setValue('clinicId', response.data.clinicId);
    } catch (error) {
      setError('Patient not found');
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientStatusData = async (id) => {
    try {
      setLoading(true);
      const response = await patientAPI.getStatusById(id);
      const status = response.data;
      
      // Map the status data to form values
      reset({
        clinicId: status.clinicId || '',
        dateStatus: status.dateStatus ? dayjs(status.dateStatus) : null,
        status: status.status || '',
        reason: status.reason || '',
        note: status.note || '',
        arvRegimen: status.arvRegimen || '',
        arvStartDate: status.arvStartDate ? dayjs(status.arvStartDate) : null,
        arvStopDate: status.arvStopDate ? dayjs(status.arvStopDate) : null,
        arvStopReason: status.arvStopReason || '',
        cd4Count: status.cd4Count || null,
        cd4Date: status.cd4Date ? dayjs(status.cd4Date) : null,
        viralLoad: status.viralLoad || null,
        viralLoadDate: status.viralLoadDate ? dayjs(status.viralLoadDate) : null,
        tbStatus: status.tbStatus || '',
        tbStartDate: status.tbStartDate ? dayjs(status.tbStartDate) : null,
        tbEndDate: status.tbEndDate ? dayjs(status.tbEndDate) : null,
        tbResult: status.tbResult || '',
        oiStatus: status.oiStatus || '',
        oiType: status.oiType || '',
        oiStartDate: status.oiStartDate ? dayjs(status.oiStartDate) : null,
        oiEndDate: status.oiEndDate ? dayjs(status.oiEndDate) : null,
        weight: status.weight || null,
        height: status.height || null,
        bmi: status.bmi || null,
        pregnancyStatus: status.pregnancyStatus || '',
        pregnancyDate: status.pregnancyDate ? dayjs(status.pregnancyDate) : null,
        adherence: status.adherence || '',
        adherenceDate: status.adherenceDate ? dayjs(status.adherenceDate) : null
      });
    } catch (error) {
      setError('Failed to load patient status data');
      console.error('Error loading patient status:', error);
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
        dateStatus: data.dateStatus?.toISOString(),
        arvStartDate: data.arvStartDate?.toISOString(),
        arvStopDate: data.arvStopDate?.toISOString(),
        cd4Date: data.cd4Date?.toISOString(),
        viralLoadDate: data.viralLoadDate?.toISOString(),
        tbStartDate: data.tbStartDate?.toISOString(),
        tbEndDate: data.tbEndDate?.toISOString(),
        oiStartDate: data.oiStartDate?.toISOString(),
        oiEndDate: data.oiEndDate?.toISOString(),
        pregnancyDate: data.pregnancyDate?.toISOString(),
        adherenceDate: data.adherenceDate?.toISOString()
      };

      if (isEdit) {
        await patientAPI.updateStatus(patientId, formattedData);
        setSuccess('Patient status updated successfully');
      } else {
        await patientAPI.createStatus(formattedData);
        setSuccess('Patient status created successfully');
      }

      if (onSave) {
        onSave(formattedData);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save patient status');
      console.error('Error saving patient status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    reset();
    setError(null);
    setSuccess(null);
    setIsEdit(false);
    setPatient(null);
    setSearchClinicId('');
  };

  const handleDelete = async () => {
    if (!patientId) return;
    
    if (window.confirm('Are you sure you want to delete this patient status?')) {
      try {
        setLoading(true);
        await patientAPI.deleteStatus(patientId);
        setSuccess('Patient status deleted successfully');
        if (onCancel) {
          onCancel();
        }
      } catch (error) {
        setError('Failed to delete patient status');
        console.error('Error deleting patient status:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-status-tabpanel-${index}`}
      aria-labelledby={`patient-status-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Lost to Follow-up': return 'warning';
      case 'Transferred Out': return 'info';
      case 'Died': return 'error';
      case 'Stopped': return 'default';
      default: return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            {isEdit ? 'Edit Patient Status' : 'New Patient Status'}
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

        {/* Patient Search */}
        {!isEdit && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Search Patient
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  label="Clinic ID"
                  value={searchClinicId}
                  onChange={(e) => setSearchClinicId(e.target.value)}
                  fullWidth
                  onKeyPress={(e) => e.key === 'Enter' && searchPatient()}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={searchPatient}
                  disabled={loading || !searchClinicId.trim()}
                >
                  Search Patient
                </Button>
              </Grid>
            </Grid>
            
            {patient && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Patient Found:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Clinic ID: {patient.clinicId}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Name: {patient.firstName} {patient.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      DOB: {dayjs(patient.dateOfBirth).format('DD/MM/YYYY')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Sex: {patient.sex === 0 ? 'Female' : 'Male'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Status Information" />
            <Tab label="ARV Treatment" />
            <Tab label="Laboratory Results" />
            <Tab label="TB Information" />
            <Tab label="Opportunistic Infections" />
            <Tab label="Physical Measurements" />
            <Tab label="Pregnancy & Adherence" />
          </Tabs>
        </Box>

        {/* Status Information Tab */}
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
                    disabled={isEdit || !!patient}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="dateStatus"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Date of Status"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dateStatus,
                        helperText: errors.dateStatus?.message
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Lost to Follow-up">Lost to Follow-up</MenuItem>
                      <MenuItem value="Transferred Out">Transferred Out</MenuItem>
                      <MenuItem value="Died">Died</MenuItem>
                      <MenuItem value="Stopped">Stopped</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Reason"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Note"
                    fullWidth
                    multiline
                    rows={3}
                  />
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* ARV Treatment Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="arvRegimen"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>ARV Regimen</InputLabel>
                    <Select {...field} label="ARV Regimen">
                      <MenuItem value="TDF+3TC+EFV">TDF+3TC+EFV</MenuItem>
                      <MenuItem value="TDF+3TC+NVP">TDF+3TC+NVP</MenuItem>
                      <MenuItem value="AZT+3TC+EFV">AZT+3TC+EFV</MenuItem>
                      <MenuItem value="AZT+3TC+NVP">AZT+3TC+NVP</MenuItem>
                      <MenuItem value="ABC+3TC+EFV">ABC+3TC+EFV</MenuItem>
                      <MenuItem value="ABC+3TC+NVP">ABC+3TC+NVP</MenuItem>
                      <MenuItem value="TDF+3TC+DTG">TDF+3TC+DTG</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="arvStartDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="ARV Start Date"
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="arvStopDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="ARV Stop Date"
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="arvStopReason"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>ARV Stop Reason</InputLabel>
                    <Select {...field} label="ARV Stop Reason">
                      <MenuItem value="Side Effects">Side Effects</MenuItem>
                      <MenuItem value="Treatment Failure">Treatment Failure</MenuItem>
                      <MenuItem value="Patient Request">Patient Request</MenuItem>
                      <MenuItem value="Lost to Follow-up">Lost to Follow-up</MenuItem>
                      <MenuItem value="Transferred Out">Transferred Out</MenuItem>
                      <MenuItem value="Died">Died</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Laboratory Results Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="cd4Count"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="CD4 Count"
                    fullWidth
                    type="number"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="cd4Date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="CD4 Date"
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="viralLoad"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Viral Load"
                    fullWidth
                    type="number"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="viralLoadDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Viral Load Date"
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* TB Information Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="tbStatus"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>TB Status</InputLabel>
                    <Select {...field} label="TB Status">
                      <MenuItem value="No TB">No TB</MenuItem>
                      <MenuItem value="TB Suspected">TB Suspected</MenuItem>
                      <MenuItem value="TB Confirmed">TB Confirmed</MenuItem>
                      <MenuItem value="TB Treatment">TB Treatment</MenuItem>
                      <MenuItem value="TB Completed">TB Completed</MenuItem>
                      <MenuItem value="TB Failed">TB Failed</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="tbStartDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="TB Start Date"
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="tbEndDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="TB End Date"
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="tbResult"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>TB Result</InputLabel>
                    <Select {...field} label="TB Result">
                      <MenuItem value="Cured">Cured</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Failed">Failed</MenuItem>
                      <MenuItem value="Died">Died</MenuItem>
                      <MenuItem value="Lost to Follow-up">Lost to Follow-up</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Opportunistic Infections Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="oiStatus"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>OI Status</InputLabel>
                    <Select {...field} label="OI Status">
                      <MenuItem value="No OI">No OI</MenuItem>
                      <MenuItem value="OI Suspected">OI Suspected</MenuItem>
                      <MenuItem value="OI Confirmed">OI Confirmed</MenuItem>
                      <MenuItem value="OI Treatment">OI Treatment</MenuItem>
                      <MenuItem value="OI Completed">OI Completed</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="oiType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>OI Type</InputLabel>
                    <Select {...field} label="OI Type">
                      <MenuItem value="PCP">PCP</MenuItem>
                      <MenuItem value="Cryptococcal Meningitis">Cryptococcal Meningitis</MenuItem>
                      <MenuItem value="Toxoplasmosis">Toxoplasmosis</MenuItem>
                      <MenuItem value="CMV">CMV</MenuItem>
                      <MenuItem value="Kaposi Sarcoma">Kaposi Sarcoma</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="oiStartDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="OI Start Date"
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="oiEndDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="OI End Date"
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Physical Measurements Tab */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Controller
                name="weight"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Weight (kg)"
                    fullWidth
                    type="number"
                    inputProps={{ step: 0.1 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="height"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Height (cm)"
                    fullWidth
                    type="number"
                    inputProps={{ step: 0.1 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="bmi"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="BMI"
                    fullWidth
                    type="number"
                    inputProps={{ step: 0.1 }}
                    disabled
                  />
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Pregnancy & Adherence Tab */}
        <TabPanel value={tabValue} index={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="pregnancyStatus"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Pregnancy Status</InputLabel>
                    <Select {...field} label="Pregnancy Status">
                      <MenuItem value="Not Pregnant">Not Pregnant</MenuItem>
                      <MenuItem value="Pregnant">Pregnant</MenuItem>
                      <MenuItem value="Postpartum">Postpartum</MenuItem>
                      <MenuItem value="Breastfeeding">Breastfeeding</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="pregnancyDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Pregnancy Date"
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="adherence"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Adherence</InputLabel>
                    <Select {...field} label="Adherence">
                      <MenuItem value="Excellent">Excellent (95-100%)</MenuItem>
                      <MenuItem value="Good">Good (85-94%)</MenuItem>
                      <MenuItem value="Fair">Fair (70-84%)</MenuItem>
                      <MenuItem value="Poor">Poor (<70%)</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="adherenceDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Adherence Date"
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
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

export default PatientStatusForm;

