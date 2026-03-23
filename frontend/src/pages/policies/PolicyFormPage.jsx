import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Typography, TextField, Button, Box, Paper, Grid, MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { createPolicy, updatePolicy, getPolicy } from '../../api/policiesApi';
import { getAccounts } from '../../api/accountsApi';
import { INSURANCE_TYPES, POLICY_STATUSES } from '../../utils/constants';
import ErrorAlert from '../../components/common/ErrorAlert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { extractErrors } from '../../utils/helpers';

const initialForm = {
  account_id: '',
  insurance_type: 'general_liability',
  status: 'draft',
  description: '',
  premium: '',
  coverage: '',
  effective_date: '',
  expiration_date: '',
};

export default function PolicyFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState({
    ...initialForm,
    account_id: searchParams.get('accountId') || '',
  });
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const promises = [
      getAccounts(1).then((res) => setAccounts(res.data)),
    ];
    if (isEdit) {
      promises.push(
        getPolicy(id).then((res) => {
          const p = res.data;
          setForm({
            account_id: p.account_id || p.account?.id || '',
            insurance_type: p.insurance_type || '',
            status: p.status || 'draft',
            description: p.description || '',
            premium: p.premium ?? '',
            coverage: p.coverage ?? '',
            effective_date: p.effective_date || '',
            expiration_date: p.expiration_date || '',
          });
        })
      );
    }
    Promise.all(promises)
      .catch((err) => setError(extractErrors(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        premium: parseInt(form.premium, 10),
        coverage: parseInt(form.coverage, 10),
      };
      if (isEdit) {
        const { status, ...updatePayload } = payload;
        await updatePolicy(id, updatePayload);
        navigate(`/policies/${id}`);
      } else {
        await createPolicy(payload);
        navigate('/policies');
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
        {isEdit ? 'Edit Policy' : 'New Policy'}
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 700 }}>
        <ErrorAlert error={error} />
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="Account"
                name="account_id"
                select
                fullWidth
                required
                value={form.account_id}
                onChange={handleChange}
              >
                <MenuItem value="">Select an account</MenuItem>
                {accounts.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.first_name} {a.last_name} ({a.email})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Insurance Type"
                name="insurance_type"
                select
                fullWidth
                required
                value={form.insurance_type}
                onChange={handleChange}
              >
                {INSURANCE_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Status"
                name="status"
                select
                fullWidth
                required
                value={form.status}
                onChange={handleChange}
              >
                {POLICY_STATUSES.map((s) => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Premium ($)"
                name="premium"
                type="number"
                fullWidth
                required
                value={form.premium}
                onChange={handleChange}
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Coverage ($)"
                name="coverage"
                type="number"
                fullWidth
                required
                value={form.coverage}
                onChange={handleChange}
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Effective Date"
                value={form.effective_date ? dayjs(form.effective_date) : null}
                onChange={(val) => setForm((prev) => ({
                  ...prev,
                  effective_date: val ? val.format('YYYY-MM-DD') : '',
                }))}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Expiration Date"
                value={form.expiration_date ? dayjs(form.expiration_date) : null}
                onChange={(val) => setForm((prev) => ({
                  ...prev,
                  expiration_date: val ? val.format('YYYY-MM-DD') : '',
                }))}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box display="flex" gap={1} mt={3}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Saving...' : (isEdit ? 'Update Policy' : 'Create Policy')}
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
