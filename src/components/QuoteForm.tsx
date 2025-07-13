import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  useTheme,
  Skeleton,
} from "@mui/material";
import LocationInput from "./LocationInput";
import QuoteResult from "./QuoteResult";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../utils/firebase";
import { getDistance } from "../utils/getDistance";
import MapPreview from "./MapPreview";
import { loadGoogleMaps } from "../utils/loadGoogleMaps";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import LeadForm from "./LeadForm";
import { useSnackbar } from "../Providers/SnackbarContext";
import { useAvailability } from "../hooks/useAvailability";

const QuoteForm: React.FC = () => {
  const theme = useTheme();
  const [sdkReady, setSdkReady] = useState(false);
  const { availability, loading: availabilityLoading } = useAvailability();
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
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        console.log("✅ Google Maps SDK ready in QuoteForm");
        setSdkReady(true);
      })
      .catch((err) => {
        console.error("❌ Failed to load Google Maps SDK:", err);
      });
  }, []);

  const clearPickUpInput = () => {
    setPickup("");
    resetForm();
  };

  const clearDropOffInput = () => {
    setDropOff("");
    resetForm();
  };

  const resetForm = () => {
    setQuote(null);
    setShowLeadForm(false);
    setDuration(null);
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
  };

  const handleGetQuote = async () => {
    if (!pickup || !dropOff)
      return showSnackbar("Please enter both locations", "error");

    try {
      const { distance, duration } = await getDistance(pickup, dropOff);

      setDuration(duration);

      const docRef = doc(db, "settings", "rate"); // Change this line
      const docSnap = await getDoc(docRef);
      const ratePerMile = docSnap.exists()
        ? docSnap.data().ratePerMile
        : 3.5;

      setQuote({
        distance: Math.round(distance), // ✅ Rounded
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
        pickupDate: selectedDate?.format("YYYY-MM-DD"),
        pickupTime: selectedTime?.format("HH:mm"),
      });
      showSnackbar("Your request was submitted successfully!", "success");
      resetForm();
    } catch (error) {
      console.error("Error saving lead:", error);
      showSnackbar("Failed to submit your request.", "error");
    }
  };

  // ✅ Clear quote when both locations are empty
  useEffect(() => {
    if (!pickup && !dropOff && quote) {
      setQuote(null);
      setShowLeadForm(false);
      setDuration(null);
    }
  }, [pickup, dropOff, quote]);

  if (!sdkReady) {
    // Show skeleton while SDK loads
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          🚛 Get Your Instant Quote
        </Typography>
        <Skeleton height={56} sx={{ my: 1 }} />
        <Skeleton height={56} sx={{ my: 1 }} />
        <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
      </Paper>
    );
  }
  const times = availability[selectedDate?.format("YYYY-MM-DD") || ""];

  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 2, sm: 4 },
        mt: 4,
        borderRadius: 3,
        maxWidth: 600,
        mx: "auto", // center on page
        backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#fafafa",
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
      }}
    >
      <Typography variant="h5" gutterBottom>
        🚛 Get Your Instant Quote
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <DatePicker
          label="Pickup Date"
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          shouldDisableDate={(date) => {
            const dateStr = date.format("YYYY-MM-DD");
            return !availability[dateStr];
          }}
        />
        <TimePicker
          label="Pickup Time"
          value={selectedTime}
          onChange={(newValue) => setSelectedTime(newValue)}
          minTime={times?.start ? dayjs(times.start, "HH:mm") : undefined}
          maxTime={times?.end ? dayjs(times.end, "HH:mm") : undefined}
        />
      </Box>
      {/* Pickup Input */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <LocationInput
          label="Pickup Location"
          value={pickup}
          onChange={setPickup}
        />
        <Button
          onClick={clearPickUpInput}
          size="small"
          color="secondary"
          variant="outlined"
        >
          Clear
        </Button>
      </Box>

      {/* Dropoff Input */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <LocationInput
          label="Dropoff Location"
          value={dropOff}
          onChange={setDropOff}
        />
        <Button
          onClick={clearDropOffInput}
          size="small"
          color="secondary"
          variant="outlined"
        >
          Clear
        </Button>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleGetQuote}>
          Get Quote
        </Button>
        <Button variant="outlined" color="error" onClick={resetForm}>
          Reset Form
        </Button>
      </Box>

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
        <LeadForm
          name={name}
          email={email}
          phone={phone}
          notes={notes}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onNotesChange={setNotes}
          onSubmit={handleSubmitLead}
        />
      )}
    </Paper>
  );
};

export default QuoteForm;
