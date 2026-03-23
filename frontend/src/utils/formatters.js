import dayjs from 'dayjs';

export function formatDate(dateString) {
  if (!dateString) return '';
  return dayjs(dateString).subtract(1, 'day').format('MMM D, YYYY');
}

export function formatCurrency(amount) {
  if (amount == null) return '';
  return `$${(Number(amount) / 100).toLocaleString()}`;
}

export function formatInsuranceType(type) {
  if (!type) return '';
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatEndorsementType(type) {
  if (!type) return '';
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
