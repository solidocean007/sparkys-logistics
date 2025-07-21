import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  // useTheme,
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
import dayjs, { Dayjs } from "dayjs";
import LeadForm from "./LeadForm";
import { useSnackbar } from "../Providers/SnackbarContext";
import { useAvailability } from "../hooks/useAvailability";
import { calculateRatePerMile } from "../utils/calculateRate";
import "./quoteForm.css";

interface QuoteFormProps {
  onQuoteSubmitted?: () => void;
  onQuoteCompleted?: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  onQuoteSubmitted,
  onQuoteCompleted,
}) => {
  // const theme = useTheme();
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
    setPickup("");
    setDropOff("");
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");

    // ✅ Tell parent we’re done
    if (onQuoteCompleted) onQuoteCompleted();
  };

  const handleGetQuote = async () => {
    if (!pickup || !dropOff) {
      showSnackbar("Please enter both locations", "error");
      return;
    }

    try {
      const { distance, duration } = await getDistance(pickup, dropOff);
      setDuration(duration);

      // 🔥 Pull Jeff’s manually set base rate (optional fallback)
      const docRef = doc(db, "settings", "rate");
      const docSnap = await getDoc(docRef);
      const fallbackRatePerMile = docSnap.exists()
        ? docSnap.data().ratePerMile
        : 3.5;

      // 🔥 Use helper to calculate rate
      const dieselPrice = 3.85; // TODO: replace with API fetch later
      const calculatedRatePerMile = calculateRatePerMile({
        dieselPricePerGallon: dieselPrice,
        truckMpg: 8, // Jeff’s truck efficiency
        fixedCostsPerMile: 0.75, // Truck payment, insurance
        variableCostsPerMile: 0.5, // Maintenance, driver
        profitMarginPercent: 20, // 20% profit margin
      });

      // Decide: use calculated rate or fallback
      const finalRatePerMile = calculatedRatePerMile || fallbackRatePerMile;

      const totalPrice = distance * finalRatePerMile;

      setQuote({
        distance: Math.round(distance),
        price: parseFloat(totalPrice.toFixed(2)),
      });

      setShowLeadForm(true);

      // ✅ Notify parent that a quote has been submitted
      if (onQuoteSubmitted) onQuoteSubmitted();

      // ✅ Scroll to quote section
      setTimeout(() => {
        document
          .getElementById("quote-result-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error calculating distance:", error);
      showSnackbar("Failed to get quote.", "error");
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

      // ✅ Reset form & notify parent
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
        position: "relative",
        backdropFilter: "blur(10px)", // Frosted glass
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.4)"
            : "rgba(255, 255, 255, 0.1)", // Subtle for light mode
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        p: 4,
        maxWidth: "600px",
        width: "100%",
        color: (theme) => (theme.palette.mode === "dark" ? "white" : "black"), // Match text color
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "0",
          width: "100%",
          height: "100%",
          background: `linear-gradient(
    120deg,
    rgba(173, 216, 230, 0.05) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(173, 216, 230, 0.05) 100%
  )`,
          transform: "skewX(-20deg)",
          pointerEvents: "none",
        },
      }}
    >
      <Typography variant="h5" gutterBottom>
        🚛 Get Your Instant Quote
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        {availabilityLoading ? (
          // 🔄 Show skeletons while availability is loading
          <>
            <Skeleton variant="rounded" width="100%" height={56} />
            <Skeleton variant="rounded" width="100%" height={56} />
          </>
        ) : (
          // ✅ Show date & time pickers once availability is loaded
          <>
            <div className="glass-input">
              <DatePicker
                label="Pickup Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                shouldDisableDate={(date) => {
                  const dateStr = date.format("YYYY-MM-DD");
                  return !availability[dateStr];
                }}
              />
            </div>
            <div className="glass-input">
              <TimePicker
                label="Pickup Time"
                value={selectedTime}
                onChange={(newValue) => setSelectedTime(newValue)}
                minTime={times?.start ? dayjs(times.start, "HH:mm") : undefined}
                maxTime={times?.end ? dayjs(times.end, "HH:mm") : undefined}
              />
            </div>
          </>
        )}
      </Box>

      {/* Pickup Input */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <div className="glass-input">
          <LocationInput
            label="Pickup Location"
            value={pickup}
            onChange={setPickup}
            onClear={clearPickUpInput}
          />
        </div>
      </Box>

      {/* Dropoff Input */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <div className="glass-input">
          <LocationInput
            label="Dropoff Location"
            value={dropOff}
            onChange={setDropOff}
            onClear={clearDropOffInput}
          />
        </div>
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
        <div className="glass-input quote-button">
          <Button variant="contained" color="primary" onClick={handleGetQuote}>
            Get Quote
          </Button>
        </div>

        <div className="glass-input reset-form-button">
          <Button variant="outlined" color="error" onClick={resetForm}>
            Reset Form
          </Button>
        </div>
      </Box>

      {quote && (
        <div id="quote-result-section">
          <QuoteResult distance={quote.distance} price={quote.price} />
          {duration && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Estimated driving time: {duration}
            </Typography>
          )}
          <MapPreview pickup={pickup} dropOff={dropOff} />
        </div>
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
