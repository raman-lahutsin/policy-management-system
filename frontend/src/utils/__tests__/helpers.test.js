import { describe, it, expect } from 'vitest';
import { extractErrors } from '../helpers';

describe('extractErrors', () => {
  it('extracts errors array from response', () => {
    const error = {
      response: { data: { errors: ['Name is required', 'Email is invalid'] } },
    };
    expect(extractErrors(error)).toEqual(['Name is required', 'Email is invalid']);
  });

  it('extracts single error string from response', () => {
    const error = {
      response: { data: { error: 'Not found' } },
    };
    expect(extractErrors(error)).toEqual(['Not found']);
  });

  it('falls back to error.message when no response data', () => {
    const error = { message: 'Network Error' };
    expect(extractErrors(error)).toEqual(['Network Error']);
  });

  it('returns generic message when no message available', () => {
    const error = {};
    expect(extractErrors(error)).toEqual(['An unexpected error occurred']);
  });

  it('prefers errors array over error string', () => {
    const error = {
      response: {
        data: {
          errors: ['Validation failed'],
          error: 'Something went wrong',
        },
      },
    };
    expect(extractErrors(error)).toEqual(['Validation failed']);
  });

  it('handles null response', () => {
    const error = { response: null, message: 'Timeout' };
    expect(extractErrors(error)).toEqual(['Timeout']);
  });
});
