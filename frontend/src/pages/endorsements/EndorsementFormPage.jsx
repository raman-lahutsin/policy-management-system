import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, TextField, Button, Box, Paper, Grid, MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { createEndorsement, updateEndorsement, getEndorsement } from '../../api/endorsementsApi';
import { ENDORSEMENT_TYPES } from '../../utils/constants';
import ErrorAlert from '../../components/common/ErrorAlert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { extractErrors } from '../../utils/helpers';

const initialForm = {
  endorsement_type: 'policy_change',
  effective_date: '',
  premium: '',
  description: '',
};

export default function EndorsementFormPage() {
  const { policyId, id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(initialForm);
  const [parentPolicyId, setParentPolicyId] = useState(policyId || '');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getEndorsement(id)
        .then((res) => {
          const e = res.data;
          setParentPolicyId(e.policy_id || e.policy?.id || '');
          setForm({
            endorsement_type: e.endorsement_type || '',
            effective_date: e.effective_date || '',
            premium: e.premium ?? '',
            description: e.description || '',
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
      const { description, ...rest } = form;
      const payload = {
        ...rest,
        premium: parseInt(form.premium, 10),
      };
      if (isEdit) {
        await updateEndorsement(id, payload);
      } else {
        await createEndorsement(policyId, payload);
      }
      navigate(`/policies/${parentPolicyId || policyId}`);
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
        {isEdit ? 'Edit Endorsement' : 'New Endorsement'}
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <ErrorAlert error={error} />
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="Endorsement Type"
                name="endorsement_type"
                select
                fullWidth
                required
                value={form.endorsement_type}
                onChange={handleChange}
              >
                {ENDORSEMENT_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </TextField>
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
              <TextField
                label="Coverage ($)"
                name="premium"
                type="number"
                fullWidth
                required
                value={form.premium}
                onChange={handleChange}
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
              {submitting ? 'Saving...' : (isEdit ? 'Update Endorsement' : 'Create Endorsement')}
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
