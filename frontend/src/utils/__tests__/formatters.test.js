import { describe, it, expect } from 'vitest';
import { formatDate, formatCurrency, formatInsuranceType, formatEndorsementType } from '../formatters';

describe('formatDate', () => {
  it('formats a valid date string', () => {
    expect(formatDate('2024-01-15')).toBe('Jan 15, 2024');
  });

  it('formats another date correctly', () => {
    expect(formatDate('2023-12-25')).toBe('Dec 25, 2023');
  });

  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(formatDate('')).toBe('');
  });
});

describe('formatCurrency', () => {
  it('formats a whole number with $ prefix', () => {
    const result = formatCurrency(1000);
    expect(result).toMatch(/^\$1[,.\s]?000$/);
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('formats a small number', () => {
    expect(formatCurrency(50)).toBe('$50');
  });

  it('formats a large number with separators', () => {
    const result = formatCurrency(1000000);
    expect(result).toMatch(/^\$1[,.\s]?000[,.\s]?000$/);
  });

  it('returns empty string for null', () => {
    expect(formatCurrency(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatCurrency(undefined)).toBe('');
  });
});

describe('formatInsuranceType', () => {
  it('formats general_liability', () => {
    expect(formatInsuranceType('general_liability')).toBe('General Liability');
  });

  it('formats professional_liability', () => {
    expect(formatInsuranceType('professional_liability')).toBe('Professional Liability');
  });

  it('formats commercial_property', () => {
    expect(formatInsuranceType('commercial_property')).toBe('Commercial Property');
  });

  it('formats business_owners', () => {
    expect(formatInsuranceType('business_owners')).toBe('Business Owners');
  });

  it('returns empty string for empty input', () => {
    expect(formatInsuranceType('')).toBe('');
  });

  it('returns empty string for null', () => {
    expect(formatInsuranceType(null)).toBe('');
  });
});

describe('formatEndorsementType', () => {
  it('formats policy_change', () => {
    expect(formatEndorsementType('policy_change')).toBe('Policy Change');
  });

  it('formats cancellation', () => {
    expect(formatEndorsementType('cancellation')).toBe('Cancellation');
  });

  it('formats reinstatement', () => {
    expect(formatEndorsementType('reinstatement')).toBe('Reinstatement');
  });

  it('returns empty string for falsy input', () => {
    expect(formatEndorsementType(null)).toBe('');
    expect(formatEndorsementType('')).toBe('');
  });
});
