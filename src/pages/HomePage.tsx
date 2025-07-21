import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import QuoteForm from "../components/QuoteForm";
import CTA from "../components/CTA";

const HomePage: React.FC = () => {
  const [quoteActive, setQuoteActive] = useState(false);

  const handleQuoteStart = () => {
    setQuoteActive(true);
  };

  const handleQuoteFinished = () => {
    setQuoteActive(false);
    // ✅ Smooth scroll back to the top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        backgroundImage: 'url("/Images/TruckScenicWebP.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // 👈 adds parallax
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
      }}
    >
      <Box
        sx={{
          // backgroundColor: "rgba(255, 255, 255, 0.15)", now this looks better
          backdropFilter: "blur(5px)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          // p: 4,
          maxWidth: "600px",
          width: "90%",
          textAlign: "center",
          color: "#fff", // this is too white for the background
        }}
      >
        {!quoteActive && <CTA />}
      </Box>
      <Box sx={{ mt: 4, width: "100%", maxWidth: "600px" }}>
        <QuoteForm
          onQuoteSubmitted={handleQuoteStart}
          onQuoteCompleted={handleQuoteFinished}
        />
      </Box>
    </Container>
  );
};

export default HomePage;
