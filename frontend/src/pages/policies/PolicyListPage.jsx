import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box, Link } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaginatedTable from '../../components/common/PaginatedTable';
import StatusChip from '../../components/common/StatusChip';
import { getPolicies } from '../../api/policiesApi';
import { formatDate, formatInsuranceType, formatCurrency } from '../../utils/formatters';

export default function PolicyListPage() {
  const navigate = useNavigate();

  const columns = [
    { key: 'policy_number', label: 'Policy Number' },
    {
      key: 'insurance_type',
      label: 'Type',
      render: (row) => formatInsuranceType(row.insurance_type),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusChip status={row.status} />,
    },
    {
      key: 'account',
      label: 'Account',
      render: (row) => row.account ? (
        <Link
          component="button"
          onClick={(e) => { e.stopPropagation(); navigate(`/accounts/${row.account.id}`); }}
        >
          {row.account.first_name} {row.account.last_name}
        </Link>
      ) : '-',
    },
    {
      key: 'premium',
      label: 'Premium',
      render: (row) => formatCurrency(row.premium),
    },
    {
      key: 'effective_date',
      label: 'Effective',
      render: (row) => formatDate(row.effective_date),
    },
    {
      key: 'expiration_date',
      label: 'Expiration',
      render: (row) => formatDate(row.expiration_date),
    },
  ];
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPolicies(page)
      .then((res) => {
        setData(res.data);
        setMeta(res.meta);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Policies</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/policies/new')}
        >
          New Policy
        </Button>
      </Box>
      <PaginatedTable
        columns={columns}
        data={data}
        meta={meta}
        loading={loading}
        onPageChange={setPage}
        onRowClick={(row) => navigate(`/policies/${row.id}`)}
        emptyMessage="No policies found"
      />
    </>
  );
}
