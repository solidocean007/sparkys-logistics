import React, { useState } from "react";
import { Box, Typography, Slider, Paper, useTheme, Button } from "@mui/material";
import "./truckTransition.css";
import { useNavigate } from "react-router-dom";

interface TruckTransitionProps {
  photoSrc: string;
  blueprintSrc: string;
}

const TruckTransition: React.FC<TruckTransitionProps> = ({
  photoSrc,
  blueprintSrc,
}) => {
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState(100); // Start with slider to the right
  const theme = useTheme();

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      {/* Slider Above Container */}
      <Box sx={{ px: 4, pb: 2 }}>
        <Slider
          value={sliderValue}
          onChange={handleSliderChange}
          aria-labelledby="truck-transition-slider"
          sx={{
            color: theme.palette.primary.main,
            height: 6, // Keep slider thickness consistent
            "& .MuiSlider-thumb": {
              backgroundColor: theme.palette.secondary.main,
              width: 24,
              height: 24,
            },
            "& .MuiSlider-track": {
              backgroundColor: theme.palette.primary.main,
              border: "none",
            },
            "& .MuiSlider-rail": {
              backgroundColor: theme.palette.grey[400],
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Image Transition Container */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "500px",
          overflow: "hidden",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* Real Truck Photo */}
        <Box
          component="img"
          src={photoSrc}
          alt="Truck Photo"
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scale(1)", // normal on large screens
            "@media (max-width: 600px)": {
              transform: "scale(0.87)", // slight zoom out on small screens
            },
            transition: "opacity 0.5s ease",
            opacity: sliderValue / 100, // Invert transition logic
          }}
        />

        {/* Blueprint Image */}
        <Box
          component="img"
          src={blueprintSrc}
          alt="Truck Blueprint"
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            opacity: 1 - sliderValue / 100, // Invert transition logic
            // transform: `scale(${1 + (100 - sliderValue) / 200})`,
            transform: `scale(${1 - sliderValue / 300})`,
          }}
        />

        {/* Glass Panel for Specs */}
        <Paper
          className="glass-panel"
          sx={
            {
              position: "absolute",
              right: 16,
              top: 16, // Anchor at the top
              transform: `translateY(${(100 - sliderValue) * 3.5}px)`, // Move down as sliderValue decreases
              transition: "transform 0.3s ease", // Smooth sliding
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(0,0,0,0.4)"
                  : "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "12px",
              padding: 2,
              color: "black",
              // color:
              //   theme.palette.mode === "dark"
              //     ? theme.palette.grey[50] // Very light text for dark mode
              //     : theme.palette.text.primary,
              maxWidth: "300px",
              "--glow-color": theme.palette.primary.main,
            } as React.CSSProperties
          }
          elevation={3}
        >
          <Typography variant="h6" gutterBottom>
            {sliderValue > 66
              ? "Veteran-Owned. Mission-Focused."
              : sliderValue > 33
              ? "Fast, dependable, box truck delivery."
              : "We deliver with integrity. Get a quote today."}
          </Typography>

          <Button
            variant="contained"
            size="small"
            sx={{ mt: 2 }}
             onClick={() => navigate("/#get-quote")}
          >
            Get a Quote
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default TruckTransition;
