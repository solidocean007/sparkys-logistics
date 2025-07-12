import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import QuoteForm from '../components/QuoteForm';

const HomePage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Sparky's Logistics
        </Typography>
        <Typography variant="body1" gutterBottom>
          Reliable trucking and delivery services. Get a fast, dynamic quote today!
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <QuoteForm />
      </Box>
    </Container>
  );
};

export default HomePage;

