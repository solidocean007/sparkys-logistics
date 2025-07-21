import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const CTA: React.FC = () => {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const rateDoc = await getDoc(doc(db, "settings", "rate"));
        if (rateDoc.exists()) {
          setRate(rateDoc.data().ratePerMile);
        }
      } catch (error) {
        console.error("Failed to fetch rate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, []);

  return (
    <Paper
      elevation={6}
      sx={{
        p: 5,
        textAlign: "center",
        backgroundImage:
          "linear-gradient(rgba(25, 118, 210, 0.8), rgba(25, 118, 210, 0.8)), url('/truck-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        borderRadius: 3,
        mt: 4,
      }}
    >
      {/* 👇 Logo added here */}
      <Box sx={{ mb: 3 }}>
        <img
          src="/logo_with_white_circle.png" // Make sure this is in your /public folder
          alt="Sparky's Logistics Logo"
          style={{
            width: "120px",
            height: "auto",
            borderRadius: "50%",
          }}
        />
      </Box>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
        Expedited delivery. Veteran Owned
      </Typography>

      <Typography variant="h5" gutterBottom>
        {loading ? (
          <Typography
            variant="h6"
            component="span"
          >
            Loading rate...
          </Typography>
        ) : (
          <Typography
            variant="h6"
            gutterBottom
            component="span"
          >
            🚚 Rates today as low as: <strong>${rate?.toFixed(2)}</strong> per mile
          </Typography>
        )}
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        Sparky’s Logistics offers reliable and affordable delivery services. Get
        your instant quote now!
      </Typography>

      <Button
        variant="contained"
        size="large"
        sx={{
          mt: 3,
          bgcolor: "secondary.main",
          "&:hover": { bgcolor: "secondary.dark" },
        }}
        onClick={() =>
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          })
        }
      >
        Get a Quote
      </Button>
    </Paper>
  );
};

export default CTA;
