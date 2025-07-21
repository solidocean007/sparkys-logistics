import React, { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import TruckTransition from "../components/TruckTransition/TruckTransition";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

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
            specs={[
              "📦 Box Size: 14’ L x 7’ W x 8’ H",
              "🚚 Liftgate: Hydraulic, 1,500 lbs",
              "📏 Max Payload: 4,500 lbs",
            ]}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default AboutPage;
