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
      <Typography>Estimated Cost: ${price.toFixed(2)}</Typography>
    </Box>
  );
};

export default QuoteResult;
