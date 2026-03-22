import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Card, CardContent, Button, Box, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPolicy, deletePolicy } from '../../api/policiesApi';
import { getEndorsements } from '../../api/endorsementsApi';
import { formatDate, formatInsuranceType, formatCurrency, formatEndorsementType } from '../../utils/formatters';
import StatusChip from '../../components/common/StatusChip';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { extractErrors } from '../../utils/helpers';

export default function PolicyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [endorsements, setEndorsements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      getPolicy(id),
      getEndorsements(id),
    ])
      .then(([policyRes, endorsementsRes]) => {
        setPolicy(policyRes.data);
        setEndorsements(endorsementsRes.data);
      })
      .catch((err) => setError(extractErrors(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePolicy(id);
      navigate('/policies');
    } catch (err) {
      setError(extractErrors(err));
      setDeleteOpen(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !policy) return <ErrorAlert error={error} />;
  if (!policy) return null;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4">{policy.policy_number}</Typography>
          <StatusChip status={policy.status} />
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/policies/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <ErrorAlert error={error} />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">Insurance Type</Typography>
              <Typography>{formatInsuranceType(policy.insurance_type)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">Account</Typography>
              {policy.account ? (
                <Typography
                  sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate(`/accounts/${policy.account.id}`)}
                >
                  {policy.account.first_name} {policy.account.last_name}
                </Typography>
              ) : (
                <Typography>-</Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">Premium</Typography>
              <Typography>{formatCurrency(policy.premium)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">Coverage</Typography>
              <Typography>{formatCurrency(policy.coverage)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">Effective Date</Typography>
              <Typography>{formatDate(policy.effective_date)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">Expiration Date</Typography>
              <Typography>{formatDate(policy.expiration_date)}</Typography>
            </Grid>
            {policy.description && (
              <Grid size={12}>
                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                <Typography>{policy.description}</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Endorsements</Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/policies/${id}/endorsements/new`)}
        >
          Add Endorsement
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Effective Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Premium</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {endorsements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No endorsements</TableCell>
              </TableRow>
            ) : (
              endorsements.map((end) => (
                <TableRow
                  key={end.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/endorsements/${end.id}/edit`)}
                >
                  <TableCell><StatusChip status={end.endorsement_type} /></TableCell>
                  <TableCell>{formatDate(end.effective_date)}</TableCell>
                  <TableCell>{formatCurrency(end.premium)}</TableCell>
                  <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {end.description || '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Policy"
        message={`Are you sure you want to delete policy ${policy.policy_number}? This will also delete all endorsements.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
