import React, { useEffect, useState } from "react";
import { Typography, Paper, Box, Button, useMediaQuery } from "@mui/material";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import dayjs, { Dayjs } from "dayjs";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "../../Providers/SnackbarContext";

interface TimeRange {
  start: Dayjs | null;
  end: Dayjs | null;
}

type FirestoreAvailability = Record<
  string,
  { start: string | null; end: string | null }
>;

const AvailabilitySettings: React.FC = () => {
  const [availability, setAvailability] = useState<Record<string, TimeRange>>(
    {}
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const fetchAvailability = async () => {
      const docRef = doc(db, "settings", "availability");
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        const parsed: Record<string, TimeRange> = {};
        Object.entries(data as FirestoreAvailability).forEach(
          ([date, times]) => {
            parsed[date] = {
              start: times.start ? dayjs(times.start, "HH:mm") : null,
              end: times.end ? dayjs(times.end, "HH:mm") : null,
            };
          }
        );
        setAvailability(parsed);
      }
    };
    fetchAvailability();
  }, []);

  const handleSaveTime = async () => {
    if (!selectedDate) return;
    const dateStr = selectedDate.format("YYYY-MM-DD");
    const timeRange = availability[dateStr];

    // ✅ Guard: Ensure both times exist
    if (!timeRange?.start || !timeRange?.end) {
      showSnackbar("Start and end times are required.", "error");
      return;
    }

    try {
      const docRef = doc(db, "settings", "availability");

      // ✅ Convert all Dayjs objects to formatted strings
      const cleanAvailability = Object.fromEntries(
        Object.entries(availability).map(([date, range]) => [
          date,
          {
            start: range.start ? range.start.format("HH:mm") : null,
            end: range.end ? range.end.format("HH:mm") : null,
          },
        ])
      );

      console.log("Saving cleaned availability:", cleanAvailability);

      await setDoc(docRef, cleanAvailability);

      showSnackbar("Availability updated!", "success");
    } catch (err) {
      console.error("🔥 Error saving availability:", err);
      showSnackbar("Failed to save availability.", "error");
    }
  };

  const handleRemoveAvailability = async () => {
    if (!selectedDate) return;
    const dateStr = selectedDate.format("YYYY-MM-DD");
    const updatedAvailability = { ...availability };
    delete updatedAvailability[dateStr];
    setAvailability(updatedAvailability);

    try {
      const docRef = doc(db, "settings", "availability");
      await setDoc(docRef, updatedAvailability);
      showSnackbar("Availability removed", "success");
    } catch (err) {
      console.error("Error removing availability:", err);
      showSnackbar("Failed to remove availability", "error");
    }
  };

  const handleTimeChange = (key: "start" | "end", value: Dayjs | null) => {
    if (!selectedDate) return;
    const dateStr = selectedDate.format("YYYY-MM-DD");
    setAvailability((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [key]: value,
      },
    }));
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        📅 Manage Pickup Availability
      </Typography>
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={3}>
        {/* Calendar */}
        <Box flex={3}>
          <DateCalendar
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            sx={{
              // Force calendar container to expand
              "& .MuiDateCalendar-root": {
                width: "100%", // Full width of its Box
                maxWidth: "100%", // Remove MUI's default max-width
              },
              "& .MuiPickersDay-root": {
                fontSize: "1.5rem", // Bigger numbers
                width: 64, // Wider day cells
                height: 64, // Taller day cells
              },
              "& .MuiDayCalendar-weekContainer": {
                justifyContent: "center", // Center week rows
              },
            }}
            slots={{
              day: (dayProps) => {
                const dateStr = dayProps.day.format("YYYY-MM-DD");
                const timeRange = availability[dateStr];
                const hasAvailability = !!timeRange?.start && !!timeRange?.end;

                return (
                  <PickersDay
                    {...dayProps}
                    sx={{
                      bgcolor: hasAvailability ? "primary.light" : undefined,
                      color: hasAvailability ? "white" : undefined,
                      borderRadius: "50%",
                    }}
                  />
                );
              },
            }}
          />
        </Box>

        {/* Time Inputs */}
        <Box flex={2} p={2} border="1px solid #ccc" borderRadius={2}>
          <Typography variant="subtitle1" gutterBottom>
            Set Time for {selectedDate.format("MMMM D, YYYY")}
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TimePicker
              label="Start Time"
              value={
                availability[selectedDate.format("YYYY-MM-DD")]?.start || null
              }
              onChange={(val) => handleTimeChange("start", val)}
              sx={{ mb: 2 }}
            />
            <TimePicker
              label="End Time"
              value={
                availability[selectedDate.format("YYYY-MM-DD")]?.end || null
              }
              onChange={(val) => handleTimeChange("end", val)}
              sx={{ mb: 2 }}
            />
          </Box>

          <Box mt={2} display="flex" gap={1}>
            <Button
              variant="contained"
              onClick={handleSaveTime}
              disabled={
                !availability[selectedDate.format("YYYY-MM-DD")]?.start ||
                !availability[selectedDate.format("YYYY-MM-DD")]?.end
              }
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleRemoveAvailability}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default AvailabilitySettings;
