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
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { patientAPI } from '../../services/api';

// Validation schema
const adultPatientSchema = yup.object({
  clinicId: yup.string().required('Clinic ID is required'),
  dateFirstVisit: yup.date().required('Date of first visit is required'),
  dateOfBirth: yup.date().required('Date of birth is required'),
  sex: yup.number().required('Sex is required'),
  education: yup.number(),
  read: yup.number(),
  write: yup.number(),
  referred: yup.number(),
  dateTestHIV: yup.date(),
  vcctSite: yup.string(),
  vcctId: yup.string(),
  transferIn: yup.number(),
  artNumber: yup.string(),
  dateStartART: yup.date(),
  tbHistory: yup.number(),
  tpt: yup.number(),
  tptDrug: yup.number(),
  dateStartTPT: yup.date(),
  dateEndTPT: yup.date(),
  typeTB: yup.number(),
  resultTB: yup.number(),
  dateOnset: yup.date(),
  tbCategory: yup.number(),
  dateTreatment: yup.date(),
  resultTreatment: yup.number(),
  dateCompleteTreatment: yup.date(),
  arvHistory: yup.number(),
  diabetes: yup.boolean(),
  hypertension: yup.boolean(),
  abnormal: yup.boolean(),
  renal: yup.boolean(),
  anemia: yup.boolean(),
  liver: yup.boolean(),
  hepatitisB: yup.boolean(),
  other: yup.boolean(),
  allergy: yup.number(),
  nationality: yup.string(),
  targetGroup: yup.string(),
  refugeeStatus: yup.number(),
  refugeeART: yup.string(),
  refugeeSite: yup.string()
});

const AdultPatientForm = ({ patientId, onSave, onCancel }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(adultPatientSchema),
    defaultValues: {
      clinicId: '',
      dateFirstVisit: null,
      dateOfBirth: null,
      sex: null,
      education: null,
      read: null,
      write: null,
      referred: null,
      dateTestHIV: null,
      vcctSite: '',
      vcctId: '',
      transferIn: null,
      artNumber: '',
      dateStartART: null,
      tbHistory: null,
      tpt: null,
      tptDrug: null,
      dateStartTPT: null,
      dateEndTPT: null,
      typeTB: null,
      resultTB: null,
      dateOnset: null,
      tbCategory: null,
      dateTreatment: null,
      resultTreatment: null,
      dateCompleteTreatment: null,
      arvHistory: null,
      diabetes: false,
      hypertension: false,
      abnormal: false,
      renal: false,
      anemia: false,
      liver: false,
      hepatitisB: false,
      other: false,
      allergy: null,
      nationality: '',
      targetGroup: '',
      refugeeStatus: null,
      refugeeART: '',
      refugeeSite: '',
      // ARV Treatment History
      arvTreatments: [],
      // Allergies
      allergies: [],
      // Other Medical Conditions
      otherMedical: []
    }
  });

  const { fields: arvFields, append: appendArv, remove: removeArv } = useFieldArray({
    control,
    name: 'arvTreatments'
  });

  const { fields: allergyFields, append: appendAllergy, remove: removeAllergy } = useFieldArray({
    control,
    name: 'allergies'
  });

  const { fields: medicalFields, append: appendMedical, remove: removeMedical } = useFieldArray({
    control,
    name: 'otherMedical'
  });

  // Watch form values for conditional logic
  const watchedValues = watch();

  // Load patient data if editing
  useEffect(() => {
    if (patientId) {
      loadPatientData(patientId);
      setIsEdit(true);
    }
  }, [patientId]);

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
        education: patient.education || null,
        read: patient.read || null,
        write: patient.write || null,
        referred: patient.referred || null,
        dateTestHIV: patient.dateTestHIV ? dayjs(patient.dateTestHIV) : null,
        vcctSite: patient.vcctSite || '',
        vcctId: patient.vcctId || '',
        transferIn: patient.transferIn || null,
        artNumber: patient.artNumber || '',
        dateStartART: patient.dateStartART ? dayjs(patient.dateStartART) : null,
        tbHistory: patient.tbHistory || null,
        tpt: patient.tpt || null,
        tptDrug: patient.tptDrug || null,
        dateStartTPT: patient.dateStartTPT ? dayjs(patient.dateStartTPT) : null,
        dateEndTPT: patient.dateEndTPT ? dayjs(patient.dateEndTPT) : null,
        typeTB: patient.typeTB || null,
        resultTB: patient.resultTB || null,
        dateOnset: patient.dateOnset ? dayjs(patient.dateOnset) : null,
        tbCategory: patient.tbCategory || null,
        dateTreatment: patient.dateTreatment ? dayjs(patient.dateTreatment) : null,
        resultTreatment: patient.resultTreatment || null,
        dateCompleteTreatment: patient.dateCompleteTreatment ? dayjs(patient.dateCompleteTreatment) : null,
        arvHistory: patient.arvHistory || null,
        diabetes: patient.diabetes || false,
        hypertension: patient.hypertension || false,
        abnormal: patient.abnormal || false,
        renal: patient.renal || false,
        anemia: patient.anemia || false,
        liver: patient.liver || false,
        hepatitisB: patient.hepatitisB || false,
        other: patient.other || false,
        allergy: patient.allergy || null,
        nationality: patient.nationality || '',
        targetGroup: patient.targetGroup || '',
        refugeeStatus: patient.refugeeStatus || null,
        refugeeART: patient.refugeeART || '',
        refugeeSite: patient.refugeeSite || '',
        arvTreatments: patient.arvTreatments || [],
        allergies: patient.allergies || [],
        otherMedical: patient.otherMedical || []
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
        dateTestHIV: data.dateTestHIV?.toISOString(),
        dateStartART: data.dateStartART?.toISOString(),
        dateStartTPT: data.dateStartTPT?.toISOString(),
        dateEndTPT: data.dateEndTPT?.toISOString(),
        dateOnset: data.dateOnset?.toISOString(),
        dateTreatment: data.dateTreatment?.toISOString(),
        dateCompleteTreatment: data.dateCompleteTreatment?.toISOString()
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
      id={`adult-patient-tabpanel-${index}`}
      aria-labelledby={`adult-patient-tab-${index}`}
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
            {isEdit ? 'Edit Adult Patient' : 'New Adult Patient'}
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
            <Tab label="HIV Testing" />
            <Tab label="TB Information" />
            <Tab label="ARV Treatment" />
            <Tab label="Medical History" />
            <Tab label="Allergies" />
            <Tab label="Additional Info" />
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
            <Grid item xs={12} md={4}>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Education Level</InputLabel>
                    <Select {...field} label="Education Level">
                      <MenuItem value={0}>No Education</MenuItem>
                      <MenuItem value={1}>Primary</MenuItem>
                      <MenuItem value={2}>Secondary</MenuItem>
                      <MenuItem value={3}>High School</MenuItem>
                      <MenuItem value={4}>University</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="read"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Can Read</InputLabel>
                    <Select {...field} label="Can Read">
                      <MenuItem value={0}>No</MenuItem>
                      <MenuItem value={1}>Yes</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="write"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Can Write</InputLabel>
                    <Select {...field} label="Can Write">
                      <MenuItem value={0}>No</MenuItem>
                      <MenuItem value={1}>Yes</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="referred"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Referred By</InputLabel>
                    <Select {...field} label="Referred By">
                      <MenuItem value={0}>Self</MenuItem>
                      <MenuItem value={1}>Home Care</MenuItem>
                      <MenuItem value={2}>VCCT</MenuItem>
                      <MenuItem value={3}>PMTCT</MenuItem>
                      <MenuItem value={4}>TB Program</MenuItem>
                      <MenuItem value={5}>Blood Center</MenuItem>
                      <MenuItem value={6}>Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nationality"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="targetGroup"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Target Group</InputLabel>
                    <Select {...field} label="Target Group">
                      <MenuItem value="GP">General Population</MenuItem>
                      <MenuItem value="FEW">Female Entertainment Workers</MenuItem>
                      <MenuItem value="MSM">Men who have Sex with Men</MenuItem>
                      <MenuItem value="TG">Transgender</MenuItem>
                      <MenuItem value="MEW">Male Entertainment Workers</MenuItem>
                      <MenuItem value="PPW">Pregnant and Postpartum Women</MenuItem>
                      <MenuItem value="IDU">Injecting Drug Users</MenuItem>
                      <MenuItem value="Prisoners">Prisoners</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* HIV Testing Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="dateTestHIV"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Date of HIV Test"
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
                name="vcctSite"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="VCCT Site"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="vcctId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="VCCT ID"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="transferIn"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Transfer In</InputLabel>
                    <Select {...field} label="Transfer In">
                      <MenuItem value={0}>No</MenuItem>
                      <MenuItem value={1}>Yes</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            {watchedValues.transferIn === 1 && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="artNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="ART Number"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dateStartART"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Date Started ART"
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

        {/* TB Information Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="tbHistory"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>TB History</InputLabel>
                    <Select {...field} label="TB History">
                      <MenuItem value={0}>Yes</MenuItem>
                      <MenuItem value={1}>No</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="tpt"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>TPT</InputLabel>
                    <Select {...field} label="TPT">
                      <MenuItem value={0}>No</MenuItem>
                      <MenuItem value={1}>6H</MenuItem>
                      <MenuItem value={2}>3HP</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            {watchedValues.tpt > 0 && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="tptDrug"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>TPT Drug</InputLabel>
                        <Select {...field} label="TPT Drug">
                          <MenuItem value={0}>Isoniazid</MenuItem>
                          <MenuItem value={1}>Isoniazid + Rifapentine</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dateStartTPT"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Date Started TPT"
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
                    name="dateEndTPT"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Date Ended TPT"
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
            {watchedValues.tbHistory === 0 && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="typeTB"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Type of TB</InputLabel>
                        <Select {...field} label="Type of TB">
                          <MenuItem value={0}>Pulmonary</MenuItem>
                          <MenuItem value={1}>Extra-pulmonary</MenuItem>
                          <MenuItem value={2}>Both</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="resultTB"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>TB Test Result</InputLabel>
                        <Select {...field} label="TB Test Result">
                          <MenuItem value={0}>Positive</MenuItem>
                          <MenuItem value={1}>Negative</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dateOnset"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Date of Onset"
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
                    name="tbCategory"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>TB Category</InputLabel>
                        <Select {...field} label="TB Category">
                          <MenuItem value={0}>Category I</MenuItem>
                          <MenuItem value={1}>Category II</MenuItem>
                          <MenuItem value={2}>Category III</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dateTreatment"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Date of Treatment"
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
                    name="resultTreatment"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Treatment Result</InputLabel>
                        <Select {...field} label="Treatment Result">
                          <MenuItem value={0}>Cured</MenuItem>
                          <MenuItem value={1}>Completed</MenuItem>
                          <MenuItem value={2}>Failed</MenuItem>
                          <MenuItem value={3}>Died</MenuItem>
                          <MenuItem value={4}>Lost to Follow-up</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dateCompleteTreatment"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Date Completed Treatment"
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

        {/* ARV Treatment Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="arvHistory"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>ARV History</InputLabel>
                    <Select {...field} label="ARV History">
                      <MenuItem value={0}>Yes</MenuItem>
                      <MenuItem value={1}>No</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          {watchedValues.arvHistory === 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                ARV Treatment History
              </Typography>
              {arvFields.map((field, index) => (
                <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <Controller
                        name={`arvTreatments.${index}.drug`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Drug Name"
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Controller
                        name={`arvTreatments.${index}.clinic`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Clinic"
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Controller
                        name={`arvTreatments.${index}.startDate`}
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            label="Start Date"
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: 'small'
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Controller
                        name={`arvTreatments.${index}.stopDate`}
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            label="Stop Date"
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: 'small'
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Controller
                        name={`arvTreatments.${index}.note`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Note"
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <IconButton
                        onClick={() => removeArv(index)}
                        color="error"
                        size="small"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => appendArv({ drug: '', clinic: '', startDate: null, stopDate: null, note: '' })}
                variant="outlined"
              >
                Add ARV Treatment
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* Medical History Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Medical Conditions
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="diabetes"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Diabetes"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="hypertension"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Hypertension"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="abnormal"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Abnormal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="renal"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Renal"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="anemia"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Anemia"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="liver"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Liver"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="hepatitisB"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Hepatitis B"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="other"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Other"
                  />
                )}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Allergies Tab */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="allergy"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Allergy Status</InputLabel>
                    <Select {...field} label="Allergy Status">
                      <MenuItem value={0}>Yes</MenuItem>
                      <MenuItem value={1}>No</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          {watchedValues.allergy === 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Drug Allergies
              </Typography>
              {allergyFields.map((field, index) => (
                <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Controller
                        name={`allergies.${index}.drug`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Drug Name"
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name={`allergies.${index}.allergy`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Allergy Type"
                            fullWidth
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Controller
                        name={`allergies.${index}.date`}
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            label="Date"
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                size: 'small'
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <IconButton
                        onClick={() => removeAllergy(index)}
                        color="error"
                        size="small"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => appendAllergy({ drug: '', allergy: '', date: null })}
                variant="outlined"
              >
                Add Allergy
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* Additional Info Tab */}
        <TabPanel value={tabValue} index={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="refugeeStatus"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Refugee Status</InputLabel>
                    <Select {...field} label="Refugee Status">
                      <MenuItem value={0}>Yes</MenuItem>
                      <MenuItem value={1}>No</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            {watchedValues.refugeeStatus === 0 && (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="refugeeART"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Refugee ART Number"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="refugeeSite"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Refugee Site"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </>
            )}
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

export default AdultPatientForm;

