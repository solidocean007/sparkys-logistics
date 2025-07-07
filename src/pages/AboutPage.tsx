import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AboutPage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          About Sparky's Logistics
        </Typography>
        <Typography variant="body1">
          We provide reliable box truck delivery services across regional and long-haul routes. Learn more about our mission and service areas.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutPage;
