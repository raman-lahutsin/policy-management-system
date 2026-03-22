import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaginatedTable from '../PaginatedTable';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status', render: (row) => row.status.toUpperCase() },
];

const sampleData = [
  { id: '1', name: 'Alice', email: 'alice@test.com', status: 'active' },
  { id: '2', name: 'Bob', email: 'bob@test.com', status: 'draft' },
];

describe('PaginatedTable', () => {
  it('shows loading spinner when loading', () => {
    render(
      <PaginatedTable columns={columns} data={[]} meta={null} loading={true} onPageChange={vi.fn()} />
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(
      <PaginatedTable columns={columns} data={sampleData} meta={null} loading={false} onPageChange={vi.fn()} />
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders row data', () => {
    render(
      <PaginatedTable columns={columns} data={sampleData} meta={null} loading={false} onPageChange={vi.fn()} />
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('bob@test.com')).toBeInTheDocument();
  });

  it('uses custom render function for columns', () => {
    render(
      <PaginatedTable columns={columns} data={sampleData} meta={null} loading={false} onPageChange={vi.fn()} />
    );
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
  });

  it('shows empty message when no data', () => {
    render(
      <PaginatedTable columns={columns} data={[]} meta={null} loading={false} onPageChange={vi.fn()} />
    );
    expect(screen.getByText('No records found')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(
      <PaginatedTable
        columns={columns}
        data={[]}
        meta={null}
        loading={false}
        onPageChange={vi.fn()}
        emptyMessage="Nothing here"
      />
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('calls onRowClick when row is clicked', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <PaginatedTable
        columns={columns}
        data={sampleData}
        meta={null}
        loading={false}
        onPageChange={vi.fn()}
        onRowClick={onRowClick}
      />
    );
    await user.click(screen.getByText('Alice'));
    expect(onRowClick).toHaveBeenCalledWith(sampleData[0]);
  });

  it('does not show pagination when total_pages <= 1', () => {
    const meta = { current_page: 1, total_count: 2, total_pages: 1 };
    render(
      <PaginatedTable columns={columns} data={sampleData} meta={meta} loading={false} onPageChange={vi.fn()} />
    );
    expect(screen.queryByLabelText(/rows per page/i)).not.toBeInTheDocument();
  });

  it('shows pagination when total_pages > 1', () => {
    const meta = { current_page: 1, total_count: 40, total_pages: 2 };
    render(
      <PaginatedTable columns={columns} data={sampleData} meta={meta} loading={false} onPageChange={vi.fn()} />
    );
    // MUI uses en-dash (–) or hyphen-minus (-) depending on version
    expect(screen.getByText((content) => content.includes('of 40'))).toBeInTheDocument();
  });
});
