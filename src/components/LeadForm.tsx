import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

interface LeadFormProps {
  name: string;
  email: string;
  phone: string;
  notes: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({
  name,
  email,
  phone,
  notes,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onNotesChange,
  onSubmit,
}) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Submit Your Request
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          fullWidth
        />
        <TextField
          label="Phone"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          fullWidth
        />
        <TextField
          label="Notes (Optional)"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={onSubmit}
        >
          Submit Request
        </Button>
      </Box>
    </Box>
  );
};

export default LeadForm;
