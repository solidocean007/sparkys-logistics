import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

interface Props {
  open: boolean;
  selectedDate: Dayjs | null;
  availability: Record<string, { start: Dayjs | null; end: Dayjs | null }>;
  onClose: () => void;
  onTimeChange: (key: "start" | "end", value: Dayjs | null) => void;
  onSave: () => void;
  onRemove: () => void;
}

const TimePickerForDate: React.FC<Props> = ({
  open,
  selectedDate,
  availability,
  onClose,
  onTimeChange,
  onSave,
  onRemove,
}) => {
  const dateStr = selectedDate ? selectedDate.format("YYYY-MM-DD") : "";
  const hasAvailability =
    availability[dateStr]?.start && availability[dateStr]?.end;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEnforceFocus
    >
      <DialogTitle>
        Set Time for {selectedDate?.format("MMMM D, YYYY")}
      </DialogTitle>
      <DialogContent>
        <TimePicker
          label="Start Time"
          value={availability[dateStr]?.start || null}
          onChange={(newValue) => onTimeChange("start", newValue)}
        />
        <TimePicker
          label="End Time"
          sx={{ mt: 2 }}
          value={availability[dateStr]?.end || null}
          onChange={(newValue) => onTimeChange("end", newValue)}
        />
      </DialogContent>
      <DialogActions>
        {hasAvailability && (
          <Button color="error" onClick={onRemove}>
            Remove Availability
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimePickerForDate;
