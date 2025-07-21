import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../utils/firebase";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get("oobCode");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    if (!oobCode) {
      alert("Invalid or expired reset link.");
      return;
    }
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      alert("✅ Password reset successful!");
      navigate("/login");
    } catch (err) {
      console.error("Error resetting password:", err);
      alert("Failed to reset password.");
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 6, maxWidth: 400, mx: "auto", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Reset Password
        </Typography>
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleReset}
          fullWidth
        >
          Set New Password
        </Button>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;
