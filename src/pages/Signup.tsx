import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // OPTIONAL: Set role in Firestore
      await setDoc(doc(db, "roles", user.uid), {
        admin: true,
        createdAt: new Date(),
      });
      alert("✅ Account created successfully!");
      window.location.href = "/admin";
    } catch (err: any) {
      console.error("Signup failed", err);
      alert("Failed to create account: " + err.message);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 6, maxWidth: 400, mx: "auto", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>Sign Up</Typography>
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
          onClick={handleSignup}
          fullWidth
        >
          Create Account
        </Button>
      </Box>
    </Container>
  );
};

export default SignupPage;
