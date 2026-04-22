import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Card, CardContent, Button, Box, Grid, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAccount, deleteAccount } from '../../api/accountsApi';
import { formatDate, formatInsuranceType } from '../../utils/formatters';
import StatusChip from '../../components/common/StatusChip';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { extractErrors } from '../../utils/helpers';

export default function AccountDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    getAccount(id)
      .then((res) => setAccount(res.data))
      .catch((err) => setError(extractErrors(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteAccount(id);
      navigate('/accounts');
    } catch (err) {
      setError(extractErrors(err));
      setDeleteOpen(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !account) return <ErrorAlert error={error} />;
  if (!account) return null;

  const addr = account.address;
  const addressStr = [addr?.address_line1, addr?.address_line2, addr?.city, addr?.state, addr?.zip_code]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          {account.first_name} {account.last_name}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/accounts/${id}/edit`)}
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
              <Typography variant="subtitle2" color="text.secondary">Email</Typography>
              <Typography>{account.email}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
              <Typography>{account.phone || '-'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
              <Typography>{account.date_of_birth || '-'}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">Address</Typography>
              <Typography>{addressStr || '-'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Policies</Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/policies/new?accountId=${id}`)}
        >
          Add Policy
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Policy Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Effective Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Expiration Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!account.policies || account.policies.length === 0) ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No policies</TableCell>
              </TableRow>
            ) : (
              account.policies.map((policy) => (
                <TableRow
                  key={policy.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/policies/${policy.id}`)}
                >
                  <TableCell>{policy.policy_number}</TableCell>
                  <TableCell>{formatInsuranceType(policy.insurance_type)}</TableCell>
                  <TableCell><StatusChip status={policy.status} /></TableCell>
                  <TableCell>{formatDate(policy.effective_date)}</TableCell>
                  <TableCell>{formatDate(policy.expiration_date)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Account"
        message={`Are you sure you want to delete the policy for ${account.first_name} ${account.last_name}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
