import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PaginatedTable from '../../components/common/PaginatedTable';
import { getAccounts } from '../../api/accountsApi';

const columns = [
  {
    key: 'name',
    label: 'Name',
    render: (row) => `${row.first_name} ${row.last_name}`,
  },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone', render: (row) => row.phone || '-' },
  {
    key: 'location',
    label: 'Location',
    render: (row) => {
      const addr = row.address;
      if (!addr?.city && !addr?.state) return '-';
      return [addr.city, addr.state].filter(Boolean).join(', ');
    },
  },
];

export default function AccountListPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAccounts(page)
      .then((res) => {
        setData(res.data);
        setMeta(res.meta);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Accounts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/accounts/new')}
        >
          New Account
        </Button>
      </Box>
      <PaginatedTable
        columns={columns}
        data={data}
        meta={meta}
        loading={loading}
        onPageChange={setPage}
        onRowClick={(row) => navigate(`/accounts/${row.id}`)}
        emptyMessage="No accounts found"
      />
    </>
  );
}
