import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  useTheme,
} from "@mui/material";
import LocationInput from "./LocationInput";
import QuoteResult from "./QuoteResult";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../utils/firebase";
import { getDistance } from "../utils/getDistance";
import MapPreview from "./MapPreview";

const QuoteForm: React.FC = () => {
  const theme = useTheme();
  const [pickup, setPickup] = useState("");
  const [dropOff, setDropOff] = useState("");
  const [quote, setQuote] = useState<{
    distance: number;
    price: number;
  } | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const clearPickUpInput = () => {
    setPickup("");
  };

  const clearDropOffInput = () => {
    setDropOff("");
  };

  const handleGetQuote = async () => {
    if (!pickup || !dropOff) return alert("Please enter both locations.");

    try {
      const { distance, duration } = await getDistance(pickup, dropOff);

      setDuration(duration);

      const docRef = doc(db, "settings", "rate");
      const docSnap = await getDoc(docRef);
      const ratePerMile = docSnap.exists() ? docSnap.data().ratePerMile : 3.5;

      setQuote({
        distance,
        price: distance * ratePerMile,
      });
      setShowLeadForm(true);
    } catch (error) {
      console.error("Error calculating distance:", error);
      alert("Failed to get quote.");
    }
  };

  const handleSubmitLead = async () => {
    try {
      await addDoc(collection(db, "leads"), {
        name,
        email,
        phone,
        notes,
        pickup,
        dropOff,
        distance: quote?.distance,
        price: quote?.price,
        timestamp: new Date(),
      });
      alert("Your request was submitted successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setShowLeadForm(false);
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Failed to submit your request.");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 4,
        borderRadius: 2,
        backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#fafafa",
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
      }}
    >
      <Typography variant="h5" gutterBottom>
        🚛 Get Your Instant Quote
      </Typography>
      <LocationInput
        label="Pickup Location"
        value={pickup}
        onChange={setPickup}
      />
      <Button onClick={clearPickUpInput}>Clear</Button>
      <LocationInput
        label="Dropoff Location"
        value={dropOff}
        onChange={setDropOff}
      />
      <Button onClick={clearDropOffInput}>Clear</Button>
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleGetQuote}>
        Get Quote
      </Button>

      {quote && (
        <>
          <QuoteResult distance={quote.distance} price={quote.price} />
          {duration && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Estimated driving time: {duration}
            </Typography>
          )}

          <MapPreview pickup={pickup} dropOff={dropOff} />
        </>
      )}

      {showLeadForm && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            📥 Submit Your Request
          </Typography>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Notes for Driver (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            onClick={handleSubmitLead}
          >
            Submit Request
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default QuoteForm;
