import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useSnackbar } from "../../Providers/SnackbarContext";

interface RateInputModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (rate: number) => void;
  initialRate: number | null;
  title: string;
}

const RateInputModal: React.FC<RateInputModalProps> = ({
  open,
  onClose,
  onSave,
  initialRate,
  title,
}) => {
  const [rate, setRate] = useState<string>("");
  const showSnackbar= useSnackbar();

  useEffect(() => {
    setRate(initialRate !== null ? initialRate.toString() : "");
  }, [initialRate]);

  const handleSave = () => {
    const parsedRate = parseFloat(rate);
    if (isNaN(parsedRate) || parsedRate <= 0) {
      showSnackbar("Please enter a valid positive rate.", "success")
      return;
    }
    onSave(parsedRate);
    setRate(""); // Clear after save
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Rate per Mile"
          type="number"
          fullWidth
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RateInputModal;
