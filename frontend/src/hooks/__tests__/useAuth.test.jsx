import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { AuthContext } from '../../context/AuthContext';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('returns context value when inside AuthProvider', () => {
    const mockValue = {
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      isAuthenticated: true,
      login: () => {},
      register: () => {},
      logout: () => {},
    };

    const wrapper = ({ children }) => (
      <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockValue.user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it('throws when used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});
