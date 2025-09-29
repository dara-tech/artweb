// Validation utilities based on old VB.NET system intelligence
import moment from 'moment';

// Date validation rules from old system
export const validateDate = (date, fieldName, options = {}) => {
  const errors = [];
  const dateMoment = moment(date);
  
  if (!dateMoment.isValid()) {
    errors.push(`${fieldName} is not a valid date`);
    return errors;
  }
  
  // Check if date is in the future
  if (dateMoment.isAfter(moment(), 'day')) {
    errors.push(`${fieldName} cannot be in the future`);
  }
  
  // Check if date is too old (before 1990)
  if (dateMoment.isBefore('1990-01-01')) {
    errors.push(`${fieldName} cannot be before 1990`);
  }
  
  // Check if date is too old (before 1930 for birth dates)
  if (options.minDate && dateMoment.isBefore(options.minDate)) {
    errors.push(`${fieldName} cannot be before ${options.minDate}`);
  }
  
  return errors;
};

// Age validation rules from old system
export const validateAge = (age, fieldName = 'Age') => {
  const errors = [];
  
  if (age < 0) {
    errors.push(`${fieldName} cannot be negative`);
  }
  
  if (age > 100) {
    errors.push(`${fieldName} cannot be greater than 100`);
  }
  
  if (age < 2) {
    errors.push(`${fieldName} must be at least 2 years old`);
  }
  
  return errors;
};

// Visit date validation against birth date
export const validateVisitDate = (visitDate, birthDate) => {
  const errors = [];
  
  if (moment(visitDate).isBefore(moment(birthDate))) {
    errors.push('Visit date cannot be before birth date');
  }
  
  return errors;
};

// Appointment date validation
export const validateAppointmentDate = (appointmentDate, visitDate) => {
  const errors = [];
  
  if (moment(appointmentDate).isSameOrBefore(moment(visitDate))) {
    errors.push('Appointment date must be after visit date');
  }
  
  return errors;
};

// HIV test date validation
export const validateHIVTestDate = (testDate, visitDate) => {
  const errors = [];
  
  if (moment(testDate).isAfter(moment())) {
    errors.push('HIV test date cannot be in the future');
  }
  
  if (moment(testDate).isBefore(moment(visitDate))) {
    errors.push('HIV test date cannot be before visit date');
  }
  
  return errors;
};

// Business rule validations
export const validateBusinessRules = (data) => {
  const errors = [];
  
  // Mother HIV status validation
  if (data.motherHIVStatus === 'positive') {
    if (!data.motherClinicID) {
      errors.push('Mother Clinic ID is required when mother is HIV positive');
    }
    if (!data.motherARTNumber) {
      errors.push('Mother ART Number is required when mother is HIV positive');
    }
  }
  
  // Infant specific validations
  if (data.patientType === 'infant') {
    if (!data.birthDate) {
      errors.push('Birth date is required for infants');
    }
    if (!data.motherHIVStatus) {
      errors.push('Mother HIV status is required for infants');
    }
    if (!data.weight) {
      errors.push('Weight is required for infants');
    }
    if (!data.height) {
      errors.push('Height is required for infants');
    }
  }
  
  // Delivery date validation for infants
  if (data.patientType === 'infant' && data.birthDate && data.deliveryDate) {
    if (!moment(data.birthDate).isSame(moment(data.deliveryDate), 'day')) {
      errors.push('Birth date should be equal to delivery date');
    }
  }
  
  return errors;
};

// Age calculation utilities
export const calculateAge = (birthDate, visitDate) => {
  const birthMoment = moment(birthDate);
  const visitMoment = moment(visitDate);
  
  if (!birthMoment.isValid() || !visitMoment.isValid()) {
    return null;
  }
  
  const ageInMonths = visitMoment.diff(birthMoment, 'months');
  
  if (ageInMonths < 12) {
    return {
      value: ageInMonths,
      unit: 'months',
      display: `${ageInMonths} months`
    };
  } else {
    const ageInYears = Math.floor(ageInMonths / 12);
    return {
      value: ageInYears,
      unit: 'years',
      display: `${ageInYears} years`
    };
  }
};

// Status determination based on age (WHO guidelines)
export const determinePatientStatus = (ageInMonths) => {
  if (ageInMonths > 24) {
    return {
      status: 0,
      text: 'Lost (Age > 24 months)',
      reason: 'WHO guideline: Infants over 24 months should be marked as lost'
    };
  } else if (ageInMonths <= 3) {
    return {
      status: -1,
      text: 'Active (Under 3 months)',
      reason: 'WHO guideline: Infants under 3 months are actively monitored'
    };
  } else {
    return {
      status: -1,
      text: 'Active',
      reason: 'Standard active status for infants 3-24 months'
    };
  }
};

// Next appointment calculation based on WHO guidelines
export const calculateNextAppointment = (ageInMonths, lastVisitDate) => {
  const lastVisit = moment(lastVisitDate);
  
  if (ageInMonths <= 6) {
    return lastVisit.add(1, 'month').format('YYYY-MM-DD');
  } else if (ageInMonths <= 12) {
    return lastVisit.add(2, 'months').format('YYYY-MM-DD');
  } else {
    return lastVisit.add(3, 'months').format('YYYY-MM-DD');
  }
};

// Data quality checks
export const checkDataQuality = (patient) => {
  const alerts = [];
  
  // Check for missing viral load
  if (!patient.viralLoad && patient.age > 12) {
    alerts.push({
      type: 'warning',
      message: 'Viral load test overdue',
      field: 'viralLoad'
    });
  }
  
  // Check for overdue visits
  if (patient.lastVisit) {
    const monthsSinceLastVisit = moment().diff(moment(patient.lastVisit), 'months');
    if (monthsSinceLastVisit > 3) {
      alerts.push({
        type: 'error',
        message: `Patient overdue for visit (${monthsSinceLastVisit} months)`,
        field: 'lastVisit'
      });
    }
  }
  
  // Check for missing critical data
  if (patient.patientType === 'infant' && !patient.motherHIVStatus) {
    alerts.push({
      type: 'warning',
      message: 'Mother HIV status is required for infants',
      field: 'motherHIVStatus'
    });
  }
  
  return alerts;
};

// Smart defaults based on previous visits
export const getSmartDefaults = (patientId, previousVisits) => {
  if (!previousVisits || previousVisits.length === 0) {
    return {};
  }
  
  const lastVisit = previousVisits[0];
  const ageInMonths = lastVisit.age || 0;
  
  return {
    weight: lastVisit.weight || null,
    height: lastVisit.height || null,
    nextAppointment: calculateNextAppointment(ageInMonths, lastVisit.visitDate),
    // Copy other relevant fields from last visit
    feedingStatus: lastVisit.feedingStatus || null,
    cotrimoxazole: lastVisit.cotrimoxazole || null
  };
};

// Contextual help based on patient type and age
export const getContextualHelp = (patientType, ageInMonths) => {
  const help = [];
  
  if (patientType === 'infant') {
    if (ageInMonths <= 6) {
      help.push('WHO recommends monthly visits for infants under 6 months');
      help.push('Monitor weight and height growth closely');
    } else if (ageInMonths <= 12) {
      help.push('WHO recommends bi-monthly visits for infants 6-12 months');
      help.push('Continue monitoring growth and development');
    } else {
      help.push('WHO recommends quarterly visits for infants 12-24 months');
      help.push('Prepare for potential transfer to child care');
    }
  }
  
  return help;
};

// Form field requirements based on patient type and status
export const getRequiredFields = (patientType, age, hivStatus) => {
  const fields = ['clinicId', 'visitDate'];
  
  if (patientType === 'infant') {
    fields.push('birthDate', 'motherHIVStatus', 'weight', 'height');
    if (hivStatus === 'positive') {
      fields.push('artNumber');
    }
  } else if (patientType === 'child') {
    fields.push('birthDate', 'weight', 'height');
    if (hivStatus === 'positive') {
      fields.push('artNumber', 'whoStage');
    }
  } else if (patientType === 'adult') {
    fields.push('birthDate');
    if (hivStatus === 'positive') {
      fields.push('artNumber', 'whoStage');
    }
  }
  
  return fields;
};
