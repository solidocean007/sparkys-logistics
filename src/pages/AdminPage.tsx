import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AdminPage: React.FC = () => {
  const isAuthenticated = false; // TODO: replace with real auth logic later

  if (!isAuthenticated) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" color="error">
            Not Authorized
          </Typography>
          <Typography variant="body1">
            You must be signed in as an admin to view this page.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1">
          Here you can update the market rate per mile and manage customer requests.
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminPage;
