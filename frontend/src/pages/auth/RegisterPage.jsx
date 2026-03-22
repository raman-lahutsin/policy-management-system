import { useState } from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Box, Link,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import ErrorAlert from '../../components/common/ErrorAlert';
import { extractErrors } from '../../utils/helpers';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(form);
    } catch (err) {
      setError(extractErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <ErrorAlert error={error} />
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="first_name"
            fullWidth
            required
            margin="normal"
            value={form.first_name}
            onChange={handleChange}
          />
          <TextField
            label="Last Name"
            name="last_name"
            fullWidth
            required
            margin="normal"
            value={form.last_name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={form.password}
            onChange={handleChange}
          />
          <TextField
            label="Confirm Password"
            name="password_confirmation"
            type="password"
            fullWidth
            required
            margin="normal"
            value={form.password_confirmation}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={submitting}
            sx={{ mt: 2 }}
          >
            {submitting ? 'Registering...' : 'Register'}
          </Button>
          <Box textAlign="center" mt={2}>
            <Link component={RouterLink} to="/login">
              Already have an account? Sign In
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
