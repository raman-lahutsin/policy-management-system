import { Chip } from '@mui/material';

const STATUS_COLORS = {
  active: 'success',
  draft: 'default',
  expired: 'warning',
  cancelled: 'error',
  policy_change: 'info',
  cancellation: 'error',
  reinstatement: 'success',
};

export default function StatusChip({ status }) {
  const label = status?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <Chip
      label={label}
      color={STATUS_COLORS[status] || 'default'}
      size="small"
    />
  );
}
