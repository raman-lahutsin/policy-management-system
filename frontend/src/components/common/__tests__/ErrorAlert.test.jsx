import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorAlert from '../ErrorAlert';

describe('ErrorAlert', () => {
  it('renders nothing when error is null', () => {
    const { container } = render(<ErrorAlert error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when error is undefined', () => {
    const { container } = render(<ErrorAlert error={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a single error string', () => {
    render(<ErrorAlert error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders an array of error messages', () => {
    render(<ErrorAlert error={['Error 1', 'Error 2']} />);
    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.getByText('Error 2')).toBeInTheDocument();
  });

  it('renders with error severity alert', () => {
    render(<ErrorAlert error="Oops" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
