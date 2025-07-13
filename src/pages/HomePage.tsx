import React from "react";
import { Container, Box } from "@mui/material";
import QuoteForm from "../components/QuoteForm";
import CTA from "../components/CTA"; // 👈 Import new component

const HomePage: React.FC = () => {
  return (
    <Container sx={{ pt: 6 }}>
      <Box sx={{ mt: 4 }}>
        <CTA />
      </Box>
      <Box sx={{ mt: 4 }}>
        <QuoteForm />
      </Box>
    </Container>
  );
};

export default HomePage;
