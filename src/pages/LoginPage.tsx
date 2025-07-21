import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from "@mui/material";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../utils/firebase";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/admin"; // Redirect to admin
    } catch (err) {
      console.error("Login failed", err);
      alert("Invalid email or password.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      console.error("Password reset failed", err);
      alert("Could not send reset email. Check the email address.");
    }
  };

  return (
    <Container>
      <Box
        sx={{
          mt: 6,
          maxWidth: 400,
          mx: "auto",
          textAlign: "center",
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Admin Login
        </Typography>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleLogin}
          fullWidth
        >
          Sign In
        </Button>

        <Box sx={{ mt: 2 }}>
          <Link
            component="button"
            onClick={handleForgotPassword}
            sx={{ fontSize: "0.9rem" }}
          >
            Forgot Password?
          </Link>
          {resetSent && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              ✅ Reset email sent! Check your inbox.
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;

