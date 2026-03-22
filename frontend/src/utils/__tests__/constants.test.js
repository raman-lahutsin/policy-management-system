import { describe, it, expect } from 'vitest';
import { INSURANCE_TYPES, POLICY_STATUSES, ENDORSEMENT_TYPES, US_STATES } from '../constants';

describe('INSURANCE_TYPES', () => {
  it('has 4 types', () => {
    expect(INSURANCE_TYPES).toHaveLength(4);
  });

  it('each entry has value and label', () => {
    INSURANCE_TYPES.forEach((type) => {
      expect(type).toHaveProperty('value');
      expect(type).toHaveProperty('label');
      expect(type.value).toBeTruthy();
      expect(type.label).toBeTruthy();
    });
  });

  it('includes general_liability', () => {
    expect(INSURANCE_TYPES.find((t) => t.value === 'general_liability')).toBeDefined();
  });
});

describe('POLICY_STATUSES', () => {
  it('has 4 statuses', () => {
    expect(POLICY_STATUSES).toHaveLength(4);
  });

  it('includes draft, active, expired, cancelled', () => {
    const values = POLICY_STATUSES.map((s) => s.value);
    expect(values).toContain('draft');
    expect(values).toContain('active');
    expect(values).toContain('expired');
    expect(values).toContain('cancelled');
  });
});

describe('ENDORSEMENT_TYPES', () => {
  it('has 3 types', () => {
    expect(ENDORSEMENT_TYPES).toHaveLength(3);
  });

  it('includes policy_change, cancellation, reinstatement', () => {
    const values = ENDORSEMENT_TYPES.map((t) => t.value);
    expect(values).toContain('policy_change');
    expect(values).toContain('cancellation');
    expect(values).toContain('reinstatement');
  });
});

describe('US_STATES', () => {
  it('has 51 entries (50 states + DC)', () => {
    expect(US_STATES).toHaveLength(51);
  });

  it('includes common states', () => {
    expect(US_STATES).toContain('CA');
    expect(US_STATES).toContain('NY');
    expect(US_STATES).toContain('TX');
    expect(US_STATES).toContain('DC');
  });

  it('has no duplicates', () => {
    const unique = new Set(US_STATES);
    expect(unique.size).toBe(US_STATES.length);
  });
});
