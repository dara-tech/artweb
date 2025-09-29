/**
 * Tests for age calculation utility
 */

import { 
  getCorrectAgeGroup, 
  isChildAgeGroup, 
  isAdultAgeGroup, 
  getCorrectPatientType,
  filterByAgeGroup,
  filterByGenderAndAgeGroup,
  getDemographicBreakdown
} from '../ageCalculator';

describe('Age Calculator Utility', () => {
  describe('getCorrectAgeGroup', () => {
    test('should return 0-14 for typepatients ≤14', () => {
      const record = { typepatients: '≤14', age: 20 };
      expect(getCorrectAgeGroup(record)).toBe('0-14');
    });

    test('should return 15+ for typepatients 15+', () => {
      const record = { typepatients: '15+', age: 10 };
      expect(getCorrectAgeGroup(record)).toBe('15+');
    });

    test('should return 15+ for typepatients Adult', () => {
      const record = { typepatients: 'Adult', age: 10 };
      expect(getCorrectAgeGroup(record)).toBe('15+');
    });

    test('should use calculated age when typepatients is incorrect', () => {
      const record = { typepatients: '≤14', age: 20 };
      expect(getCorrectAgeGroup(record)).toBe('0-14'); // typepatients takes priority
    });

    test('should fallback to calculated age when typepatients is missing', () => {
      const record = { age: 10 };
      expect(getCorrectAgeGroup(record)).toBe('0-14');
    });

    test('should fallback to calculated age when typepatients is missing', () => {
      const record = { age: 20 };
      expect(getCorrectAgeGroup(record)).toBe('15+');
    });

    test('should default to 15+ when both fields are missing', () => {
      const record = {};
      expect(getCorrectAgeGroup(record)).toBe('15+');
    });
  });

  describe('isChildAgeGroup', () => {
    test('should return true for 0-14 age group', () => {
      const record = { typepatients: '≤14' };
      expect(isChildAgeGroup(record)).toBe(true);
    });

    test('should return false for 15+ age group', () => {
      const record = { typepatients: '15+' };
      expect(isChildAgeGroup(record)).toBe(false);
    });
  });

  describe('isAdultAgeGroup', () => {
    test('should return true for 15+ age group', () => {
      const record = { typepatients: '15+' };
      expect(isAdultAgeGroup(record)).toBe(true);
    });

    test('should return false for 0-14 age group', () => {
      const record = { typepatients: '≤14' };
      expect(isAdultAgeGroup(record)).toBe(false);
    });
  });

  describe('getCorrectPatientType', () => {
    test('should return Child for 0-14 age group', () => {
      const record = { typepatients: '≤14' };
      expect(getCorrectPatientType(record)).toBe('Child');
    });

    test('should return Adult for 15+ age group', () => {
      const record = { typepatients: '15+' };
      expect(getCorrectPatientType(record)).toBe('Adult');
    });
  });

  describe('filterByAgeGroup', () => {
    const records = [
      { typepatients: '≤14', age: 10, sex: 1 },
      { typepatients: '15+', age: 20, sex: 0 },
      { typepatients: 'Adult', age: 5, sex: 1 }, // Incorrect typepatients
      { age: 12, sex: 0 }, // No typepatients
    ];

    test('should filter 0-14 age group correctly', () => {
      const result = filterByAgeGroup(records, '0-14');
      expect(result).toHaveLength(3); // First, third (age 5), and fourth (age 12) records
    });

    test('should filter 15+ age group correctly', () => {
      const result = filterByAgeGroup(records, '15+');
      expect(result).toHaveLength(1); // Second record
    });
  });

  describe('filterByGenderAndAgeGroup', () => {
    const records = [
      { typepatients: '≤14', age: 10, sex: 1 }, // Male child
      { typepatients: '15+', age: 20, sex: 0 }, // Female adult
      { typepatients: 'Adult', age: 5, sex: 1 }, // Male child (incorrect typepatients)
      { age: 12, sex: 0 }, // Female child (no typepatients)
    ];

    test('should filter male 0-14 correctly', () => {
      const result = filterByGenderAndAgeGroup(records, 'male', '0-14');
      expect(result).toHaveLength(2); // First and third records
    });

    test('should filter female 15+ correctly', () => {
      const result = filterByGenderAndAgeGroup(records, 'female', '15+');
      expect(result).toHaveLength(1); // Second record
    });
  });

  describe('getDemographicBreakdown', () => {
    const records = [
      { typepatients: '≤14', age: 10, sex: 1 }, // Male child
      { typepatients: '15+', age: 20, sex: 0 }, // Female adult
      { typepatients: 'Adult', age: 5, sex: 1 }, // Male child (incorrect typepatients)
      { age: 12, sex: 0 }, // Female child (no typepatients)
    ];

    test('should calculate demographic breakdown correctly', () => {
      const result = getDemographicBreakdown(records);
      expect(result).toEqual({
        male014: 2, // First and third records
        female014: 1, // Fourth record
        male15Plus: 0,
        female15Plus: 1, // Second record
        total: 4
      });
    });

    test('should handle empty array', () => {
      const result = getDemographicBreakdown([]);
      expect(result).toEqual({
        male014: 0,
        female014: 0,
        male15Plus: 0,
        female15Plus: 0,
        total: 0
      });
    });

    test('should handle null/undefined input', () => {
      const result = getDemographicBreakdown(null);
      expect(result).toEqual({
        male014: 0,
        female014: 0,
        male15Plus: 0,
        female15Plus: 0,
        total: 0
      });
    });
  });
});
