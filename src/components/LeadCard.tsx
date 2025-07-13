import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Button, Stack } from "@mui/material";
import type { LeadType } from "../utils/types";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
import CustomConfirmation from "./CustomConfirmation";
import { useSnackbar } from "../Providers/SnackbarContext";

interface LeadCardProps {
  lead: LeadType;
  onMarkAsContacted?: (leadId: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onMarkAsContacted,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const showSnackbar = useSnackbar();
  const handleDeleteLead = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "leads", lead.id));
        // ✅ Show success snackbar
      showSnackbar("Lead deleted successfully!", "success");
      setConfirmOpen(false);
    } catch (err) {
      console.error("Failed to delete lead:", err);
      showSnackbar("Failed to delete lead. Please try again..", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          mb: 2,
          backgroundColor: lead.contacted ? "#f5f5f5" : "white",
          opacity: lead.contacted ? 0.6 : 1,
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {lead.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📧 {lead.email} | 📱 {lead.phone}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography>
              <strong>Pickup:</strong> {lead.pickup}
            </Typography>
            <Typography>
              <strong>Dropoff:</strong> {lead.dropOff}
            </Typography>
            <Typography>
              <strong>Price:</strong> ${lead.price.toFixed(2)}
            </Typography>
            <Typography>
              <strong>Date:</strong>{" "}
              {new Date(lead.timestamp.seconds * 1000).toLocaleString()}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {!lead.contacted && onMarkAsContacted && (
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => onMarkAsContacted(lead.id)}
              >
                Mark as Contacted
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <CustomConfirmation
        isOpen={confirmOpen}
        message="Are you sure you want to delete this lead? This action cannot be undone."
        onConfirm={handleDeleteLead}
        onClose={() => setConfirmOpen(false)}
        loading={loading}
      />
    </>
  );
};

export default LeadCard;
