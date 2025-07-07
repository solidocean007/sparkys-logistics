import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ContactPage: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1">
          Reach out by phone or email to get in touch with Sparky’s team for load inquiries or partnership opportunities.
        </Typography>
      </Box>
    </Container>
  );
};

export default ContactPage;
