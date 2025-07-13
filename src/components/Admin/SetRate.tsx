import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // Tooltip,
  // FormControlLabel,
  // Switch,
} from "@mui/material";
// import {
//   DateCalendar,
//   PickersDay,
//   type PickersDayProps,
// } from "@mui/x-date-pickers";
import { db, auth } from "../../utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
// import dayjs, { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useSnackbar } from "../../Providers/SnackbarContext";
// import RateInputModal from "./RateInputModal";

// interface RatesData {
//   currentRate: {
//     ratePerMile: number;
//     updatedBy: string;
//     updatedAt: string;
//   };
//   dates: Record<string, number>;
//   rates: Record<string, string[]>; // rate -> array of dates
// }

const SetRate: React.FC = () => {
  const showSnackbar = useSnackbar();
  // const [rateModalOpen, setRateModalOpen] = useState(false);
  // const [applyToFuture, setApplyToFuture] = useState(true);
  // const [rateModalTitle, setRateModalTitle] = useState("");
  // const [rateModalInitial, setRateModalInitial] = useState<number | null>(null);

  // const [rateModalSave, setRateModalSave] = useState<(rate: number) => void>(
  //   () => {}
  // );

  const [currentRate, setCurrentRate] = useState<number>(0);
  // const [ratesData, setRatesData] = useState<RatesData>({
  //   currentRate: { ratePerMile: 0, updatedBy: "", updatedAt: "" },
  //   dates: {},
  //   rates: {},
  // });
  // const [dialogOpen, setDialogOpen] = useState(false);
  // const [bulkMode, setBulkMode] = useState(false);
  // const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRates = async () => {
      const docRef = doc(db, "settings", "rate"); // ✅ use rate
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCurrentRate(data.ratePerMile); // ✅ direct read
      }
    };

    fetchRates();
  }, []);

  const handleUpdateRate = async () => {
    const user = auth.currentUser;
    if (!user) {
      showSnackbar("You must be signed in as admin to update rates", "error")
      return;
    }

    const now = dayjs();
    const newEntry = {
      ratePerMile: currentRate,
      updatedBy: user.uid,
      updatedAt: now.toISOString(),
    };

    try {
      await setDoc(doc(db, "settings", "rate"), newEntry); // ✅ write to rate
      showSnackbar("Rate updated successfully!", "success")
    } catch (err) {
      console.error("Error updating rate:", err);
      showSnackbar("Failed to update rate.", "error")
    }
  };

  // const handleDayClick = (date: Dayjs) => {
  //   if (!ratesData || !ratesData.dates) {
  //     console.warn("Rates data not loaded yet.");
  //     return;
  //   }

  //   const dateStr = date.format("YYYY-MM-DD");

  //   if (bulkMode) {
  //     const newSelection = new Set(selectedDates);
  //     if (newSelection.has(dateStr)) {
  //       newSelection.delete(dateStr);
  //     } else {
  //       newSelection.add(dateStr);
  //     }
  //     setSelectedDates(newSelection);
  //   } else {
  //     const existingRate = ratesData?.dates?.[dateStr] || null;

  //     setRateModalTitle(`Set Rate for ${date.format("MMMM D, YYYY")}`);
  //     setRateModalInitial(existingRate || null);
  //     setRateModalSave(
  //       () => (rate: number) => updateRateForDate(dateStr, rate)
  //     );
  //     setRateModalOpen(true);
  //   }
  // };

  // const updateRateForDate = async (dateStr: string, rate: number | null) => {
  //   const user = auth.currentUser;
  //   if (!user) return;

  //   const updatedDates = { ...ratesData.dates };
  //   const updatedRates = { ...ratesData.rates };

  //   const oldRate = updatedDates[dateStr];
  //   if (oldRate && updatedRates[oldRate]) {
  //     updatedRates[oldRate] = updatedRates[oldRate].filter(
  //       (d) => d !== dateStr
  //     );
  //     if (updatedRates[oldRate].length === 0) {
  //       delete updatedRates[oldRate];
  //     }
  //   }

  //   if (rate !== null) {
  //     updatedDates[dateStr] = rate;

  //     if (!updatedRates[rate]) updatedRates[rate] = [];
  //     if (!updatedRates[rate].includes(dateStr)) {
  //       updatedRates[rate].push(dateStr);
  //     }
  //   } else {
  //     delete updatedDates[dateStr];
  //   }

  //   try {
  //     const docRef = doc(db, "settings", "rates");
  //     await setDoc(docRef, {
  //       ...ratesData,
  //       dates: updatedDates,
  //       rates: updatedRates,
  //     });
  //     setRatesData((prev) => ({
  //       ...prev,
  //       dates: updatedDates,
  //       rates: updatedRates,
  //     }));
  //   } catch (err) {
  //     console.error("Error updating rate for date:", err);
  //   }
  // };

  // const applyRateToSelectedDates = () => {
  //   if (selectedDates.size === 0) {
  //     alert("No dates selected.");
  //     return;
  //   }

  //   setRateModalTitle(`Apply Rate to ${selectedDates.size} Dates`);
  //   setRateModalInitial(currentRate);
  //   setRateModalSave(() => (rate: number) => {
  //     selectedDates.forEach((date) => updateRateForDate(date, rate));
  //     setSelectedDates(new Set());
  //   });
  //   setRateModalOpen(true);
  // };

  // const clearRatesForSelectedDates = async () => {
  //   if (selectedDates.size === 0) {
  //     alert("No dates selected.");
  //     return;
  //   }

  //   if (
  //     !window.confirm("Are you sure you want to clear rates for these dates?")
  //   ) {
  //     return;
  //   }

  //   selectedDates.forEach((date) => updateRateForDate(date, null));
  //   setSelectedDates(new Set());
  // };

  // const renderDay = (props: PickersDayProps) => {
  //   // Type 'PickersDayProps' is not generic.
  //   try {
  //     const dateStr = props.day.format("YYYY-MM-DD");
  //     const rate = ratesData?.dates?.[dateStr];
  //     const isSelected = selectedDates.has(dateStr);

  //     return (
  //       <Tooltip title={rate ? `Rate: $${rate}` : ""} placement="top" arrow>
  //         <PickersDay
  //           {...props}
  //           sx={{
  //             bgcolor: isSelected
  //               ? "primary.main"
  //               : rate
  //               ? "secondary.light"
  //               : undefined,
  //             color: isSelected || rate ? "white" : undefined,
  //             borderRadius: "50%",
  //             "&:hover": {
  //               bgcolor: isSelected
  //                 ? "primary.dark"
  //                 : rate
  //                 ? "secondary.main"
  //                 : undefined,
  //             },
  //           }}
  //         />
  //       </Tooltip>
  //     );
  //   } catch (err) {
  //     console.error("Error in renderDay:", err);
  //     return <PickersDay {...props} />;
  //   }
  // };

  return (
    <>
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          💵 Set Market Rate Per Mile
        </Typography>
        <Box display="flex" gap={2} alignItems="center" mb={2}>
          <TextField
            label="Rate per Mile"
            type="number"
            value={currentRate}
            onChange={(e) => setCurrentRate(parseFloat(e.target.value))}
          />
          <Button variant="contained" onClick={handleUpdateRate}>
            Update Rate
          </Button>
        </Box>

        {/* <FormControlLabel
          control={
            <Switch
              checked={applyToFuture}
              onChange={() => setApplyToFuture(!applyToFuture)}
            />
          }
          label="Apply this rate to all future dates"
        />

        <Button
          variant="outlined"
          onClick={() => setDialogOpen(true)}
          sx={{ mt: 2 }}
        >
          📅 View/Edit Rate Calendar
        </Button>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>📅 Rate Calendar</DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Button
                variant={bulkMode ? "contained" : "outlined"}
                onClick={() => {
                  setBulkMode(!bulkMode);
                  setSelectedDates(new Set()); // Clear selection on toggle
                }}
              >
                {bulkMode ? "Exit Bulk Mode" : "Bulk Edit Mode"}
              </Button>
              {bulkMode && (
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={applyRateToSelectedDates}
                  >
                    Apply Rate
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={clearRatesForSelectedDates}
                  >
                    Clear Rates
                  </Button>
                </Box>
              )}
            </Box>
            <DateCalendar
              onChange={(date) => date && handleDayClick(date)}
              slots={{ day: renderDay }}
            />
          </DialogContent>
        </Dialog> */}
      </Paper>
      {/* <RateInputModal
        open={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        onSave={(rate) => {
          rateModalSave(rate);
          setRateModalOpen(false);
        }}
        initialRate={rateModalInitial}
        title={rateModalTitle}
      /> */}
    </>
  );
};

export default SetRate;
