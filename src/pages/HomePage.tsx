import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Sparky's Logistics
        </Typography>
        <Typography variant="body1">
          Reliable trucking and delivery services. Get a fast, dynamic quote today!
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
