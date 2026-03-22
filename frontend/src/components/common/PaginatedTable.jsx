import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Paper, Typography, Box,
} from '@mui/material';
import LoadingSpinner from './LoadingSpinner';

export default function PaginatedTable({
  columns,
  data,
  meta,
  onPageChange,
  onRowClick,
  loading,
  emptyMessage = 'No records found',
}) {
  if (loading) return <LoadingSpinner />;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} sx={{ fontWeight: 'bold' }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box textAlign="center" py={3}>
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}
                hover={!!onRowClick}
                onClick={() => onRowClick?.(row)}
                sx={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {meta && meta.total_pages > 1 && (
        <TablePagination
          component="div"
          count={meta.total_count}
          page={meta.current_page - 1}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          rowsPerPage={20}
          rowsPerPageOptions={[20]}
        />
      )}
    </TableContainer>
  );
}
