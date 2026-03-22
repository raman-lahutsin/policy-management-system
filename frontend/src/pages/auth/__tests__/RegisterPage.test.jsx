import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../RegisterPage';

vi.mock('../../../hooks/useAuth');

import { useAuth } from '../../../hooks/useAuth';

function renderRegisterPage() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  );
}

describe('RegisterPage', () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      register: mockRegister,
      isAuthenticated: false,
    });
  });

  it('renders registration form with all fields', () => {
    renderRegisterPage();
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /last name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    // Password fields don't have role="textbox"
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    expect(passwordInputs).toHaveLength(2);
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('renders link to login page', () => {
    renderRegisterPage();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  it('calls register with form data on submit', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue(undefined);

    renderRegisterPage();

    await user.type(screen.getByRole('textbox', { name: /first name/i }), 'John');
    await user.type(screen.getByRole('textbox', { name: /last name/i }), 'Doe');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'john@test.com');

    const passwordInputs = document.querySelectorAll('input[type="password"]');
    await user.type(passwordInputs[0], 'password123');
    await user.type(passwordInputs[1], 'password123');

    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(mockRegister).toHaveBeenCalledWith({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@test.com',
      password: 'password123',
      password_confirmation: 'password123',
    });
  });

  it('displays errors on registration failure', async () => {
    const user = userEvent.setup();
    mockRegister.mockRejectedValue({
      response: { data: { errors: ['Email has already been taken'] } },
    });

    renderRegisterPage();

    await user.type(screen.getByRole('textbox', { name: /first name/i }), 'John');
    await user.type(screen.getByRole('textbox', { name: /last name/i }), 'Doe');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'taken@test.com');

    const passwordInputs = document.querySelectorAll('input[type="password"]');
    await user.type(passwordInputs[0], 'password123');
    await user.type(passwordInputs[1], 'password123');

    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Email has already been taken')).toBeInTheDocument();
    });
  });
});
