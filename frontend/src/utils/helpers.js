export function extractErrors(error) {
  const data = error.response?.data;
  if (data?.errors) return data.errors;
  if (data?.error) return [data.error];
  return [error.message || 'An unexpected error occurred'];
}
