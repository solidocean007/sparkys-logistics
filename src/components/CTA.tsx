import React, { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const CTA: React.FC = () => {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [shinePos, setShinePos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollFraction = scrollTop / docHeight;
      setShinePos(scrollFraction * 100); // scale 0–100%
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <Box
      sx={{
        position: "relative",
        backdropFilter: "blur(10px)",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.4)"
            : "rgba(255, 255, 255, 0.1)",
        color: (theme) => (theme.palette.mode === "dark" ? "white" : "black"),

        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        // color: "#fff",
        p: 4,
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: `${shinePos - 10}%`, // move shine based on scroll
          width: "50%",
          height: "100%",
          background: `linear-gradient(120deg, 
          rgba(173, 216, 230, 0.1) 0%,         /* Transparent pastel blue */
          rgba(255, 255, 255, 0.2) 45%,      /* Soft white core */
           rgba(255, 255, 255, 0.25) 50%,     /* Slightly brighter center */
          rgba(255, 255, 255, 0.2) 55%,      /* Fade out again */
          rgba(173, 216, 230, 0.1) 100%        /* Transparent pastel blue */
          )`,

          transform: "skewX(-20deg)",
          pointerEvents: "none",
        },
      }}
    >
      {/* 👇 Logo added here */}
      <Box sx={{ mb: 3 }}>
        <img
          src="/logo_with_white_circle.png"
          alt="Sparky's Logistics Logo"
          style={{
            width: "120px",
            height: "auto",
            borderRadius: "50%",
            filter: "drop-shadow(0 0 12px rgba(0, 0, 0, 0.5))", // 👈 soft dark glow
          }}
        />
      </Box>

      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "black",

          mixBlendMode: "overlay", // makes text interact with glass lighting
          textShadow:
            "0 0 8px rgba(255,255,255,0.4), 0 0 12px rgba(255,255,255,3)",
        }}
      >
        Expedited delivery. Veteran Owned
      </Typography>

      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "black",

          mixBlendMode: "overlay", // makes text interact with glass lighting
          textShadow:
            "0 0 8px rgba(255,255,255,0.4), 0 0 12px rgba(255,255,255,3)",
        }}
      >
        {loading ? (
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: "bold",
              color: "black",

              mixBlendMode: "overlay", // makes text interact with glass lighting
              textShadow:
                "0 0 8px rgba(255,255,255,0.4), 0 0 12px rgba(255,255,255,3)",
            }}
          >
            Loading rate...
          </Typography>
        ) : (
          <Typography
            variant="h6"
            gutterBottom
            component="span"
            sx={{
              fontWeight: "bold",
              color: "black",

              mixBlendMode: "overlay", // makes text interact with glass lighting
              textShadow:
                "0 0 8px rgba(255,255,255,0.4), 0 0 12px rgba(255,255,255,3)",
            }}
          >
            🚚 Rates today as low as: <strong>${rate?.toFixed(2)}</strong> per
            mile
          </Typography>
        )}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          color: "black",

          mixBlendMode: "overlay", // makes text interact with glass lighting
          textShadow:
            "0 0 8px rgba(255,255,255,0.4), 0 0 12px rgba(255,255,255,3)",
        }}
      >
        Sparky’s Logistics offers reliable and affordable delivery services. Get
        your instant quote now!
      </Typography>

      <Button
        variant="contained"
        size="medium"
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
    </Box>
  );
};

export default CTA;
