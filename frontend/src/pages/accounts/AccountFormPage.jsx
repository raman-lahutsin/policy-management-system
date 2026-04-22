import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, TextField, Button, Box, Paper, Grid, MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { createAccount, updateAccount, getAccount } from '../../api/accountsApi';
import { US_STATES } from '../../utils/constants';
import ErrorAlert from '../../components/common/ErrorAlert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { extractErrors } from '../../utils/helpers';

const initialForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  zip_code: '',
};

export default function AccountFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getAccount(id)
        .then((res) => {
          const a = res.data;
          setForm({
            first_name: a.first_name || '',
            last_name: a.last_name || '',
            email: a.email || '',
            phone: a.phone_number || '',
            date_of_birth: a.date_of_birth || '',
            address_line1: a.address?.address_line1 || '',
            address_line2: '',
            city: a.address?.city || '',
            state: a.address?.state || '',
            zip_code: a.address?.zip_code || '',
          });
        })
        .catch((err) => setError(extractErrors(err)))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateAccount(id, form);
        navigate(`/accounts/${id}`);
      } else {
        const res = await createAccount(form);
        navigate(`/accounts/${res.data.id}`);
      }
    } catch (err) {
      setError(extractErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Account' : 'New Account'}
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 700 }}>
        <ErrorAlert error={error} />
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="First Name"
                name="first_name"
                fullWidth
                required
                value={form.first_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Last Name"
                name="last_name"
                fullWidth
                required
                value={form.last_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={form.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                value={form.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Date of Birth"
                value={form.date_of_birth ? dayjs(form.date_of_birth) : null}
                onChange={(val) => setForm((prev) => ({
                  ...prev,
                  date_of_birth: val ? val.format('YYYY-MM-DD') : '',
                }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                Address
              </Typography>
            </Grid>
            <Grid size={12}>
              <TextField
                label="Address Line 1"
                name="address_line1"
                fullWidth
                value={form.address_line1}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Address Line 2"
                name="address_line2"
                fullWidth
                value={form.address_line2}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                label="City"
                name="city"
                fullWidth
                value={form.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="State"
                name="state"
                select
                fullWidth
                value={form.state}
                onChange={handleChange}
              >
                <MenuItem value="">None</MenuItem>
                {US_STATES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Zip Code"
                name="zip_code"
                fullWidth
                value={form.zip_code}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box display="flex" gap={1} mt={3}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Saving...' : (isEdit ? 'Update Account' : 'Create Account')}
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
