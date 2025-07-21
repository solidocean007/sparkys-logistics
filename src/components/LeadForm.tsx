import React, { useEffect, useRef } from "react";
import { Box, TextField, Button } from "@mui/material";

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
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // ✅ Scroll down if autofill populates all fields
  useEffect(() => {
    const filled =
      name.trim() !== "" && email.trim() !== "" && phone.trim() !== "";

    if (filled && submitButtonRef.current) {
      submitButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [name, email, phone]); // Watch for changes

  return (
    <Box sx={{ mt: 3 }}>
      <TextField
        label="Name"
        fullWidth
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Phone"
        fullWidth
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Notes"
        multiline
        rows={3}
        fullWidth
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        ref={submitButtonRef} // 👈 attach ref for scrolling
        variant="contained"
        color="primary"
        onClick={onSubmit}
      >
        Submit Request
      </Button>
    </Box>
  );
};

export default LeadForm;
