import React, { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import TruckTransition from "../components/TruckTransition/TruckTransition";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Typography, Paper } from "@mui/material";
import './aboutPage.css'

const AboutPage: React.FC = () => {
  const [aboutText, setAboutText] = useState("");
  useEffect(() => {
    const fetchAboutText = async () => {
      try {
        const docRef = doc(db, "settings", "aboutPage");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutText(docSnap.data().text);
        }
      } catch (err) {
        console.error("Error fetching About page text:", err);
      }
    };

    fetchAboutText();
  }, []);
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          About Sparky's Logistics
        </Typography>
        <Typography variant="body1">
          {aboutText ||
            "We provide reliable box truck delivery services across regional and long-haul routes. Learn more about our mission and service areas."}
        </Typography>
        <Box>
          <TruckTransition
            photoSrc="/Images/truckLiftGateWEBP.webp"
            blueprintSrc="/Images/truckBluePrintsWEBP.webp"
          />
        </Box>
      </Box>
      <Paper
        sx={{
          p: 4,
          backgroundColor: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(5px)",
          mb: 6,
        }}
      >
        <Typography variant="h5" gutterBottom>
          🚚 Truck Information Sheet
        </Typography>

        <Box
          className="info-grid"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            mt: 2,
          }}
        >
          <Box className="info-column" sx={{ flex: "1 1 200px" }}>
            <div className="info-item">
              <strong>Owner:</strong> <span>Sparky's Logistics LLC</span>
            </div>
            <div className="info-item">
              <strong>Vehicle:</strong> <span>2021 International MV607</span>
            </div>
            <div className="info-item">
              <strong>Miles:</strong> <span>191,352</span>
            </div>
            <div className="info-item">
              <strong>Color:</strong> <span>White</span>
            </div>
          </Box>

          <Box className="info-column" sx={{ flex: "1 1 200px" }}>
            <div className="info-item">
              <strong>Drive Axles:</strong> <span>Single</span>
            </div>
            <div className="info-item">
              <strong>Fuel Type:</strong> <span>Diesel</span>
            </div>
            <div className="info-item">
              <strong>Engine:</strong> <span>Cummins B6.7</span>
            </div>
            <div className="info-item">
              <strong>Horsepower:</strong> <span>240</span>
            </div>
            <div className="info-item">
              <strong>Transmission:</strong> <span>AUTO</span>
            </div>
          </Box>

          <Box className="info-column" sx={{ flex: "1 1 200px" }}>
            <div className="info-item">
              <strong>Rear Suspension:</strong> <span>Air Ride</span>
            </div>
            <div className="info-item">
              <strong>Rear Axle Ratio:</strong> <span>4.63</span>
            </div>
            <div className="info-item">
              <strong>Tire Size:</strong> <span>22.5</span>
            </div>
            <div className="info-item">
              <strong>Wheels:</strong> <span>All Steel</span>
            </div>
            <div className="info-item">
              <strong>Wheelbase:</strong> <span>187 in</span>
            </div>
            <div className="info-item">
              <strong>GVW:</strong> <span>25,999 lbs</span>
            </div>
          </Box>

          <Box className="info-column" sx={{ flex: "1 1 200px" }}>
            <div className="info-item">
              <strong>Height:</strong> <span>150 in (12' 6")</span>
            </div>
            <div className="info-item">
              <strong>Width:</strong> <span>102 in</span>
            </div>
            <div className="info-item">
              <strong>Length:</strong> <span>312 in (26 ft)</span>
            </div>
            <div className="info-item" style={{ marginTop: "1rem" }}>
              <strong>Extra Features:</strong>
              <ul style={{ margin: "0.25rem 0 0 1rem", padding: 0 }}>
                <li>Lift Gate</li>
                <li>ELD</li>
                <li>Dash Cam</li>
              </ul>
            </div>
          </Box>
        </Box>
      </Paper>
      ;
    </Container>
  );
};

export default AboutPage;
