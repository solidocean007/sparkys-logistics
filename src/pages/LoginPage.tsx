// src/pages/LoginPage.tsx
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';

const LoginPage: React.FC = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = '/admin'; // Redirect to Admin
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Admin Login
        </Typography>
        <Button variant="contained" onClick={handleLogin}>
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
