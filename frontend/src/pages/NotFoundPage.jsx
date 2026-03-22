import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={8}>
        <Typography variant="h2" gutterBottom>404</Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Page not found
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
}
