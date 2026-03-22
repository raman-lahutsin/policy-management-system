import { Alert } from '@mui/material';

export default function ErrorAlert({ error }) {
  if (!error) return null;

  const messages = Array.isArray(error) ? error : [error];

  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {messages.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
    </Alert>
  );
}
