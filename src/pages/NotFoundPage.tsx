import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1">
          Sorry, the page you are looking for does not exist.
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
