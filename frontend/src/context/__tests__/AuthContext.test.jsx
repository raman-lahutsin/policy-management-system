import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthContext';
import { useAuth } from '../../hooks/useAuth';
import * as authApi from '../../api/authApi';

vi.mock('../../api/authApi');

function TestConsumer() {
  const { user, loading, isAuthenticated, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'unauthenticated'}</div>
      {user && <div data-testid="user-email">{user.email}</div>}
      <button onClick={() => login('test@test.com', 'pass')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('starts unauthenticated when no token in localStorage', async () => {
    renderWithProvider();
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    });
  });

  it('validates existing token on mount via getMe', async () => {
    localStorage.setItem('token', 'existing-token');
    authApi.getMe.mockResolvedValue({ user: { id: '1', email: 'existing@test.com' } });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('existing@test.com');
    });
  });

  it('clears token when getMe fails (invalid token)', async () => {
    localStorage.setItem('token', 'bad-token');
    authApi.getMe.mockRejectedValue(new Error('Unauthorized'));

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    });
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('login stores token and sets user', async () => {
    const user = userEvent.setup();
    authApi.login.mockResolvedValue({
      token: 'new-token',
      user: { id: '1', email: 'test@test.com' },
    });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    });

    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@test.com');
    });
    expect(localStorage.getItem('token')).toBe('new-token');
  });

  it('logout clears state and localStorage', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', 'existing-token');
    authApi.getMe.mockResolvedValue({ user: { id: '1', email: 'user@test.com' } });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    await user.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('unauthenticated');
    });
    expect(localStorage.getItem('token')).toBeNull();
  });
});
