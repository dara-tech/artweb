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
  TableRow
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
const childPatientSchema = yup.object({
  clinicId: yup.string().required('Clinic ID is required'),
  dateFirstVisit: yup.date().required('Date of first visit is required'),
  dateOfBirth: yup.date().required('Date of birth is required'),
  sex: yup.number().required('Sex is required'),
  referred: yup.number(),
  eidClinicId: yup.string(),
  dateTest: yup.date(),
  typeTest: yup.number(),
  vcctSite: yup.string(),
  vcctId: yup.string(),
  transferIn: yup.number(),
  artNumber: yup.string(),
  dateStartART: yup.date(),
  feeding: yup.number(),
  tbPast: yup.number(),
  typeTB: yup.number(),
  resultTB: yup.number(),
  dateOnset: yup.date(),
  tbTreatment: yup.number(),
  dateTreatment: yup.date(),
  resultTreatment: yup.number(),
  dateResultTreatment: yup.date(),
  inh: yup.number(),
  tptDrug: yup.number(),
  dateStartTPT: yup.date(),
  dateEndTPT: yup.date(),
  otherPast: yup.number(),
  cotrim: yup.number(),
  fluconazole: yup.number(),
  allergy: yup.number(),
  nationality: yup.string()
});

const ChildPatientForm = ({ patientId, onSave, onCancel }) => {
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
    resolver: yupResolver(childPatientSchema),
    defaultValues: {
      clinicId: '',
      dateFirstVisit: null,
      dateOfBirth: null,
      sex: null,
      referred: null,
      eidClinicId: '',
      dateTest: null,
      typeTest: null,
      vcctSite: '',
      vcctId: '',
      transferIn: null,
      artNumber: '',
      dateStartART: null,
      feeding: null,
      tbPast: null,
      typeTB: null,
      resultTB: null,
      dateOnset: null,
      tbTreatment: null,
      dateTreatment: null,
      resultTreatment: null,
      dateResultTreatment: null,
      inh: null,
      tptDrug: null,
      dateStartTPT: null,
      dateEndTPT: null,
      otherPast: null,
      cotrim: null,
      fluconazole: null,
      allergy: null,
      nationality: '',
      // Family Information
      familyMembers: [],
      // ARV Treatment History
      arvTreatments: [],
      // Allergies
      allergies: []
    }
  });

  const { fields: familyFields, append: appendFamily, remove: removeFamily } = useFieldArray({
    control,
    name: 'familyMembers'
  });

  const { fields: arvFields, append: appendArv, remove: removeArv } = useFieldArray({
    control,
    name: 'arvTreatments'
  });

  const { fields: allergyFields, append: appendAllergy, remove: removeAllergy } = useFieldArray({
    control,
    name: 'allergies'
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
        referred: patient.referred || null,
        eidClinicId: patient.eidClinicId || '',
        dateTest: patient.dateTest ? dayjs(patient.dateTest) : null,
        typeTest: patient.typeTest || null,
        vcctSite: patient.vcctSite || '',
        vcctId: patient.vcctId || '',
        transferIn: patient.transferIn || null,
        artNumber: patient.artNumber || '',
        dateStartART: patient.dateStartART ? dayjs(patient.dateStartART) : null,
        feeding: patient.feeding || null,
        tbPast: patient.tbPast || null,
        typeTB: patient.typeTB || null,
        resultTB: patient.resultTB || null,
        dateOnset: patient.dateOnset ? dayjs(patient.dateOnset) : null,
        tbTreatment: patient.tbTreatment || null,
        dateTreatment: patient.dateTreatment ? dayjs(patient.dateTreatment) : null,
        resultTreatment: patient.resultTreatment || null,
        dateResultTreatment: patient.dateResultTreatment ? dayjs(patient.dateResultTreatment) : null,
        inh: patient.inh || null,
        tptDrug: patient.tptDrug || null,
        dateStartTPT: patient.dateStartTPT ? dayjs(patient.dateStartTPT) : null,
        dateEndTPT: patient.dateEndTPT ? dayjs(patient.dateEndTPT) : null,
        otherPast: patient.otherPast || null,
        cotrim: patient.cotrim || null,
        fluconazole: patient.fluconazole || null,
        allergy: patient.allergy || null,
        nationality: patient.nationality || '',
        familyMembers: patient.familyMembers || [],
        arvTreatments: patient.arvTreatments || [],
        allergies: patient.allergies || []
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
        dateTest: data.dateTest?.toISOString(),
        dateStartART: data.dateStartART?.toISOString(),
        dateOnset: data.dateOnset?.toISOString(),
        dateTreatment: data.dateTreatment?.toISOString(),
        dateResultTreatment: data.dateResultTreatment?.toISOString(),
        dateStartTPT: data.dateStartTPT?.toISOString(),
        dateEndTPT: data.dateEndTPT?.toISOString()
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
      id={`child-patient-tabpanel-${index}`}
      aria-labelledby={`child-patient-tab-${index}`}
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
            {isEdit ? 'Edit Child Patient' : 'New Child Patient'}
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
            <Tab label="Family Information" />
            <Tab label="Allergies" />
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
                name="referred"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Referred By</InputLabel>
                    <Select {...field} label="Referred By">
                      <MenuItem value={0}>Self Referral</MenuItem>
                      <MenuItem value={1}>CA/NGO</MenuItem>
                      <MenuItem value={2}>VCCT</MenuItem>
                      <MenuItem value={3}>Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="feeding"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Feeding</InputLabel>
                    <Select {...field} label="Feeding">
                      <MenuItem value={0}>Breastfeeding</MenuItem>
                      <MenuItem value={1}>Formula</MenuItem>
                      <MenuItem value={2}>Mixed</MenuItem>
                      <MenuItem value={3}>Other</MenuItem>
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
          </Grid>
        </TabPanel>

        {/* HIV Testing Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="eidClinicId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="EID Clinic ID"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="dateTest"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Date of Test"
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
                name="typeTest"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Type of Test</InputLabel>
                    <Select {...field} label="Type of Test">
                      <MenuItem value={0}>PCR</MenuItem>
                      <MenuItem value={1}>Rapid Test</MenuItem>
                      <MenuItem value={2}>ELISA</MenuItem>
                    </Select>
                  </FormControl>
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
                name="tbPast"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>TB Past</InputLabel>
                    <Select {...field} label="TB Past">
                      <MenuItem value={0}>Yes</MenuItem>
                      <MenuItem value={1}>No</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="inh"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>INH</InputLabel>
                    <Select {...field} label="INH">
                      <MenuItem value={0}>Yes</MenuItem>
                      <MenuItem value={1}>No</MenuItem>
                      <MenuItem value={2}>Unknown</MenuItem>
                      <MenuItem value={3}>Ongoing</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            {watchedValues.inh > 0 && (
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
            {watchedValues.tbPast === 0 && (
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
                    name="tbTreatment"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>TB Treatment</InputLabel>
                        <Select {...field} label="TB Treatment">
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
                    name="dateResultTreatment"
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
                name="otherPast"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Other Past ARV</InputLabel>
                    <Select {...field} label="Other Past ARV">
                      <MenuItem value={0}>Yes</MenuItem>
                      <MenuItem value={1}>No</MenuItem>
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
                name="fluconazole"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Fluconazole</InputLabel>
                    <Select {...field} label="Fluconazole">
                      <MenuItem value={0}>Yes</MenuItem>
                      <MenuItem value={1}>No</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          {watchedValues.otherPast === 0 && (
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

        {/* Family Information Tab */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Family Members
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Family Member</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>HIV Status</TableCell>
                    <TableCell>Family Status</TableCell>
                    <TableCell>Starting ARV</TableCell>
                    <TableCell>Pregnant Status</TableCell>
                    <TableCell>Site Name</TableCell>
                    <TableCell>History of TB</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {familyFields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Controller
                          name={`familyMembers.${index}.family`}
                          control={control}
                          render={({ field }) => (
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select {...field}>
                                <MenuItem value="Mother">Mother</MenuItem>
                                <MenuItem value="Father">Father</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`familyMembers.${index}.age`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              type="number"
                              sx={{ width: 80 }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`familyMembers.${index}.hivStatus`}
                          control={control}
                          render={({ field }) => (
                            <FormControl size="small" sx={{ minWidth: 100 }}>
                              <Select {...field}>
                                <MenuItem value="Positive">Positive</MenuItem>
                                <MenuItem value="Negative">Negative</MenuItem>
                                <MenuItem value="Unknown">Unknown</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`familyMembers.${index}.familyStatus`}
                          control={control}
                          render={({ field }) => (
                            <FormControl size="small" sx={{ minWidth: 100 }}>
                              <Select {...field}>
                                <MenuItem value="Dead">Dead</MenuItem>
                                <MenuItem value="Alive">Alive</MenuItem>
                                <MenuItem value="Unknown">Unknown</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`familyMembers.${index}.startingARV`}
                          control={control}
                          render={({ field }) => (
                            <FormControl size="small" sx={{ minWidth: 100 }}>
                              <Select {...field}>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                                <MenuItem value="Unknown">Unknown</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`familyMembers.${index}.pregnantStatus`}
                          control={control}
                          render={({ field }) => (
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select {...field}>
                                <MenuItem value="During pregnancy">During pregnancy</MenuItem>
                                <MenuItem value="During delivery">During delivery</MenuItem>
                                <MenuItem value="After delivery">After delivery</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`familyMembers.${index}.siteName`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              sx={{ width: 120 }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`familyMembers.${index}.tbHistory`}
                          control={control}
                          render={({ field }) => (
                            <FormControl size="small" sx={{ minWidth: 100 }}>
                              <Select {...field}>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                                <MenuItem value="Unknown">Unknown</MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => removeFamily(index)}
                          color="error"
                          size="small"
                        >
                          <RemoveIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              startIcon={<AddIcon />}
              onClick={() => appendFamily({
                family: '',
                age: '',
                hivStatus: '',
                familyStatus: '',
                startingARV: '',
                pregnantStatus: '',
                siteName: '',
                tbHistory: ''
              })}
              variant="outlined"
              sx={{ mt: 2 }}
            >
              Add Family Member
            </Button>
          </Box>
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
                    <Grid item xs={12} md={6}>
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
                    <Grid item xs={12} md={5}>
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
                onClick={() => appendAllergy({ drug: '', allergy: '' })}
                variant="outlined"
              >
                Add Allergy
              </Button>
            </Box>
          )}
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

export default ChildPatientForm;

