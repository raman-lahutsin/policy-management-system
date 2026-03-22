import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusChip from '../StatusChip';

describe('StatusChip', () => {
  it('renders active status with formatted label', () => {
    render(<StatusChip status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders draft status', () => {
    render(<StatusChip status="draft" />);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders expired status', () => {
    render(<StatusChip status="expired" />);
    expect(screen.getByText('Expired')).toBeInTheDocument();
  });

  it('renders cancelled status', () => {
    render(<StatusChip status="cancelled" />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('renders underscore-separated types with title case', () => {
    render(<StatusChip status="policy_change" />);
    expect(screen.getByText('Policy Change')).toBeInTheDocument();
  });

  it('renders reinstatement', () => {
    render(<StatusChip status="reinstatement" />);
    expect(screen.getByText('Reinstatement')).toBeInTheDocument();
  });
});
