import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

interface QuoteResultProps {
  distance: number;
  price: number;
}

const QuoteResult: React.FC<QuoteResultProps> = ({ distance, price }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 3, color: theme.palette.mode === "dark" ? "#fff" : "#000" }}>
      <Typography variant="h6">Your Quote</Typography>
      <Typography>Distance: {distance} miles</Typography>
      <Typography variant="h5" sx={{ my: 1 }}>
        Estimated Cost: <strong>${price.toFixed(2)}</strong>
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        🚚 Like this price? Fill out the form below to request your delivery now!
      </Typography>
    </Box>
  );
};

export default QuoteResult;
