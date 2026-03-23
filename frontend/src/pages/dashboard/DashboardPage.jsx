import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Grid, Card, CardContent, Button, Box, Link,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import { getAccounts } from '../../api/accountsApi';
import { getPolicies } from '../../api/policiesApi';
import { formatDate, formatInsuranceType, formatCurrency } from '../../utils/formatters';
import StatusChip from '../../components/common/StatusChip';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ accounts: 0, policies: 0 });
  const [recentPolicies, setRecentPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAccounts(1), getPolicies(1)])
      .then(([accountsData, policiesData]) => {
        setStats({
          accounts: accountsData.meta.total_count,
          policies: policiesData.meta.total_count,
        });
        setRecentPolicies(policiesData.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Dashboard</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/accounts/new')}
          >
            New Account
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate('/accounts/new')}
          >
            New Policy
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PeopleIcon fontSize="large" color="primary" />
              <Box>
                <Typography variant="h4">{stats.accounts}</Typography>
                <Typography color="text.secondary">Total Accounts</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DescriptionIcon fontSize="large" color="primary" />
              <Box>
                <Typography variant="h4">{stats.policies}</Typography>
                <Typography color="text.secondary">Total Policies</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>Recent Policies</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Policy Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Account</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Premium</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Effective Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentPolicies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No policies yet</TableCell>
              </TableRow>
            ) : (
              recentPolicies.map((policy) => (
                <TableRow
                  key={policy.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/policies/${policy.id}`)}
                >
                  <TableCell>{policy.policy_number}</TableCell>
                  <TableCell>{formatInsuranceType(policy.insurance_type)}</TableCell>
                  <TableCell><StatusChip status={policy.status} /></TableCell>
                  <TableCell>
                    {policy.account ? (
                      <Link
                        component="button"
                        onClick={(e) => { e.stopPropagation(); navigate(`/accounts/${policy.account.id}`); }}
                      >
                        {policy.account.first_name} {policy.account.last_name}
                      </Link>
                    ) : ''}
                  </TableCell>
                  <TableCell>{formatCurrency(policy.premium)}</TableCell>
                  <TableCell>{formatDate(policy.effective_date)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
