/**
 * Age calculation utility to match backend validation logic
 * This ensures frontend age group calculations are consistent with the backend
 */

/**
 * Determines the correct age group for a patient record
 * @param {Object} record - Patient record with age and typepatients fields
 * @returns {string} - Age group: '0-14' or '15+'
 */
export const getCorrectAgeGroup = (record) => {
  const { age, typepatients } = record;
  
  // Priority 1: Use calculated age as primary source (matches backend logic)
  // This handles data integrity issues where adults are incorrectly stored in child tables
  if (age !== undefined && age !== null) {
    return age <= 14 ? '0-14' : '15+';
  }
  
  // Priority 2: Use typepatients field as fallback if age is not available
  if (typepatients === '≤14') {
    return '0-14';
  } else if (typepatients === '15+' || typepatients === 'Adult') {
    return '15+';
  }
  
  // Default fallback
  return '15+';
};

/**
 * Determines if a patient is in the 0-14 age group
 * @param {Object} record - Patient record with age and typepatients fields
 * @returns {boolean} - True if patient is 0-14 years old
 */
export const isChildAgeGroup = (record) => {
  return getCorrectAgeGroup(record) === '0-14';
};

/**
 * Determines if a patient is in the 15+ age group
 * @param {Object} record - Patient record with age and typepatients fields
 * @returns {boolean} - True if patient is 15+ years old
 */
export const isAdultAgeGroup = (record) => {
  return getCorrectAgeGroup(record) === '15+';
};

/**
 * Gets the correct patient type display
 * @param {Object} record - Patient record with age and typepatients fields
 * @returns {string} - Patient type: 'Child' or 'Adult'
 */
export const getCorrectPatientType = (record) => {
  return isChildAgeGroup(record) ? 'Child' : 'Adult';
};

/**
 * Filters records by age group using correct calculation
 * @param {Array} records - Array of patient records
 * @param {string} ageGroup - Age group to filter by: '0-14' or '15+'
 * @returns {Array} - Filtered records
 */
export const filterByAgeGroup = (records, ageGroup) => {
  if (!Array.isArray(records)) return [];
  
  return records.filter(record => {
    const correctAgeGroup = getCorrectAgeGroup(record);
    return correctAgeGroup === ageGroup;
  });
};

/**
 * Filters records by gender and age group using correct calculation
 * @param {Array} records - Array of patient records
 * @param {string} gender - Gender to filter by: 'male' or 'female'
 * @param {string} ageGroup - Age group to filter by: '0-14' or '15+'
 * @returns {Array} - Filtered records
 */
export const filterByGenderAndAgeGroup = (records, gender, ageGroup) => {
  if (!Array.isArray(records)) return [];
  
  return records.filter(record => {
    const correctAgeGroup = getCorrectAgeGroup(record);
    const recordGender = record.sex === 1 ? 'male' : record.sex === 0 ? 'female' : null;
    
    return correctAgeGroup === ageGroup && recordGender === gender;
  });
};

/**
 * Counts records by demographic breakdown using correct calculation
 * @param {Array} records - Array of patient records
 * @returns {Object} - Demographic breakdown counts
 */
export const getDemographicBreakdown = (records) => {
  if (!Array.isArray(records)) {
    return {
      male014: 0,
      female014: 0,
      male15Plus: 0,
      female15Plus: 0,
      total: 0
    };
  }
  
  let male014 = 0;
  let female014 = 0;
  let male15Plus = 0;
  let female15Plus = 0;
  
  records.forEach(record => {
    const correctAgeGroup = getCorrectAgeGroup(record);
    const sex = record.sex;
    
    if (sex === 1) { // Male
      if (correctAgeGroup === '0-14') {
        male014++;
      } else {
        male15Plus++;
      }
    } else if (sex === 0) { // Female
      if (correctAgeGroup === '0-14') {
        female014++;
      } else {
        female15Plus++;
      }
    }
  });
  
  return {
    male014,
    female014,
    male15Plus,
    female15Plus,
    total: records.length
  };
};
